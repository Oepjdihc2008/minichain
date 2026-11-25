# Verified Test Report

All test results below were executed and verified directly against the source files in this repository.

## 1. Executive Summary

| Metric | Verified Result | Command |
| :--- | :--- | :--- |
| **Total Smart Contract Tests** | **20 / 20 PASS** | `cd contracts && forge test -vv` |
| **Dedicated MNC Token Tests** | **12 / 12 PASS** | `MNCTest` (7) + `MNCFuzzTest` (5) |
| **MNC Randomized Fuzz Runs** | **30,000 PASS** | `forge test --match-contract MNCFuzzTest --fuzz-runs 10000` |
| **Disaster Recovery Checks** | **6 / 6 PASS** | `python3 consensus-lab/recovery_check.py` |
| **Standalone BFT & Storage Checks** | **60 / 60 PASS** | `bft`, `fault`, `cross_round`, `locking`, `leader`, `unlock`, `finality` |
| **Core PoW & Tamper Detection** | **PASS** | `python3 core-pow/blockchain.py` |

---

## 2. Foundry Smart Contract Suites (`Solc 0.8.28`)

### 2.1 `MNCTest` (`contracts/test/MNC.t.sol`) — 7/7 Passed
- `testTotalSupply()` — Verifies `totalSupply() == 1_000_000 ether` (gas: `5,729`)
- `testInitialBalance()` — Verifies deployer receives 100% initial supply (gas: `13,832`)
- `testTransfer()` — Verifies standard token transfer updates recipient balance (gas: `61,649`)
- `testInsufficientBalance()` — Verifies transfer exceeding balance reverts (gas: `30,095`)
- `testZeroAddressRejected()` — Verifies transfer to `address(0)` reverts (gas: `27,867`)
- `testApproval()` — Verifies `approve()` records exact spender allowance (gas: `56,431`)
- `testTransferFrom()` — Verifies `transferFrom()` moves tokens and decrements allowance to `0` (gas: `119,708`)

### 2.2 `MNCFuzzTest` (`contracts/test/MNCFuzz.t.sol`) — 5/5 Passed (30,000 Fuzz Runs)
- `testFuzzSupplyConservation(uint256)` — `10,000` runs (`μ: 80,121 gas`): `balanceOf(sender) + balanceOf(recipient) == totalSupply` for arbitrary transfer amounts.
- `testFuzzSelfTransfer(uint256)` — `10,000` runs (`μ: 45,819 gas`): `transfer(self, amount)` preserves exact balance invariance.
- `testFuzzAllowance(uint256)` — `10,000` runs (`μ: 123,182 gas`): `approve` + `transferFrom` conserves supply and zeroes spent allowance.
- `testUnauthorizedTransfer()` — Verifies unapproved `transferFrom` reverts (gas: `30,795`).
- `testZeroTransfer()` — Verifies `0`-value transfer succeeds without mutating balances (gas: `47,074`).

### 2.3 `MiniChainTest` & `MiniChainV2Test` — 8/8 Passed
- `MiniChainTest` (5/5): `testInitialCounter`, `testIncrement`, `testMultipleIncrements` (100 iterations), `testSetMessage`, `testFuzzMessage(string)` (256 fuzz runs).
- `MiniChainV2Test` (3/3): `testOwner`, `testOwnerCanModify`, `testRejectUnauthorized` (external attacker contract rejected by `onlyOwner`).

---

## 3. Disaster Recovery Verification (`6/6 PASS`)

Executed via `consensus-lab/recovery_check.py` across two isolated Anvil EVM instances:
1. `Chain ID verified (31337)`: **PASS**
2. `Block height recovered`: **PASS**
3. `Block hash parity`: **PASS**
4. `State root parity`: **PASS**
5. `MNC contract bytecode intact`: **PASS**
6. `MNC totalSupply & balances conserved (750,000 + 250,000 = 1,000,000 MNC)`: **PASS**

---

## 4. Python BFT Consensus & Persistence Suites

- `bft_test.py`: **7/7 PASS** — Quorum intersection safety across `(3,2)`, `(4,3)`, `(7,5)`.
- `fault_test.py`: **8/8 PASS** — Offline nodes, forged signatures, duplicate votes, conflicting votes.
- `cross_round_test.py`: **7/7 PASS** — Cross-round safety & 81 lock-state deadlock enumeration (6 deadlocks identified).
- `locking_test.py`: **9/9 PASS** — SQLite `BEGIN IMMEDIATE` persistent locking & reopen recovery.
- `leader_test.py`: **6/6 PASS** — Proposer rotation & timeout/invalid-proposal view change.
- `unlock_test.py`: **13/13 PASS** — Tendermint-style PoLC higher-round QC safe unlock.
- `finality_test.py`: **10/10 PASS** — SQLite per-height finality persistence & conflict rejection.
