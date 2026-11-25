# Engineering Roadmap

MiniChain's roadmap is strictly technical and open-source. It contains zero financial, speculative, or token-price milestones.

## Completed Milestones

### Milestone 1 — Core Cryptographic Ledger (`core-pow/`)
- [x] Deterministic JSON canonicalization & `SHA-256` Proof-of-Work block mining
- [x] `Ed25519` asymmetric transaction signing, verification & per-account nonce tracking
- [x] Full-chain state validation & tampering rejection test

### Milestone 2 — Multi-Node P2P & BFT Consensus Labs (`consensus-lab/`)
- [x] HTTP peer head comparison (`/head`, `/compare`) & CLI network monitor
- [x] OS-isolated multi-process validator voting over pipes and bounded TCP sockets
- [x] Pinned `Ed25519` validator registry with `SHA-256` key fingerprinting
- [x] Combinatorial `3f + 1` BFT quorum safety verifier (`7/7` cases)
- [x] Two-Phase `PREVOTE` -> `PRECOMMIT` Quorum Certificate protocol (`5/5` security checks)
- [x] Exhaustive 81-state cross-round lock & deadlock analyzer (`7/7` cases)
- [x] Crash-safe `SQLite` `BEGIN IMMEDIATE` lock store (`9/9` cases) & finality store (`10/10` cases)
- [x] Tendermint-style PoLC safe unlock validator model (`13/13` cases)

### Milestone 3 — EVM Smart Contracts, Fuzzing & Sepolia Launch (`contracts/` & `website/`)
- [x] `Solidity 0.8.28` contracts (`MiniChain`, `MiniChainV2`, `MNC` ERC-20)
- [x] `20/20` Foundry unit & fuzz tests + `30,000` randomized MNC invariant runs
- [x] `6/6` automated EVM state snapshot & disaster recovery verification
- [x] Public testnet deployment of `MNC` on Ethereum Sepolia (`0x32C80Bb0fd51D32c31b52795a181042BF90E2Ee6`)
- [x] Official bilingual (`EN` / `中文`) static website & read-only **MiniScan** Sepolia explorer

---

## Upcoming Open-Source Research Milestones

### Milestone 4 — Deterministic Network Adversary Simulator
- [ ] Seeded discrete-event network scheduler simulating message drops, reordering, and asymmetric partitions across BFT rounds
- [ ] Exponential-backoff timeout pacemaker for automated view-change liveness recovery

### Milestone 5 — Execution-Consensus Bridge Prototype
- [ ] Clean minimal Engine API / ABCI-inspired state-transition interface allowing the Python BFT finality engine to drive block commits on a lightweight deterministic state machine

### Milestone 6 — Stateful Invariant & Symbolic Verification
- [ ] Multi-actor Foundry stateful invariant campaigns (`invariant_*`) for complex token interactions
- [ ] Symbolic execution proofs using Halmos (`check_*`) verifying conservation of supply for all $2^{256}$ inputs
