import json
import secrets
import hashlib
from copy import deepcopy
from collections import Counter
from validators import rpc, encode
from identity_v4 import load_key, trusted_key
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey

NODES = {
    "A": 8545,
    "B": 8546,
    "C": 8547,
    "D": 8548
}

QUORUM = 3
ROUND = secrets.token_hex(16)

def payload(name, phase, block, proof=""):
    return {
        "protocol": "MiniChain-V5-Lab",
        "chain_id": 31337,
        "round": ROUND,
        "validator": name,
        "phase": phase,
        "height": block[0],
        "hash": block[1],
        "proof": proof
    }

def sign_vote(name, phase, block, proof=""):
    data = payload(name, phase, block, proof)

    return {
        "vote": data,
        "signature": load_key(name).sign(encode(data)).hex()
    }

def verify_certificate(cert, phase, block, proof=""):
    seen = set()

    try:
        for packet in cert:
            data = packet["vote"]
            name = data["validator"]

            if name not in NODES or name in seen:
                return False

            if data != payload(name, phase, block, proof):
                return False

            public = Ed25519PublicKey.from_public_bytes(
                trusted_key(name)
            )

            public.verify(
                bytes.fromhex(packet["signature"]),
                encode(data)
            )

            seen.add(name)

        return len(seen) >= QUORUM

    except Exception:
        return False

def digest(cert):
    ordered = sorted(
        cert,
        key=lambda p: p["vote"]["validator"]
    )
    return hashlib.sha256(encode(ordered)).hexdigest()

heads = {}

print("MINICHAIN TWO-PHASE CONSENSUS")
print("=" * 55)

for name, port in NODES.items():
    try:
        if int(rpc(port, "eth_chainId", []), 16) != 31337:
            raise ValueError("Incorrect chain")

        block = rpc(
            port,
            "eth_getBlockByNumber",
            ["latest", False]
        )

        heads[name] = (
            int(block["number"], 16),
            block["hash"]
        )

        print(f"Validator {name}: ONLINE")

    except Exception:
        print(f"Validator {name}: UNAVAILABLE")

counts = Counter(heads.values())

if not counts or counts.most_common(1)[0][1] < QUORUM:
    raise SystemExit("NO PREVOTE QUORUM")

candidate = counts.most_common(1)[0][0]

print("\nPHASE 1: PREVOTE")

prevotes = []

for name, block in heads.items():
    packet = sign_vote(name, "PREVOTE", block)

    if block == candidate:
        prevotes.append(packet)
        print(f"Validator {name}: SUPPORT")
    else:
        print(f"Validator {name}: DIFFERENT HEAD")

assert verify_certificate(
    prevotes, "PREVOTE", candidate
)

print("PREVOTE CERTIFICATE: PASS")
print("Votes:", len(prevotes), "/ 4")

proof = digest(prevotes)

print("\nPHASE 2: PRECOMMIT")

precommits = []

for name, block in heads.items():
    if block != candidate:
        continue

    if verify_certificate(prevotes, "PREVOTE", candidate):
        precommits.append(
            sign_vote(name, "PRECOMMIT", candidate, proof)
        )
        print(f"Validator {name}: PRECOMMIT SIGNED")

assert verify_certificate(
    precommits, "PRECOMMIT", candidate, proof
)

print("PRECOMMIT CERTIFICATE: PASS")
print("Votes:", len(precommits), "/ 4")

print("\nSECURITY TESTS")

tests = {
    "Insufficient votes": not verify_certificate(
        prevotes[:2], "PREVOTE", candidate
    ),
    "Duplicate validator": not verify_certificate(
        prevotes + [prevotes[0]], "PREVOTE", candidate
    ),
    "Cross-phase replay": not verify_certificate(
        prevotes, "PRECOMMIT", candidate, proof
    ),
    "Incorrect certificate proof": not verify_certificate(
        precommits, "PRECOMMIT", candidate, "invalid"
    )
}

tampered = deepcopy(precommits)
tampered[0]["vote"]["hash"] = "0x" + "ff" * 32

tests["Tampered vote"] = not verify_certificate(
    tampered, "PRECOMMIT", candidate, proof
)

for name, passed in tests.items():
    print(name + ":", "PASS" if passed else "FAIL")

assert all(tests.values())

print("\n" + "=" * 55)
print("SECURITY TESTS: 5/5")
print("TWO-PHASE COMMIT: PASS")
print("Height:", candidate[0])
print("Hash:", candidate[1])
