# Blockchain & Systems Developer Communities Outreach

> **Target Channels:** Foundry Community `#showcase`, Ethereum R&D / Systems Study Groups, Open-Source Distributed Systems Forums.  
> **Rules:** Post only in designated `#showcase` or `#open-source` channels; never DM strangers, never cross-post repetitively, and keep discussion strictly on engineering & testing.

---

## 1. Developer Showcase Post (Discord / Forum `#showcase`)

**MiniChain — Open-Source BFT Locking Lab, Solidity 0.8.28 Fuzz Suite & Wallet-Free Sepolia Explorer (MIT)**

Hi everyone! Sharing **MiniChain**, an open-source systems & smart-contract engineering project we just packaged for public peer review:

- **Standalone Python BFT Consensus Lab (`consensus-lab/`)**:
  - `Ed25519` signed voting, `3f+1` quorum intersection verifier (`7/7`), 2-phase Prevote/Precommit QCs (`5/5`), exhaustive 81-state split-lock deadlock analysis (`7/7`), crash-safe `SQLite` `BEGIN IMMEDIATE` locking (`9/9`), and PoLC safe unlock (`13/13`).
- **Foundry Smart Contracts & Recovery (`contracts/`)**:
  - Clean `Solidity 0.8.28` contracts (`20/20` tests, `30,000` randomized fuzz runs on `MNC.sol`, plus `6/6` automated `anvil_dumpState`/`anvil_loadState` disaster recovery verification).
  - Live experimental Sepolia deployment (`Chain ID 11155111`): `0x32C80Bb0fd51D32c31b52795a181042BF90E2Ee6` (strictly $0 testnet artifact).
- **MiniScan Static Read-Only Explorer (`website/`)**:
  - Next.js + TypeScript + Tailwind static site querying Sepolia JSON-RPC directly with zero wallet-connect prompts and explicit `unavailable` error states.

**Honest Scope Note:** The Python consensus lab observes Anvil headers externally via read-only RPC (not integrated into Anvil's internal block builder), and the contracts are unaudited research code.

- **GitHub:** `https://github.com/Oepjdihc2008/minichain`
- **Website / Docs:** `https://oepjdihc2008.github.io/minichain/`

---

## 2. Contributor Recruitment Call

**Looking for Open-Source Collaborators (Distributed Systems & Formal Verification):**

We are recruiting contributors interested in tackling three upcoming research milestones in MiniChain:
1. **Discrete-Event Network Partition Simulator (Python)**: Deterministic seeded scheduler dropping/delaying TCP vote packets across BFT rounds.
2. **Consensus-to-Execution State Bridge**: Minimal ABCI / Engine API-style bridge connecting finalized Python Quorum Certificates to a lightweight state machine.
3. **Symbolic Execution & Stateful Invariants (Foundry / Halmos)**: Proving ERC-20 conservation properties symbolically across all 256-bit inputs.

All work is 100% open-source under the MIT License (`CONTRIBUTING.md`).
