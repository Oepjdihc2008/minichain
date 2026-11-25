import json
import runpy
import sqlite3
import hashlib
from copy import deepcopy
from pathlib import Path
from contextlib import closing
from validators import encode
from identity_v4 import trusted_key
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey

NODES = set("ABCD")

def verify(record):
    try:
        height = record["height"]
        block = record["hash"]
        round_id = record["round"]

        if type(height) is not int or height < 0:
            return False

        if len(block) != 66 or not block.startswith("0x"):
            return False

        bytes.fromhex(block[2:])

        if not isinstance(round_id, str) or not round_id:
            return False

        proof = ""

        for phase, field in [
            ("PREVOTE", "prevotes"),
            ("PRECOMMIT", "precommits")
        ]:
            seen = set()
            cert = record[field]

            for packet in cert:
                vote = packet["vote"]
                name = vote["validator"]

                if name not in NODES or name in seen:
                    return False

                expected = {
                    "protocol": "MiniChain-V5-Lab",
                    "chain_id": 31337,
                    "round": round_id,
                    "validator": name,
                    "phase": phase,
                    "height": height,
                    "hash": block,
                    "proof": proof
                }

                if vote != expected:
                    return False

                public = Ed25519PublicKey.from_public_bytes(
                    trusted_key(name)
                )

                public.verify(
                    bytes.fromhex(packet["signature"]),
                    encode(vote)
                )

                seen.add(name)

            if len(seen) < 3:
                return False

            proof = hashlib.sha256(
                encode(sorted(
                    cert,
                    key=lambda p: p["vote"]["validator"]
                ))
            ).hexdigest()

        return True

    except Exception:
        return False

# Run the previously tested two-phase experiment
result = runpy.run_path("two_phase.py")

height, block_hash = result["candidate"]

record = {
    "height": height,
    "hash": block_hash,
    "round": result["ROUND"],
    "prevotes": result["prevotes"],
    "precommits": result["precommits"]
}

if not verify(record):
    raise RuntimeError("Certificate verification failed")

print("\nINTEGRATED CERTIFICATE: PASS")

tests = {}

bad = deepcopy(record)
bad["precommits"] = bad["precommits"][:2]
tests["Insufficient precommits"] = not verify(bad)

bad = deepcopy(record)
bad["height"] += 1
tests["Incorrect height"] = not verify(bad)

bad = deepcopy(record)
bad["hash"] = "0x" + "ff" * 32
tests["Incorrect block hash"] = not verify(bad)

bad = deepcopy(record)
bad["prevotes"].append(bad["prevotes"][0])
tests["Duplicate validator"] = not verify(bad)

Path("data").mkdir(exist_ok=True)
path = "data/integrated_finality.db"

with closing(sqlite3.connect(path)) as db, db:
    db.execute("""
        CREATE TABLE IF NOT EXISTS finalized (
            height INTEGER PRIMARY KEY,
            hash TEXT NOT NULL,
            certificate TEXT NOT NULL
        )
    """)

    db.execute("BEGIN IMMEDIATE")

    old = db.execute(
        "SELECT hash, certificate FROM finalized WHERE height = ?",
        (height,)
    ).fetchone()

    if old:
        previous = json.loads(old[1])

        if (
            old[0] != block_hash
            or previous["height"] != height
            or previous["hash"] != old[0]
            or not verify(previous)
        ):
            raise RuntimeError("Finality conflict or corrupt record")

    else:
        db.execute(
            "INSERT INTO finalized VALUES (?, ?, ?)",
            (height, block_hash, json.dumps(record))
        )

with closing(sqlite3.connect(path)) as db:
    rows = db.execute(
        "SELECT height, hash, certificate FROM finalized"
    ).fetchall()

    tests["Persistent certificate audit"] = bool(rows) and all(
        verify(json.loads(raw))
        and json.loads(raw)["height"] == h
        and json.loads(raw)["hash"] == b
        for h, b, raw in rows
    )

print("\nMINICHAIN INTEGRATION AUDIT")
print("=" * 55)

for name, passed in tests.items():
    print(name + ":", "PASS" if passed else "FAIL")

if not all(tests.values()):
    raise SystemExit("INTEGRATED FINALITY: FAIL")

print("=" * 55)
print(f"TOTAL: {sum(tests.values())}/{len(tests)}")
print("INTEGRATED FINALITY: PASS")
print("Height:", height)
print("Hash:", block_hash)
print("Stored certificates:", len(rows))
