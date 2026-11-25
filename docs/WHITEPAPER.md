# MiniChain Technical Whitepaper (v1.0)

> **Status:** Experimental Open-Source Systems Engineering Project  
> **License:** MIT  
> **Public Testnet Artifact:** Ethereum Sepolia (`Chain ID: 11155111`) — `MNC` (`0x32C80Bb0fd51D32c31b52795a181042BF90E2Ee6`)  
> **Financial Disclaimer:** MiniChain Coin (`MNC`) is an experimental testnet token with **zero monetary value**. There is no mainnet token, token sale, liquidity pool, or investment offering.

---

## 1. Abstract

Modern blockchain networks combine cryptographic hash chains, asymmetric signature schemes, Byzantine Fault Tolerant (BFT) consensus protocols, crash-safe state persistence, and deterministic virtual machines. While mature production clients provide high throughput, their architectural complexity creates a steep barrier for developers studying how safety and liveness invariants actually hold under adversarial conditions.

**MiniChain** addresses this gap by constructing a clean, modular, auditable blockchain engineering laboratory from first principles:

1. **Core Cryptographic Ledger (`core-pow/`)**: A 124-line Python Proof-of-Work ledger implementing canonical JSON serialization, `SHA-256` block hashing, `Ed25519` transaction signing, sequential nonce validation, and tamper detection.
2. **Standalone BFT Consensus & Storage Lab (`consensus-lab/`)**: A comprehensive suite of Python protocol modules exploring multi-process validator voting, `3f + 1` quorum intersection math, two-phase `PREVOTE` / `PRECOMMIT` Quorum Certificates (QCs), `SQLite` atomic lock-before-sign persistence, exhaustive 81-state split-lock deadlock analysis, and Tendermint-inspired Proof-of-Lock-Change (PoLC) safe unlocking.
3. **EVM Smart Contract Plane (`contracts/`)**: Zero-dependency `Solidity ^0.8.28` smart contracts (`MiniChain`, `MiniChainV2`, and the `MNC` ERC-20 token) verified by 20/20 Foundry tests, 30,000 randomized fuzz runs, 6/6 Anvil state disaster recovery checks, and deployed publicly on Ethereum Sepolia.

---

## 2. Architectural Honesty & Dual-Plane Separation

A central engineering rule of MiniChain is **strict transparency about integration boundaries**:

- **Plane 1 (Standalone Python Consensus Lab)** executes BFT voting, cross-round locking, and SQLite certificate audits independently. When paired with local Foundry Anvil nodes (`ports 8545–8548`), Python validator processes query Anvil via read-only JSON-RPC (`eth_chainId`, `eth_getBlockByNumber`) to observe external chain heads.
- **Plane 2 (EVM Execution Plane)** executes Solidity smart contracts inside Foundry Anvil locally and on the public **Ethereum Sepolia** testnet.
- **Explicit Boundary:** The Python BFT consensus engine is **not yet integrated** into Anvil's internal block-production loop or an Engine API execution client. Documenting this boundary clearly allows engineers to evaluate each subsystem on its exact technical merits.

---

## 3. Cryptographic & Consensus Model

### 3.1 Canonical Hashing & Ed25519 Authentication

All Python consensus payloads are serialized deterministically using `json.dumps(data, sort_keys=True).encode('utf-8')`.
- **Block & Certificate Digests:** `SHA-256` hashes bind ordered validator vote sets (`PREVOTE` certificates) into an unforgeable `proof` string embedded in Phase-2 `PRECOMMIT` messages.
- **Validator Identity:** Each validator (`A`, `B`, `C`, `D`) signs votes using `Ed25519`. Public keys are verified against a pinned SHA-256 fingerprint registry (`identity_v4.py`), rejecting unknown keys, duplicate votes, and cross-round or cross-phase replays.

### 3.2 Quorum Intersection (`n = 4, q = 3, f = 1`)

In `bft_test.py`, MiniChain exhaustively verifies combinatorial quorum intersection across `(n, q, f)` configurations. For `n = 4` validators and quorum `q = 3`:

$$|Q_1 \cap Q_2| \ge 2q - n = 6 - 4 = 2$$

With at most $f = 1$ Byzantine validator, every pair of quorums shares **at least one honest validator**, preventing two conflicting blocks from both achieving finality within the same round.

### 3.3 Cross-Round Locking, Deadlock Analysis & Safe Unlock

Single-round quorum intersection is insufficient if honest validators switch votes freely across rounds. MiniChain models cross-round safety and liveness across three progressive modules:

1. **Exhaustive State-Space Analysis (`cross_round_test.py`)**: Enumerates all $3^4 = 81$ validator lock configurations (`UNLOCKED`, `X`, `Y`) and proves that strict permanent locking produces **6 deadlocked split-lock states** (permutations of two validators locked on `X` and two locked on `Y` where neither block can reach quorum `3`).
2. **Crash-Safe Atomic Locking (`locking_test.py`)**: Uses SQLite `BEGIN IMMEDIATE` transactions to persist `(validator, height) -> (round_id, block_hash)` **before** emitting a `PRECOMMIT` signature, ensuring crash recovery never causes equivocation.
3. **PoLC Safe Unlock (`unlock_test.py`)**: Resolves split-lock deadlocks without sacrificing safety by allowing a validator locked at `locked_round` to prevote for a different block `Y` in `round_id` **if and only if** accompanied by a valid `3/4` Prevote Quorum Certificate from `cert_round` satisfying:

$$\text{locked\_round} < \text{cert\_round} < \text{round\_id}$$

---

## 4. EVM Smart Contracts & Sepolia Deployment

`contracts/src/MNC.sol` implements a clean, immutable-supply ERC-20 token in `Solidity ^0.8.28`:

- **Token Name:** MiniChain Coin (`MNC`)
- **Decimals:** `18`
- **Total Supply:** `1,000,000 * 10**18` (minted once in constructor; no `mint`, `burn`, `pause`, or proxy upgrade hooks)
- **Sepolia Contract Address:** `0x32C80Bb0fd51D32c31b52795a181042BF90E2Ee6`
- **Sepolia Deployment Block:** `#12207520`
- **Sepolia Genesis Transaction:** `0x40c220f1c9f4bdcd770965b8b3d1c9e6d253cb5067b27859d2456413d4b7b4b8`

---

## 5. Verification Summary

| Verification Domain | Artifact | Verified Result |
| :--- | :--- | :--- |
| Smart Contract Unit & Fuzz Suites | `contracts/test/*.t.sol` | **20 / 20 PASS** |
| Dedicated MNC ERC-20 Tests | `MNC.t.sol` + `MNCFuzz.t.sol` | **12 / 12 PASS** |
| Randomized Property Fuzzing | `MNCFuzzTest` (`3 × 10,000`) | **30,000 / 30,000 PASS** |
| Disaster Recovery State Parity | `consensus-lab/recovery_check.py` | **6 / 6 PASS** |
| BFT, Fault, Locking, Unlock & Finality | `consensus-lab/*_test.py` | **65 / 65 PASS** |
