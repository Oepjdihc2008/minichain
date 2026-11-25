# Reddit Technical Community Posts

> **Platform Rules Compliance:** Strictly technical engineering discussion; zero price/investment talk; clear testnet & non-audit disclosures; tailored to each subreddit's focus. Optional visual attachment: `docs/assets/brand/mnc-social-preview-1280x640.png`. Post individually and organically only after lead approval—never cross-spam simultaneously.

---

## 1. `r/ethdev` — Focus: Foundry Fuzzing, Zero-Dependency Solidity 0.8.28 & Wallet-Free Sepolia Explorer

**Title:**
`[Open Source] MiniChain: Zero-dependency Solidity 0.8.28 ERC-20 (30k Foundry fuzz runs), Anvil state recovery script & wallet-free Sepolia explorer`

**Body:**
Hey `r/ethdev`,

I'm open-sourcing **MiniChain**, an engineering lab combining Foundry-tested Solidity `0.8.28` smart contracts, an automated Anvil disaster-recovery verifier, a standalone Python BFT consensus lab, and a static read-only Ethereum Sepolia explorer (**MiniScan**).

### EVM & Foundry Highlights
- **Zero-dependency contracts (`contracts/src/`)**: `MiniChain.sol`, `MiniChainV2.sol` (immutable owner + custom `Unauthorized()` error), and `MNC.sol` (101-line baseline ERC-20 deployed on Sepolia at `0x32C80Bb0fd51D32c31b52795a181042BF90E2Ee6`).
- **Property Fuzzing (`MNCFuzz.t.sol`)**: 20/20 unit & fuzz tests passing, with 30,000 randomized fuzz runs (`--fuzz-runs 10000`) checking supply conservation, self-transfer balance invariance (`from == to`), and allowance exhaustion.
- **Automated Disaster Recovery (`consensus-lab/recovery_check.py`)**: Spins up two isolated Anvil nodes, deploys `MNC`, runs transfers, snapshots via `anvil_dumpState`, restores via `anvil_loadState`, and verifies 6 invariants (Chain ID, height, block hash, `stateRoot`, bytecode, and balances).
- **Read-Only MiniScan (`website/`)**: Static Next.js + TypeScript explorer querying Sepolia JSON-RPC directly from the browser—zero `window.ethereum` wallet prompts, explicit `unavailable` handling when RPC fails.

### Scope & Honesty Note
The repo also contains standalone Python BFT consensus experiments (Ed25519 two-phase QCs + SQLite lock persistence). Those observe local Anvil headers via read-only JSON-RPC and are **not** wired into Anvil's block-mining engine. Everything is MIT-licensed, unaudited, and strictly testnet-only ($0 value).

- **GitHub Repo:** `https://github.com/Oepjdihc2008/minichain`
- **Live Site & MiniScan Explorer:** `https://oepjdihc2008.github.io/minichain/`

Would love feedback on adding Foundry stateful `invariant_*` handlers or Halmos symbolic checks next!

---

## 2. `r/distributed` / `r/Python` — Focus: BFT Quorum Math, 81 Lock States & SQLite Lock-Before-Sign

**Title:**
`Modeling BFT quorum intersection, 81-state split-lock deadlocks, and crash-safe SQLite lock-before-sign in pure Python`

**Body:**
Hi everyone,

I put together an open-source Python laboratory (**MiniChain**) to model classical Byzantine Fault Tolerant (BFT) safety and liveness edge cases in small, readable scripts (< 230 lines each, using only the Python standard library + `cryptography` for `Ed25519`).

### What each lab tests:
- **`bft_test.py` (7/7)**: Combinatorial quorum intersection checks showing why `(n=3, q=2, f=1)` fails while `(n=4, q=3, f=1)` and `(n=7, q=5, f=2)` guarantee at least one honest validator in every quorum intersection.
- **`cross_round_test.py` (7/7)**: Exhaustively enumerates all $3^4 = 81$ lock states (`UNLOCKED`, `X`, `Y`) across 4 validators and isolates the 6 split-lock deadlock states where strict locking halts liveness.
- **`locking_test.py` (9/9)**: Uses `SQLite` `BEGIN IMMEDIATE` transactions to durably commit `(validator, height) -> (round_id, block_hash)` *before* signing a `PRECOMMIT`, verifying crash/reopen safety.
- **`unlock_test.py` (13/13)**: Implements Tendermint-style Proof-of-Lock-Change unlocking (`locked_round < cert_round < round_id` with a verified 3/4 Prevote QC).

GitHub (MIT License): `https://github.com/Oepjdihc2008/minichain`

Curious how others test deterministic asynchronous message reordering in Python—any feedback or critiques welcome!
