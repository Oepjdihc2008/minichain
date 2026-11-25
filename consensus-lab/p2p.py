import json
import urllib.request
import threading
from http.server import BaseHTTPRequestHandler
from http.server import ThreadingHTTPServer

def rpc(port, method, params=None):
    data = json.dumps({
        "jsonrpc": "2.0",
        "id": 1,
        "method": method,
        "params": params or []
    }).encode()

    req = urllib.request.Request(
        f"http://127.0.0.1:{port}",
        data=data,
        headers={"Content-Type": "application/json"}
    )

    with urllib.request.urlopen(req, timeout=5) as r:
        result = json.load(r)

    if "error" in result:
        raise RuntimeError(result["error"])

    return result["result"]

def head(port):
    chain_id = int(rpc(port, "eth_chainId"), 16)

    if chain_id != 31337:
        raise RuntimeError("Incorrect network")

    block = rpc(
        port, "eth_getBlockByNumber",
        ["latest", False]
    )

    return {
        "chain_id": chain_id,
        "height": int(block["number"], 16),
        "hash": block["hash"],
        "parent": block["parentHash"],
        "state_root": block["stateRoot"]
    }

def fetch(port):
    with urllib.request.urlopen(
        f"http://127.0.0.1:{port}/head",
        timeout=5
    ) as r:
        return json.load(r)

def handler(name, rpc_port, peer_port):
    class Peer(BaseHTTPRequestHandler):
        def do_GET(self):
            if self.path == "/head":
                result = head(rpc_port)

            elif self.path == "/compare":
                local = head(rpc_port)
                remote = fetch(peer_port)

                result = {
                    "node": name,
                    "peer_connected": True,
                    "local_height": local["height"],
                    "remote_height": remote["height"],
                    "same_hash":
                        local["hash"] == remote["hash"],
                    "same_parent":
                        local["parent"] == remote["parent"],
                    "same_state":
                        local["state_root"] ==
                        remote["state_root"]
                }

            else:
                self.send_error(404)
                return

            self.send_response(200)
            self.send_header(
                "Content-Type", "application/json"
            )
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())

        def log_message(self, *args):
            pass

    return Peer

servers = [
    ThreadingHTTPServer(
        ("127.0.0.1", 9101),
        handler("A", 8545, 9102)
    ),
    ThreadingHTTPServer(
        ("127.0.0.1", 9102),
        handler("B", 8546, 9101)
    )
]

for server in servers:
    threading.Thread(
        target=server.serve_forever,
        daemon=True
    ).start()

try:
    print("MINICHAIN PEER NETWORK")
    print("Peer A: ONLINE")
    print("Peer B: ONLINE")

    for port in [9101, 9102]:
        with urllib.request.urlopen(
            f"http://127.0.0.1:{port}/compare",
            timeout=10
        ) as r:
            print(json.dumps(json.load(r), indent=2))

    print("PEER EXCHANGE COMPLETE")

finally:
    for server in servers:
        server.shutdown()
        server.server_close()
