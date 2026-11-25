import json
import sqlite3
import tempfile
from pathlib import Path
from contextlib import closing
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey

NAMES = ("A", "B", "C", "D")
QUORUM = 3

KEYS = {
    name: Ed25519PrivateKey.generate()
    for name in NAMES
}

PUBLIC = {
    name: key.public_key()
    for name, key in KEYS.items()
}

def encode(data):
    return json.dumps(data, sort_keys=True).encode()

def payload(name, phase, height, round_id, block):
    return {
        "protocol": "MiniChain-Locking-Lab",
        "validator": name,
        "phase": phase,
        "height": height,
        "round": round_id,
        "hash": block
    }

def certificate(names, height, round_id, block):
    result = []

    for name in names:
        data = payload(
            name, "PREVOTE", height, round_id, block
        )
        result.append((
            data,
            KEYS[name].sign(encode(data))
        ))

    return result

def verify(cert, height, round_id, block):
    seen = set()

    try:
        for data, sig in cert:
            name = data["validator"]

            if name not in PUBLIC or name in seen:
                return False

            expected = payload(
                name, "PREVOTE", height, round_id, block
            )

            if data != expected:
                return False

            PUBLIC[name].verify(sig, encode(data))
            seen.add(name)

        return len(seen) >= QUORUM

    except Exception:
        return False

class LockStore:

    def __init__(self, path):
        self.path = path

        with closing(sqlite3.connect(path)) as db, db:
            db.execute("""
                CREATE TABLE IF NOT EXISTS locks (
                    validator TEXT,
                    height INTEGER,
                    round_id INTEGER NOT NULL,
                    block_hash TEXT NOT NULL,
                    PRIMARY KEY (validator, height)
                )
            """)

    def precommit(self, name, height, round_id, block, cert):

        if name not in KEYS:
            return None

        if not verify(cert, height, round_id, block):
            return None

        with closing(sqlite3.connect(self.path)) as db, db:
            db.execute("BEGIN IMMEDIATE")

            old = db.execute("""
                SELECT round_id, block_hash
                FROM locks
                WHERE validator = ? AND height = ?
            """, (name, height)).fetchone()

            if old:
                old_round, old_hash = old

                if block != old_hash:
                    return None

                if round_id < old_round:
                    return None

            db.execute("""
                INSERT OR REPLACE INTO locks
                VALUES (?, ?, ?, ?)
            """, (name, height, round_id, block))

        # Sign only after the lock is committed
        data = payload(
            name, "PRECOMMIT", height, round_id, block
        )

        return data, KEYS[name].sign(encode(data))

X = "0x" + "11" * 32
Y = "0x" + "22" * 32

with tempfile.TemporaryDirectory() as tmp:

    path = Path(tmp) / "locks.db"
    store = LockStore(path)

    cert_x = certificate("ACD", 6, 1, X)
    cert_x2 = certificate("ACD", 6, 2, X)
    cert_y2 = certificate("BCD", 6, 2, Y)

    tests = []

    tests.append((
        "Insufficient certificate",
        store.precommit("A", 6, 1, X, cert_x[:2]) is None
    ))

    tests.append((
        "Duplicate signatures",
        store.precommit("A", 6, 1, X, [cert_x[0]] * 3) is None
    ))

    tests.append((
        "Wrong round certificate",
        store.precommit("A", 6, 2, X, cert_x) is None
    ))

    tests.append((
        "Initial block lock",
        store.precommit("A", 6, 1, X, cert_x) is not None
    ))

    tests.append((
        "Same block next round",
        store.precommit("A", 6, 2, X, cert_x2) is not None
    ))

    tests.append((
        "Conflicting block rejection",
        store.precommit("A", 6, 2, Y, cert_y2) is None
    ))

    tests.append((
        "Old round rejection",
        store.precommit("A", 6, 1, X, cert_x) is None
    ))

    # Reopen persistent storage
    store = LockStore(path)

    tests.append((
        "Persistent lock recovery",
        store.precommit("A", 6, 2, Y, cert_y2) is None
    ))

    cert_next = certificate("ACD", 7, 1, Y)

    tests.append((
        "Next height independent lock",
        store.precommit("A", 7, 1, Y, cert_next) is not None
    ))

    print("MINICHAIN BLOCK LOCKING LAB")
    print("=" * 55)

    for name, passed in tests:
        print(name + ":", "PASS" if passed else "FAIL")

    total = sum(int(passed) for _, passed in tests)

    print("=" * 55)
    print(f"TOTAL: {total}/{len(tests)}")

    if total != len(tests):
        raise SystemExit("BLOCK LOCKING: FAIL")

    print("BLOCK LOCKING: PASS")
