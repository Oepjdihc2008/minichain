import json
import urllib.request
from collections import Counter

NODES = {
    "A": "http://127.0.0.1:8545",
    "B": "http://127.0.0.1:8546"
}

def rpc(url, method, params):
    data = json.dumps({
        "jsonrpc": "2.0",
        "method": method,
        "params": params,
        "id": 1
    }).encode()

    req = urllib.request.Request(
        url, data=data,
        headers={"Content-Type": "application/json"}
    )

    with urllib.request.urlopen(req, timeout=5) as r:
        response = json.load(r)

    if "error" in response:
        raise RuntimeError(response["error"])

    return response["result"]

blocks = {}

for name, url in NODES.items():
    assert int(rpc(url, "eth_chainId", []), 16) == 31337
    block = rpc(url, "eth_getBlockByNumber", ["latest", False])
    blocks[name] = block["hash"]

    print(f"\nNODE {name}")
    print("Height:", int(block["number"], 16))
    print("Hash:", block["hash"])
    print("State Root:", block["stateRoot"])

print("\n--- CONSENSUS SIMULATION ---")

votes = []

for i in range(3):
    vote = input(
        f"Validator {i+1} votes (A/B): "
    ).strip().upper()

    if vote in blocks:
        votes.append(vote)

counts = Counter(votes)

print("\nVotes:", dict(counts))

if counts:
    winner, total = counts.most_common(1)[0]

    if total >= 2:
        print("CONSENSUS REACHED")
        print("Selected chain:", winner)
        print("Selected hash:", blocks[winner])
    else:
        print("NO CONSENSUS")
else:
    print("NO CONSENSUS")
