# Developer Guide

## 1. Prerequisites

- **Python**: `>= 3.9` with `cryptography` installed (`pip install cryptography`)
- **Foundry**: `forge`, `cast`, `anvil` (`curl -L https://foundry.paradigm.xyz | bash && foundryup`)
- **Node.js**: `>= 20.x` and `npm` (for building the official website & MiniScan Explorer)

---

## 2. Repository Layout

- `core-pow/` — Standalone SHA-256 Proof-of-Work & Ed25519 transaction prototype (`blockchain.py`)
- `consensus-lab/` — Standalone Python BFT, P2P, SQLite locking, PoLC unlocking, and Anvil disaster recovery labs
- `contracts/` — Foundry project (`Solidity 0.8.28`) containing `MiniChain.sol`, `MiniChainV2.sol`, `MNC.sol`, and 20 tests
- `website/` — Next.js + TypeScript + Tailwind CSS static website (`output: "export"`)
- `docs/` — Technical documentation and free static deployment guides

---

## 3. Running Smart Contract Tests & Fuzzing

```bash
cd contracts

# Run all 20 smart contract unit & fuzz tests
forge test -vv

# Run the 30,000-iteration MNC randomized property fuzz suite
forge test --match-contract MNCFuzzTest --fuzz-runs 10000
```

---

## 4. Running Python Consensus & Disaster Recovery Labs

### 4.1 Standalone Deterministic Test Suites (No Local RPC Needed)

```bash
python3 core-pow/blockchain.py

cd consensus-lab
python3 bft_test.py          # 7/7 BFT quorum intersection checks
python3 fault_test.py        # 8/8 signature & equivocation checks
python3 cross_round_test.py  # 7/7 cross-round lock & 81-state deadlock analysis
python3 locking_test.py      # 9/9 SQLite BEGIN IMMEDIATE lock persistence checks
python3 leader_test.py       # 6/6 proposer rotation & view change checks
python3 unlock_test.py       # 13/13 PoLC safe unlock checks
python3 finality_test.py     # 10/10 SQLite finality store checks
```

### 4.2 Automated 6/6 Disaster Recovery Verification

`recovery_check.py` automatically compiles `contracts/`, launches two temporary Anvil nodes on free localhost ports, deploys `MNC.sol`, executes a token transfer, snapshots full state via `anvil_dumpState`, restores onto the second node via `anvil_loadState`, and verifies all 6 invariants:

```bash
cd consensus-lab
python3 recovery_check.py
```

### 4.3 Multi-Node Live Anvil Observation Labs (Optional)

To run the live 4-node TCP / Two-Phase labs (`identity_v4.py`, `network_consensus_v4.py`, `two_phase.py`, `integrated_finality.py`):

1. Start 4 local Anvil instances in separate terminals on ports `8545`, `8546`, `8547`, `8548`:
   ```bash
   anvil --port 8545
   anvil --port 8546
   anvil --port 8547
   anvil --port 8548
   ```
2. Generate local-only Ed25519 validator keys (automatically ignored by `.gitignore`):
   ```bash
   cd consensus-lab
   python3 identity_v4.py
   ```
3. Execute two-phase certificate & SQLite finality verification:
   ```bash
   python3 integrated_finality.py
   python3 network_consensus_v4.py
   python3 audit_v4.py
   ```

---

## 5. Building & Previewing the Official Website

```bash
cd website
npm install
npm run lint
npm run build

# Preview static export locally on http://localhost:3000
npx serve out -l 3000
```
