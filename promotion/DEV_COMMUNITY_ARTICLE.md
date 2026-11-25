---
title: "Building MiniChain From First Principles: BFT Split-Lock Deadlocks, Crash-Safe SQLite Locking, and 30,000 Foundry Fuzz Runs"
published: false
description: "An open-source engineering tour through SHA-256 PoW, Ed25519 two-phase BFT consensus labs, SQLite durability, and fuzz-tested Solidity 0.8.28 smart contracts on Ethereum Sepolia."
tags: blockchain, python, solidity, distributedsystems
---

> **Publication Gate:** Drafted for [DEV Community](https://dev.to). Review and insert final GitHub / live site URLs before publishing.

When learning distributed consensus and smart contract engineering, there is often a huge gulf between toy 50-line "hash a Python list" tutorials and 500,000-line production clients.

**MiniChain** is an open-source (MIT) engineering laboratory designed to bridge that gap through small, verifiable, self-contained modules—while being completely transparent about what is simulated vs. what runs on an EVM network.

---

## 1. Two Explicitly Separated Planes

Rather than pretending a weekend consensus script is a production L1 client, MiniChain separates its architecture into two clear planes:

1. **Standalone Python Consensus & Storage Lab (`core-pow/` & `consensus-lab/`)**: Explores `SHA-256` hashing, `Ed25519` validator registries, `3f + 1` quorum intersection, Two-Phase (`PREVOTE` / `PRECOMMIT`) Quorum Certificates, `SQLite` crash-safe locking, and Tendermint-style Proof-of-Lock-Change (PoLC) unlocking.
2. **EVM Smart Contract & Recovery Plane (`contracts/`)**: Zero-dependency `Solidity ^0.8.28` contracts tested with Foundry (`20/20` unit & fuzz tests, `30,000` randomized MNC runs, `6/6` Anvil state disaster recovery checks) and deployed on **Ethereum Sepolia Testnet** (`0x32C80Bb0fd51D32c31b52795a181042BF90E2Ee6`).

*(Note: `MNC` is a strictly experimental testnet token with zero monetary value, and the codebase has not undergone an external commercial audit.)*

---

## 2. Why Strict Cross-Round Locking Deadlocks (81-State Enumeration)

In a 4-validator (`A, B, C, D`), quorum-3 (`3f + 1, f = 1`) BFT protocol, single-round safety holds because any two quorums of size 3 overlap in at least 2 nodes—guaranteeing at least 1 honest node refuses to double-sign.

Across multiple rounds, validators lock on a block upon signing `PRECOMMIT`. What happens if network delays cause two validators (`A, B`) to lock on block `X` and two validators (`C, D`) to lock on block `Y`?

In `consensus-lab/cross_round_test.py`, enumerating all $3^4 = 81$ lock combinations (`UNLOCKED`, `X`, `Y`) reveals **6 deadlocked configurations** where neither `X` nor `Y` can ever assemble 3 votes under permanent locking.

To restore liveness without breaking safety, `consensus-lab/unlock_test.py` (`13/13` tests passing) requires a verified higher-round Prevote Quorum Certificate (`locked_round < cert_round < round_id`) before allowing a validator to switch votes.

---

## 3. Crash-Safe "Lock-Before-Sign" with SQLite

If a validator signs a `PRECOMMIT` in memory and crashes before flushing its lock to disk, restarting it could allow an honest node to accidentally sign a conflicting block at the same height.

`consensus-lab/locking_test.py` solves this using an atomic SQLite `BEGIN IMMEDIATE` transaction **before** calling `Ed25519PrivateKey.sign()`:

```python
with closing(sqlite3.connect(self.path)) as db, db:
    db.execute("BEGIN IMMEDIATE")
    old = db.execute(
        "SELECT round_id, block_hash FROM locks WHERE validator = ? AND height = ?",
        (name, height),
    ).fetchone()
    if old and (block != old[1] or round_id < old[0]):
        return None
    db.execute("INSERT OR REPLACE INTO locks VALUES (?, ?, ?, ?)", (name, height, round_id, block))

# Sign ONLY after SQLite transaction commits
data = payload(name, "PRECOMMIT", height, round_id, block)
return data, KEYS[name].sign(encode(data))
```

---

## 4. Fuzzing Conservation Laws in Solidity 0.8.28

On the EVM plane, `contracts/test/MNCFuzz.t.sol` runs `10,000` randomized inputs per property (`30,000` total runs), including the classic `self-transfer` bug check (`sender == recipient`) that has historically broken naive token implementations:

```solidity
function testFuzzSelfTransfer(uint256 amount) public {
    uint256 before = token.balanceOf(address(this));
    amount = amount % (before + 1);
    token.transfer(address(this), amount);
    require(token.balanceOf(address(this)) == before);
}
```

---

## 5. Explore & Contribute

- **GitHub Repository (MIT):** `https://github.com/Oepjdihc2008/minichain`
- **Official Site & Read-Only MiniScan Sepolia Explorer:** `https://oepjdihc2008.github.io/minichain/`
- **Sepolia Etherscan (`MNC`):** `https://sepolia.etherscan.io/token/0x32C80Bb0fd51D32c31b52795a181042BF90E2Ee6`

Feedback, code reviews, and PRs on deterministic network simulation or formal verification are very welcome!
