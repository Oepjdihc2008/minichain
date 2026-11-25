import json
import socket
import subprocess
import time
import urllib.request
from pathlib import Path


def free_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


def rpc(port: int, method: str, params=None):
    payload = json.dumps({
        "jsonrpc": "2.0",
        "id": 1,
        "method": method,
        "params": params or [],
    }).encode()
    req = urllib.request.Request(
        f"http://127.0.0.1:{port}",
        data=payload,
        headers={"Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=5) as resp:
        body = json.load(resp)
    if "error" in body:
        raise RuntimeError(body["error"])
    return body["result"]


def wait_ready(port: int, timeout: float = 8.0) -> None:
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        try:
            if int(rpc(port, "eth_chainId"), 16) == 31337:
                return
        except Exception:
            time.sleep(0.1)
    raise TimeoutError(f"Anvil on port {port} did not start in time")


def wait_receipt(port: int, tx_hash: str, timeout: float = 5.0):
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        receipt = rpc(port, "eth_getTransactionReceipt", [tx_hash])
        if receipt is not None:
            return receipt
        time.sleep(0.05)
    raise TimeoutError(f"Transaction {tx_hash} not mined in time")


def main() -> None:
    root = Path(__file__).resolve().parent.parent / "contracts"
    subprocess.run(["forge", "build"], cwd=root, check=True, capture_output=True)

    artifact = json.loads((root / "out" / "MNC.sol" / "MNC.json").read_text())
    bytecode = artifact["bytecode"]["object"]

    port_src = free_port()
    port_dst = free_port()

    src_proc = subprocess.Popen(
        ["anvil", "--port", str(port_src), "--silent"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    dst_proc = subprocess.Popen(
        ["anvil", "--port", str(port_dst), "--silent"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )

    try:
        wait_ready(port_src)
        wait_ready(port_dst)

        accounts = rpc(port_src, "eth_accounts")
        deployer = accounts[0]
        recipient = accounts[1]

        tx_hash = rpc(port_src, "eth_sendTransaction", [{
            "from": deployer,
            "data": bytecode,
            "gas": hex(1_500_000),
        }])
        receipt = wait_receipt(port_src, tx_hash)
        contract_addr = receipt["contractAddress"]

        # Transfer(address,uint256) selector = 0xa9059cbb
        amount_wei = 250_000 * 10**18
        call_data = (
            "0xa9059cbb"
            + recipient[2:].lower().rjust(64, "0")
            + hex(amount_wei)[2:].rjust(64, "0")
        )
        tx2 = rpc(port_src, "eth_sendTransaction", [{
            "from": deployer,
            "to": contract_addr,
            "data": call_data,
            "gas": hex(120_000),
        }])
        wait_receipt(port_src, tx2)

        src_block = rpc(port_src, "eth_getBlockByNumber", ["latest", False])
        snapshot = rpc(port_src, "anvil_dumpState")

        # Restore snapshot into fresh disaster-recovery node
        loaded = rpc(port_dst, "anvil_loadState", [snapshot])
        if loaded is not True:
            raise RuntimeError("anvil_loadState failed")

        dst_block = rpc(port_dst, "eth_getBlockByNumber", ["latest", False])
        dst_code = rpc(port_dst, "eth_getCode", [contract_addr, "latest"])

        # totalSupply() = 0x18160ddd, balanceOf(address) = 0x70a08231
        supply_hex = rpc(port_dst, "eth_call", [{"to": contract_addr, "data": "0x18160ddd"}, "latest"])
        bal_dep_hex = rpc(port_dst, "eth_call", [{
            "to": contract_addr,
            "data": "0x70a08231" + deployer[2:].lower().rjust(64, "0"),
        }, "latest"])
        bal_rec_hex = rpc(port_dst, "eth_call", [{
            "to": contract_addr,
            "data": "0x70a08231" + recipient[2:].lower().rjust(64, "0"),
        }, "latest"])

        checks = [
            ("Chain ID verified (31337)", int(rpc(port_dst, "eth_chainId"), 16) == 31337),
            ("Block height recovered", src_block["number"] == dst_block["number"]),
            ("Block hash parity", src_block["hash"] == dst_block["hash"]),
            ("State root parity", src_block["stateRoot"] == dst_block["stateRoot"]),
            ("MNC contract bytecode intact", len(dst_code) > 2 and dst_code == rpc(port_src, "eth_getCode", [contract_addr, "latest"])),
            (
                "MNC totalSupply & balances conserved",
                int(supply_hex, 16) == 1_000_000 * 10**18
                and int(bal_dep_hex, 16) == 750_000 * 10**18
                and int(bal_rec_hex, 16) == 250_000 * 10**18,
            ),
        ]

        print("MINICHAIN DISASTER RECOVERY AUDIT")
        print("=" * 55)
        passed = 0
        for label, ok in checks:
            passed += int(ok)
            print(f"{label}: {'PASS' if ok else 'FAIL'}")
        print("=" * 55)
        print(f"TOTAL: {passed}/{len(checks)}")
        if passed != len(checks):
            raise SystemExit("DISASTER RECOVERY: FAIL")
        print("DISASTER RECOVERY: PASS")

    finally:
        for proc in (src_proc, dst_proc):
            proc.terminate()
            try:
                proc.wait(timeout=3)
            except subprocess.TimeoutExpired:
                proc.kill()


if __name__ == "__main__":
    main()
