# GitHub Repository Metadata, Release v0.1.0 & Contributor Recruitment

> **Publication Gate:** Ready for review. Do **not** publish until confirmed by the project lead.

## 1. Repository Settings

- **Repository Name:** `minichain`
- **About Description (<= 160 chars):**
  `From-scratch BFT consensus & EVM smart contract engineering lab: Ed25519 2-phase QCs, SQLite lock-before-sign, 30k Foundry fuzz runs & read-only Sepolia explorer.`
- **Official Brand Kit:** `docs/assets/brand/` (`mnc-logo.svg`, `mnc-logo-1024.png`, `mnc-social-preview-1280x640.png` — upload `mnc-social-preview-1280x640.png` under GitHub Repo Settings → Social Preview).
- **Suggested Topics:**
  `blockchain` · `distributed-systems` · `bft-consensus` · `solidity` · `foundry` · `erc20` · `ed25519` · `sqlite` · `fuzz-testing` · `ethereum-sepolia`

---

## 2. GitHub Release `v0.1.0` — Initial Open-Source Launch

**Release Title:** `v0.1.0 — Dual-Plane BFT Consensus Lab, MNC Sepolia Contract & MiniScan Explorer`

**Release Body:**

We are excited to open-source **MiniChain (`v0.1.0`)**, an independent blockchain systems engineering research project designed for developers studying how consensus safety, crash-safe validator persistence, and EVM smart contract invariants work under the hood.

### What's Included

1. **Core Cryptographic PoW Prototype (`core-pow/blockchain.py`)**
   - Deterministic JSON serialization, `SHA-256` Proof-of-Work mining, `Ed25519` signed transactions, sequential nonces, and chain-tamper detection.
2. **Standalone Python BFT Consensus & Persistence Lab (`consensus-lab/`)**
   - Combinatorial `3f + 1` quorum intersection safety proofs (`7/7` passing).
   - Two-phase `PREVOTE` -> `PRECOMMIT` Quorum Certificates bound by `SHA-256` certificate digests (`5/5` security checks passing).
   - Exhaustive $3^4 = 81$ lock-state enumeration identifying the 6 split-lock deadlock configurations (`7/7` passing).
   - Atomic `SQLite` `BEGIN IMMEDIATE` lock-before-sign persistence (`9/9` passing) and Tendermint-style PoLC higher-round QC safe unlock (`13/13` passing).
   - Automated `6/6` EVM state snapshot & cold-node disaster recovery audit (`recovery_check.py`).
3. **EVM Smart Contracts & Ethereum Sepolia Deployment (`contracts/`)**
   - Zero-dependency `Solidity ^0.8.28` contracts (`MiniChain.sol`, `MiniChainV2.sol`, `MNC.sol`).
   - `20/20` Foundry tests passing + `30,000` randomized fuzz runs verifying supply conservation, self-transfer invariance, and allowance exhaustion.
   - Public Sepolia Testnet deployment (`Chain ID 11155111`): `0x32C80Bb0fd51D32c31b52795a181042BF90E2Ee6` (experimental testnet token, zero monetary value).
4. **Official Static Website & Read-Only MiniScan Explorer (`website/`)**
   - Bilingual (`EN` / `简体中文`) Next.js + TypeScript + Tailwind CSS static site with interactive SVG architecture explorer and wallet-free Sepolia JSON-RPC queries.

### Architectural Transparency & Disclaimers
- Python BFT consensus modules observe local Anvil EVM headers via read-only JSON-RPC; they are **not** integrated into Anvil's internal mining loop.
- Not audited by an external security firm. Experimental testnet research only.

---

## 3. Seed "Good First Issues" for Recruiting Contributors

1. **`[consensus-lab]` Deterministic discrete-event network delay & partition simulator**
   - Add a seeded message-delivery queue to test `unlock_test.py` and `two_phase.py` under packet reordering and temporary network splits.
2. **`[contracts]` Add Foundry stateful invariant campaign (`invariant_totalSupplyEqualsSumOfBalances`)**
   - Create multi-actor handler fuzzing across arbitrary sequences of `transfer`, `approve`, and `transferFrom`.
3. **`[website]` Custom Sepolia RPC endpoint override in MiniScan Explorer**
   - Allow developers to paste their own read-only Sepolia RPC URL in local session memory when testing custom nodes.
