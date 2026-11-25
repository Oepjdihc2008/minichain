import sqlite3
import tempfile
from pathlib import Path
from contextlib import closing

class FinalityStore:

    def __init__(self, path):
        self.path = path

        with closing(sqlite3.connect(path)) as db, db:
            db.execute("""
                CREATE TABLE IF NOT EXISTS finalized (
                    height INTEGER PRIMARY KEY,
                    hash TEXT NOT NULL
                )
            """)

    def commit(self, height, block_hash, verified_voters):
        # Storage-layer simulation:
        # Assume these voters have already been verified.
        if not set(verified_voters).issubset(set("ABCD")):
            return False

        if len(set(verified_voters)) < 3:
            return False

        with closing(sqlite3.connect(self.path)) as db, db:
            db.execute("BEGIN IMMEDIATE")

            old = db.execute(
                "SELECT hash FROM finalized WHERE height = ?",
                (height,)
            ).fetchone()

            if old:
                return old[0] == block_hash

            db.execute(
                "INSERT INTO finalized VALUES (?, ?)",
                (height, block_hash)
            )

        return True

    def get(self, height):
        with closing(sqlite3.connect(self.path)) as db:
            row = db.execute(
                "SELECT hash FROM finalized WHERE height = ?",
                (height,)
            ).fetchone()

        return row[0] if row else None

X = "0x" + "11" * 32
Y = "0x" + "22" * 32

with tempfile.TemporaryDirectory() as tmp:

    path = Path(tmp) / "finality.db"
    store = FinalityStore(path)

    tests = {
        "Insufficient quorum":
            not store.commit(6, X, ["A", "C"]),

        "Duplicate voters":
            not store.commit(6, X, ["A", "A", "A"]),

        "Unknown validator":
            not store.commit(6, X, ["A", "C", "Z"]),

        "Valid finalization":
            store.commit(6, X, ["A", "C", "D"]),

        "Finalized block retained":
            store.get(6) == X,

        "Idempotent commit":
            store.commit(6, X, ["A", "C", "D"]),

        "Conflicting finalization rejected":
            not store.commit(6, Y, ["B", "C", "D"])
    }

    store = FinalityStore(path)

    tests["Persistent finality"] = store.get(6) == X

    tests["Conflict rejected after reopening"] = (
        not store.commit(6, Y, ["B", "C", "D"])
    )

    tests["Next height accepted"] = (
        store.commit(7, Y, ["A", "C", "D"])
    )

    print("MINICHAIN FINALITY STORAGE LAB")
    print("=" * 55)

    for name, passed in tests.items():
        print(name + ":", "PASS" if passed else "FAIL")

    print("=" * 55)
    print(f"TOTAL: {sum(tests.values())}/{len(tests)}")

    if not all(tests.values()):
        raise SystemExit("FINALITY STORAGE: FAIL")

    print("FINALITY STORAGE: PASS")
