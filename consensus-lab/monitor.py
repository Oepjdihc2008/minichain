import json
import urllib.request
import time
from datetime import datetime

NODES = {
    "A": 8545,
    "B": 8546,
    "C": 8547
}

def rpc(port, method, params=None):
    req = urllib.request.Request(
        f"http://127.0.0.1:{port}",
        data=json.dumps({
            "jsonrpc": "2.0",
            "id": 1,
            "method": method,
            "params": params or []
        }).encode(),
        headers={"Content-Type": "application/json"}
    )

    with urllib.request.urlopen(req, timeout=2) as r:
        response = json.load(r)

    if "error" in response:
        raise RuntimeError(response["error"])

    return response["result"]

while True:
    states = {}

    print("\033[2J\033[H", end="")
    print("=" * 60)
    print("       MINICHAIN NETWORK CONTROL CENTER")
    print("=" * 60)
    print(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

    for name, port in NODES.items():
        try:
            if int(rpc(port, "eth_chainId"), 16) != 31337:
                raise RuntimeError("Incorrect network")

            block = rpc(
                port,
                "eth_getBlockByNumber",
                ["latest", False]
            )

            states[name] = block["hash"]

            print(f"\nNODE {name}: ONLINE")
            print("Port:", port)
            print("Height:", int(block["number"], 16))
            print("Hash:", block["hash"][:22] + "...")

        except Exception:
            print(f"\nNODE {name}: UNAVAILABLE")

    print("\n" + "=" * 60)
    print("Online nodes:", len(states), "/ 3")

    if len(states) < 2:
        print("Network: INSUFFICIENT NODES")
    elif len(set(states.values())) == 1:
        print("Network: HEADS MATCH")
    else:
        print("Network: HEAD DIVERGENCE DETECTED")

    for name, h in states.items():
        matches = [
            n for n, other in states.items()
            if h == other
        ]
        print(f"Node {name} matches: {', '.join(matches)}")

    print("\nRefresh: 3 seconds | Ctrl+C to exit")

    time.sleep(3)
