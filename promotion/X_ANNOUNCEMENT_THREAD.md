# X (Twitter) Technical Launch Thread

> **Platform Rules Compliance:** Pure engineering content; zero price/investment claims, zero `$` cashtags, zero spam mentions or engagement bait.  
> **Publication Gate:** Ready for review by the project lead before posting.

---

## Post 1 / 6 (Hook & Overview)
Open-sourcing **MiniChain** (MIT) — an engineering research lab built from scratch to explore distributed BFT consensus, crash-safe validator storage, and fuzz-tested EVM smart contracts.

Code, docs & read-only Sepolia explorer: `https://oepjdihc2008.github.io/minichain/`
GitHub: `https://github.com/Oepjdihc2008/minichain`

🧵 Technical breakdown (1/6)

---

## Post 2 / 6 (BFT Quorum & Deadlock Math)
In `consensus-lab/`, we model `3f + 1` BFT safety & liveness step by step in pure Python:
• Combinatorial quorum intersection (`n=4, q=3, f=1`)
• Two-phase `PREVOTE -> PRECOMMIT` Quorum Certificates with SHA-256 digests
• Exhaustive $3^4 = 81$ lock-state analysis isolating all 6 split-lock deadlocks + PoLC safe unlock (2/6)

---

## Post 3 / 6 (SQLite Lock-Before-Sign & History Audit)
Consensus safety breaks if a validator signs a Precommit, crashes before flushing its lock, and signs a conflicting block after reboot.

MiniChain's `LockStore` executes an atomic SQLite `BEGIN IMMEDIATE` write *before* `Ed25519` signing, paired with a `mode=ro` cryptographic history auditor. (3/6)

---

## Post 4 / 6 (Foundry Smart Contracts & 30,000 Fuzz Runs)
On the EVM plane (`contracts/`), zero-dependency Solidity `0.8.28` contracts pass:
• 20/20 Foundry unit & fuzz tests
• 12/12 dedicated MNC ERC-20 tests
• 30,000 randomized fuzz runs checking supply conservation, self-transfers & allowances
• 6/6 automated Anvil state snapshot & disaster recovery checks (4/6)

---

## Post 5 / 6 (MiniScan Read-Only Explorer & Architectural Honesty)
We also built **MiniScan**, a static Next.js + TypeScript explorer querying live Ethereum Sepolia (`#11155111`) JSON-RPC for contract `0x32C80Bb0fd51D32c31b52795a181042BF90E2Ee6`.

• 100% read-only (never asks you to connect a wallet)
• Explicit architectural separation: Python BFT labs and Anvil EVM nodes are documented honestly without claiming integration (5/6)

---

## Post 6 / 6 (Open Call for Contributors)
Note: MiniChain is an unaudited educational/engineering project, and Sepolia MNC is a $0 experimental testnet artifact.

If you enjoy distributed consensus, deterministic network simulators, or Solidity formal verification, check out the repo and join in!

Repo: `https://github.com/Oepjdihc2008/minichain` (6/6)
