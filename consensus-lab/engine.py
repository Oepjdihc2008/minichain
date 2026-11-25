import sys
import time
import sqlite3
import subprocess

DB = "file:data/consensus_v3.db?mode=ro"
ROUNDS = 5

def count_records():
    with sqlite3.connect(DB, uri=True) as db:
        return db.execute(
            "SELECT COUNT(*) FROM rounds"
        ).fetchone()[0]

print("MINICHAIN AUTOMATIC CONSENSUS ENGINE")
print("=" * 55)

initial = count_records()

for i in range(ROUNDS):
    print(f"\nROUND {i+1}/{ROUNDS}", flush=True)

    before = count_records()

    result = subprocess.run(
        [sys.executable, "network_consensus_v3.py"],
        capture_output=True,
        text=True,
        timeout=60
    )

    print(result.stdout)

    if result.returncode != 0:
        raise RuntimeError(result.stderr)

    if count_records() != before + 1:
        raise RuntimeError("Database write failed")

    audit = subprocess.run(
        [sys.executable, "audit_v3.py"],
        capture_output=True,
        text=True,
        timeout=30
    )

    if (
        audit.returncode != 0
        or "HISTORY CHECK: PASS" not in audit.stdout
    ):
        raise RuntimeError("Security audit failed")

    print("DATABASE WRITE: PASS")
    print("HISTORY AUDIT: PASS")

    if i + 1 < ROUNDS:
        time.sleep(3)

print("\n" + "=" * 55)
print("AUTOMATIC ENGINE: PASS")
print("New records:", count_records() - initial)
print("Total records:", count_records())
