import json
from collections import Counter
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey

keys = {
    n: Ed25519PrivateKey.generate()
    for n in ["A", "B", "C"]
}

public = {
    n: k.public_key()
    for n, k in keys.items()
}

def encode(data):
    return json.dumps(data, sort_keys=True).encode()

def vote(name, block, signer=None):
    data = {
        "validator": name,
        "chain_id": 31337,
        "round": 1,
        "height": 6,
        "hash": block
    }

    signature = keys[signer or name].sign(encode(data))
    return data, signature

def consensus(votes):
    accepted = {}
    conflicts = set()

    for data, signature in votes:
        try:
            name = data["validator"]

            if data["chain_id"] != 31337:
                continue

            if data["round"] != 1 or data["height"] != 6:
                continue

            public[name].verify(signature, encode(data))

            if name in accepted and accepted[name] != data["hash"]:
                conflicts.add(name)

            accepted[name] = data["hash"]

        except Exception:
            continue

    counts = Counter(
        block for name, block in accepted.items()
        if name not in conflicts
    )

    for block, total in counts.items():
        if total >= 2:
            return block

    return None

a = vote("A", "CHAIN_A")
b = vote("B", "CHAIN_B")
c = vote("C", "CHAIN_A")

forged = vote("B", "CHAIN_A", signer="A")
conflict = vote("A", "CHAIN_B")

tests = [
    ("Normal operation", [a,b,c], "CHAIN_A"),
    ("Node B offline", [a,c], "CHAIN_A"),
    ("Node A offline", [b,c], None),
    ("Two nodes offline", [a], None),
    ("All nodes offline", [], None),
    ("Forged signature", [a,forged], None),
    ("Duplicate voting", [a,a,a], None),
    ("Conflicting votes", [a,conflict,c], None),
]

passed = 0

print("MINICHAIN FAULT TOLERANCE TEST")
print("=" * 50)

for name, votes, expected in tests:
    result = consensus(votes)
    success = result == expected
    passed += int(success)

    print(name + ":", "PASS" if success else "FAIL")

print("=" * 50)
print(f"TOTAL: {passed}/{len(tests)}")
print("FAULT AUDIT:", "PASS" if passed == len(tests) else "FAIL")
