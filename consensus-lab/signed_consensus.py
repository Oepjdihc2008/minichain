import json
import urllib.request
from collections import Counter
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey

NODES = {"A": 8545, "B": 8546, "C": 8547}

def rpc(port, method, params):
    req = urllib.request.Request(
        f"http://127.0.0.1:{port}",
        data=json.dumps({
            "jsonrpc": "2.0",
            "method": method,
            "params": params,
            "id": 1
        }).encode(),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=5) as r:
        response = json.load(r)
        if "error" in response:
            raise RuntimeError(response["error"])
        return response["result"]

keys = {
    name: Ed25519PrivateKey.generate()
    for name in NODES
}

public_keys = {
    name: key.public_key()
    for name, key in keys.items()
}

votes = []
seen = set()
counts = Counter()

def encode(data):
    return json.dumps(data, sort_keys=True).encode()

def accept(data, signature):
    try:
        name = data["validator"]

        if name in seen:
            return False

        if data["chain_id"] != 31337:
            return False

        public_keys[name].verify(
            signature, encode(data)
        )

        seen.add(name)
        votes.append(data)
        counts[(data["height"], data["hash"])] += 1
        return True

    except Exception:
        return False

print("MINICHAIN SIGNED CONSENSUS")

for name, port in NODES.items():
    if int(rpc(port, "eth_chainId", []), 16) != 31337:
        raise RuntimeError("Incorrect network")

    block = rpc(
        port, "eth_getBlockByNumber",
        ["latest", False]
    )

    data = {
        "validator": name,
        "chain_id": 31337,
        "height": int(block["number"], 16),
        "hash": block["hash"]
    }

    signature = keys[name].sign(encode(data))

    # Test modified vote
    tampered = dict(data)
    tampered["hash"] = "INVALID"

    assert not accept(tampered, signature)

    # Accept genuine vote
    assert accept(data, signature)

    # Reject duplicate vote
    assert not accept(data, signature)

    print(f"Validator {name}: SIGNATURE VALID")

print("Tampering detection: PASS")
print("Duplicate rejection: PASS")

winner, total = counts.most_common(1)[0]

print("Valid votes:", len(votes))
print("Majority votes:", total)

if total >= 2:
    print("CONSENSUS SIMULATION: PASS")
    print("Selected height:", winner[0])
    print("Selected hash:", winner[1])
else:
    print("NO CONSENSUS")

