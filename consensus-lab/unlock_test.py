import json
from copy import deepcopy
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey

NODES = "ABCD"
QUORUM = 3

KEYS = {
    n: Ed25519PrivateKey.generate()
    for n in NODES
}

PUBLIC = {
    n: k.public_key()
    for n, k in KEYS.items()
}

def encode(data):
    return json.dumps(data, sort_keys=True).encode()

def payload(name, height, round_id, block):
    return {
        "protocol": "MiniChain-Unlock-Lab",
        "phase": "PREVOTE",
        "validator": name,
        "height": height,
        "round": round_id,
        "block": block
    }

def certificate(names, height, round_id, block):
    packets = []

    for name in names:
        data = payload(name, height, round_id, block)
        packets.append((
            data,
            KEYS[name].sign(encode(data))
        ))

    return packets

def verify(cert, height, round_id, block):
    seen = set()

    try:
        for data, sig in cert:
            name = data["validator"]

            if name not in PUBLIC or name in seen:
                return False

            if data != payload(
                name, height, round_id, block
            ):
                return False

            PUBLIC[name].verify(sig, encode(data))
            seen.add(name)

        return len(seen) >= QUORUM

    except Exception:
        return False

class Validator:

    def __init__(self, height):
        self.height = height
        self.locked_block = None
        self.locked_round = 0
        self.last_round = 0
        self.last_vote = None

    def prevote(self, round_id, block,
                cert=None, cert_round=0):

        if round_id <= 0 or round_id < self.last_round:
            return False

        if round_id == self.last_round:
            return block == self.last_vote

        if self.locked_block not in (None, block):

            if not (
                self.locked_round < cert_round < round_id
            ):
                return False

            if not verify(
                cert, self.height, cert_round, block
            ):
                return False

        self.last_round = round_id
        self.last_vote = block

        return True

    def precommit(self, round_id, block, cert):

        if (round_id, block) != (
            self.last_round, self.last_vote
        ):
            return False

        if round_id < self.locked_round:
            return False

        if not verify(
            cert, self.height, round_id, block
        ):
            return False

        self.locked_block = block
        self.locked_round = round_id

        return True

X = "BLOCK_X"
Y = "BLOCK_Y"

v = Validator(6)

qc_x1 = certificate("ACD", 6, 1, X)
qc_y2 = certificate("BCD", 6, 2, Y)
qc_y3 = certificate("BCD", 6, 3, Y)

assert v.prevote(1, X)
assert v.precommit(1, X, qc_x1)

forged = deepcopy(qc_y2)
forged[0][0]["block"] = X

tests = []

tests.append((
    "Missing certificate rejected",
    not v.prevote(3, Y)
))

tests.append((
    "Insufficient signatures rejected",
    not v.prevote(3, Y, qc_y2[:2], 2)
))

tests.append((
    "Duplicate signatures rejected",
    not v.prevote(3, Y, [qc_y2[0]] * 3, 2)
))

tests.append((
    "Tampered certificate rejected",
    not v.prevote(3, Y, forged, 2)
))

tests.append((
    "Wrong height rejected",
    not v.prevote(
        3, Y, certificate("BCD", 7, 2, Y), 2
    )
))

tests.append((
    "Stale certificate rejected",
    not v.prevote(
        3, Y, certificate("BCD", 6, 1, Y), 1
    )
))

tests.append((
    "Current round proof rejected",
    not v.prevote(3, Y, qc_y3, 3)
))

tests.append((
    "Valid newer QC accepted",
    v.prevote(3, Y, qc_y2, 2)
))

tests.append((
    "Old lock retained before precommit",
    v.locked_block == X
))

tests.append((
    "Same round conflicting vote rejected",
    not v.prevote(3, X)
))

tests.append((
    "Invalid precommit proof rejected",
    not v.precommit(3, Y, qc_y2)
))

tests.append((
    "New lock established",
    v.precommit(3, Y, qc_y3)
    and v.locked_block == Y
    and v.locked_round == 3
))

tests.append((
    "Round rollback rejected",
    not v.prevote(2, X)
))

print("MINICHAIN SAFE UNLOCK LAB")
print("=" * 55)

for name, passed in tests:
    print(name + ":", "PASS" if passed else "FAIL")

total = sum(passed for _, passed in tests)

print("=" * 55)
print(f"TOTAL: {total}/{len(tests)}")

if total != len(tests):
    raise SystemExit("UNLOCK MODEL: FAIL")

print("UNLOCK MODEL: PASS")
