# Hacker News Launch Draft (`Show HN`)

> **Platform Rules Compliance:** Concise, factual, technical title (< 80 chars); zero marketing buzzwords; immediate disclosure of scope and limitations in the first comment; never ask anyone to upvote.  
> **Publication Gate:** Ready for review by the project lead before posting at https://news.ycombinator.com/submit.

---

## Title (76 characters)

`Show HN: MiniChain – Small Python BFT locking labs and Solidity fuzz tests`

*(Alternative Title, 74 chars: `Show HN: MiniChain – From-scratch BFT quorum/locking labs and EVM explorer`)*

## URL

`https://github.com/Oepjdihc2008/minichain` *(or live GitHub Pages URL once deployed)*

---

## Author's Opening Comment

Hi HN,

I built **MiniChain** to understand blockchain consensus safety, crash recovery, and smart contract testing from first principles without getting lost in a 500k-LOC production client. Everything is MIT-licensed and designed to run locally in a couple of minutes.

The repository is split into two explicitly separate planes (they are **not** integrated into a unified production client):

1. **Standalone Python Consensus & Persistence Labs (`core-pow/` & `consensus-lab/`):**
   - Starts with a 124-line `SHA-256` PoW + `Ed25519` signed transaction ledger, then moves into `3f + 1` BFT consensus mechanics.
   - Enumerates all $3^4 = 81$ lock states across 4 validators to show exactly how strict cross-round locking hits 6 split-lock deadlocks (`[X, X, Y, Y]` permutations), then resolves them using Tendermint-style Proof-of-Lock-Change (`locked_round < cert_round < round_id`).
   - Uses `SQLite` `BEGIN IMMEDIATE` transactions so a validator durably persists its `(validator, height)` lock to disk *before* emitting an `Ed25519` `PRECOMMIT` signature, preventing equivocation after a crash/restart.

2. **EVM Smart Contracts & Read-Only Sepolia Explorer (`contracts/` & `website/`):**
   - Zero-dependency `Solidity 0.8.28` contracts (`MiniChain`, `MiniChainV2`, and a fixed-supply `MNC` ERC-20 test token on Ethereum Sepolia at `0x32C80Bb0fd51D32c31b52795a181042BF90E2Ee6`).
   - Verified with 20 Foundry tests, 30,000 randomized fuzz runs (supply conservation, self-transfer invariance, allowance exhaustion), and a 6-check `anvil_dumpState` / `anvil_loadState` disaster recovery script.
   - Includes **MiniScan**, a static read-only Sepolia JSON-RPC explorer (no wallet connection prompts; fields degrade explicitly to `unavailable` if RPC is unreachable).

**Explicit caveats:**
- When run alongside local Foundry Anvil nodes, the Python validators only read block headers over JSON-RPC—they don't drive Anvil's internal block production.
- Unaudited educational/engineering code, and the Sepolia token has zero monetary value.

I'd really appreciate feedback from distributed-systems and Solidity folks—especially on the SQLite lock-before-sign model (`consensus-lab/locking_test.py`) and ideas for deterministic network partition simulation!
