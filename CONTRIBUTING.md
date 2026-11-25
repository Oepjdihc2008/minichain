# Contributing to MiniChain

Thank you for your interest in contributing to **MiniChain**! We welcome engineers, researchers, and students interested in distributed consensus, cryptography, database durability, and EVM verification.

## High-Impact Areas for Contributors

1. **Asynchronous Network Simulation (`consensus-lab/`)**: Build a deterministic discrete-event network simulator testing packet delay, reordering, and asymmetric partitions across 4+ BFT validators.
2. **Timeout Pacemaker & View-Change Automation**: Extend `leader_test.py` and `unlock_test.py` into an event-driven multi-round pacemaker.
3. **Consensus-Execution Bridge**: Prototype a clean state-transition API connecting finalized Python Quorum Certificates to a minimal execution engine.
4. **Formal Verification (`contracts/`)**: Add Foundry stateful invariant suites (`invariant_*`) or Halmos symbolic execution proofs (`check_*`) for `MNC.sol`.
5. **MiniScan Explorer Enhancements (`website/`)**: Add ABI calldata decoding or multi-endpoint user-configurable Sepolia RPC URLs (strictly preserving read-only, wallet-free operation).

## Contribution Rules

1. **Zero Secrets / Zero PII:** Ensure no `.key`, `.env`, private keys, raw state backups, or personal identifiers are included in commits.
2. **Architectural Honesty:** Do not claim unproven security properties or unimplemented consensus-EVM integration.
3. **All Suites Green:** Before submitting a PR, verify:
   - `cd contracts && forge test && forge test --match-contract MNCFuzzTest --fuzz-runs 10000`
   - `cd consensus-lab && python3 bft_test.py && python3 locking_test.py && python3 unlock_test.py && python3 recovery_check.py`
   - `cd website && npm run lint && npm run build`
4. **No Financial Solicitation:** PRs introducing wallet-connection prompts, token-sale mechanics, or commercial promotions will be closed immediately.
