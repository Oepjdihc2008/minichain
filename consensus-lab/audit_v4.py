import json
import sqlite3
from identity_v4 import trusted_key
from collections import Counter
from copy import deepcopy
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey

def encode(data):
    return json.dumps(data, sort_keys=True).encode()

def verify_round(row):
    try:
        rid, challenge, height, block_hash, total, status, raw = row

        evidence = json.loads(raw)
        counts = Counter()
        public_keys = set()

        if not isinstance(evidence, dict):
            return False

        for name, packet in evidence.items():
            vote = packet["vote"]

            if name not in {"A", "B", "C", "D"}:
                return False

            if vote["validator"] != name:
                return False

            if vote["round"] != challenge:
                return False

            if vote["chain_id"] != 31337:
                return False

            if type(vote["height"]) is not int or vote["height"] < 0:
                return False

            h = vote["hash"]

            if len(h) != 66 or not h.startswith("0x"):
                return False

            bytes.fromhex(h[2:])

            key = bytes.fromhex(packet["public_key"])
            if key != trusted_key(name):
                return False

            if key in public_keys:
                return False

            public_keys.add(key)

            public = Ed25519PublicKey.from_public_bytes(key)

            public.verify(
                bytes.fromhex(packet["signature"]),
                encode(vote)
            )

            counts[(vote["height"], vote["hash"])] += 1

        winner, votes = (
            counts.most_common(1)[0]
            if counts else ((None, None), 0)
        )

        if votes != total:
            return False

        if votes >= 3:
            return (
                status == "CONSENSUS"
                and winner == (height, block_hash)
            )

        return (
            status == "NO_CONSENSUS"
            and height is None
            and block_hash is None
        )

    except Exception:
        return False

db = sqlite3.connect(
    "file:data/consensus_v4.db?mode=ro",
    uri=True
)

rows = db.execute("""
SELECT id, round_id, height, block_hash,
       votes, status, evidence
FROM rounds ORDER BY id
""").fetchall()

db.close()

print("MINICHAIN SECURITY AUDIT")
print("=" * 50)

passed = 0

for row in rows:
    valid = verify_round(row)
    passed += int(valid)

    print(
        f"Round #{row[0]}:",
        "PASS" if valid else "FAIL"
    )

print(f"Historical records: {passed}/{len(rows)}")

# Simulate tampering in memory only
if rows and verify_round(rows[0]):
    original = list(rows[0])
    evidence = deepcopy(json.loads(original[6]))

    if evidence:
        name = next(iter(evidence))
        evidence[name]["vote"]["hash"] = "0x" + "ff" * 32

        original[6] = json.dumps(evidence)

        detected = not verify_round(original)

        print("Tampered vote:", "REJECTED" if detected else "FAIL")

    changed = list(rows[0])
    changed[4] += 1

    print(
        "Modified vote count:",
        "REJECTED" if not verify_round(changed) else "FAIL"
    )

print(
    "HISTORY CHECK:",
    "PASS" if rows and passed == len(rows) else "FAIL"
)
