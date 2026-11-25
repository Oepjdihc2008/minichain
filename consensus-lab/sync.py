import json
import urllib.request

A = "http://127.0.0.1:8545"
B = "http://127.0.0.1:8546"
C = "http://127.0.0.1:8547"

def rpc(url, method, params=None):
    data = json.dumps({
        "jsonrpc": "2.0",
        "id": 1,
        "method": method,
        "params": params or []
    }).encode()

    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"}
    )

    with urllib.request.urlopen(req, timeout=15) as r:
        response = json.load(r)

    if "error" in response:
        raise RuntimeError(response["error"])

    return response["result"]

def head(node):
    return rpc(
        node,
        "eth_getBlockByNumber",
        ["latest", False]
    )

for node in [A, B, C]:
    if int(rpc(node, "eth_chainId"), 16) != 31337:
        raise RuntimeError("Incorrect network")

a = head(A)
b = head(B)
c = head(C)

print("MINICHAIN SYNC ENGINE")
print("Node A:", int(a["number"], 16))
print("Node B:", int(b["number"], 16))
print("Node C:", int(c["number"], 16))

if a["hash"] != b["hash"]:
    print("DIVERGENCE DETECTED")

    if a["parentHash"] == b["parentHash"]:
        print("COMMON PARENT FOUND")

# Previous simulated vote: A=2, B=1
print("Selected source: A")

if int(c["number"], 16) != 0:
    raise RuntimeError("Node C must be fresh")

state = rpc(A, "anvil_dumpState")

print("Synchronizing Node C...")

if head(A)["hash"] != a["hash"]:
    raise RuntimeError("Source changed during export")

if rpc(C, "anvil_loadState", [state]) is not True:
    raise RuntimeError("Import failed")

c = head(C)

same_height = a["number"] == c["number"]
same_hash = a["hash"] == c["hash"]
same_state = a["stateRoot"] == c["stateRoot"]

print("Height match:", same_height)
print("Hash match:", same_hash)
print("State match:", same_state)

if same_height and same_hash and same_state:
    print("SYNC VERIFIED")
else:
    print("SYNC NOT FULLY VERIFIED")
