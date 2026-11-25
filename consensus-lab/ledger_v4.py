import sqlite3
import json
from pathlib import Path
from datetime import datetime, timezone

Path("data").mkdir(exist_ok=True)
DB = "data/consensus_v4.db"

def save_round(challenge, evidence, counts):
    db = sqlite3.connect(DB)

    try:
        db.execute("""
        CREATE TABLE IF NOT EXISTS rounds (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            round_id TEXT UNIQUE NOT NULL,
            timestamp TEXT NOT NULL,
            height INTEGER,
            block_hash TEXT,
            votes INTEGER NOT NULL,
            status TEXT NOT NULL,
            evidence TEXT NOT NULL
        )
        """)

        winner, total = (
            counts.most_common(1)[0]
            if counts else ((None, None), 0)
        )

        status = "CONSENSUS" if total >= 3 else "NO_CONSENSUS"

        db.execute("""
        INSERT INTO rounds (
            round_id, timestamp, height,
            block_hash, votes, status, evidence
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            challenge,
            datetime.now(timezone.utc).isoformat(),
            winner[0] if total >= 3 else None,
            winner[1] if total >= 3 else None,
            total,
            status,
            json.dumps(evidence)
        ))

        db.commit()
        print("CONSENSUS RECORD SAVED")

    finally:
        db.close()

def history():
    db = sqlite3.connect(DB)

    try:
        rows = db.execute("""
        SELECT id, height, votes, status, block_hash
        FROM rounds ORDER BY id DESC
        """).fetchall()

        print("\nMINICHAIN CONSENSUS HISTORY")
        print("=" * 50)

        for id, height, votes, status, h in rows:
            print("Round:", id)
            print("Height:", height)
            print("Votes:", votes)
            print("Status:", status)
            print("Hash:", h)
            print("-" * 50)

        print("Total records:", len(rows))

    finally:
        db.close()

if __name__ == "__main__":
    history()
