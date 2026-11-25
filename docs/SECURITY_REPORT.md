# Security Report & Threat Boundaries

> **Mandatory Disclosure:** MiniChain has **NOT** undergone an independent third-party commercial security audit. All security verifications documented here are internal engineering tests and automated property checks. Do not use MiniChain contracts or scripts to manage real-world financial assets.

---

## 1. Scope of Internal Security Verification

1. **Solidity Smart Contracts (`contracts/src/`)**:
   - `MNC.sol` (101 lines, `Solidity ^0.8.28`)
   - `MiniChain.sol` (18 lines) & `MiniChainV2.sol` (36 lines)
2. **Python Consensus & Storage Modules (`core-pow/`, `consensus-lab/`)**:
   - `Ed25519` signature verification and pinned public-key fingerprint registry
   - Two-phase `PREVOTE` -> `PRECOMMIT` certificate binding
   - `SQLite` atomic lock-before-sign persistence and `mode=ro` history auditing
3. **MiniScan Static Web Explorer (`website/`)**:
   - Strict read-only JSON-RPC architecture with zero wallet connection prompts
4. **Repository Secret & Privacy Hygiene**:
   - Automated pre-publication scan across the entire repository tree

---

## 2. Verified Security Controls

### 2.1 Smart Contract Controls (`MNC.sol`, `MiniChainV2.sol`)
- **Arithmetic Safety**: Compiled with `Solidity 0.8.28` native checked arithmetic, preventing integer overflow/underflow without external SafeMath libraries.
- **Minimal Attack Surface**: `MNC.sol` has no `mint()`, `burn()`, `delegatecall`, `selfdestruct`, fee-on-transfer hooks, external callbacks (zero reentrancy surface), or upgradeable proxy admin keys.
- **Zero-Address & Balance Guards**: `_transfer` explicitly rejects `to == address(0)` and `balanceOf[from] < amount`; `transferFrom` enforces `allowance[from][msg.sender] >= amount` before decrementing allowance.
- **Immutable Ownership (`MiniChainV2.sol`)**: Uses `address public immutable owner` and custom error `Unauthorized()`, verified against external contract call attacks in `MiniChainV2Test.testRejectUnauthorized()`.

### 2.2 Consensus & Storage Controls
- **Crash-Safe Validator Locking**: `LockStore.precommit()` writes `(validator, height, round_id, block_hash)` inside an SQLite `BEGIN IMMEDIATE` transaction **prior** to signing `PRECOMMIT`. Reopening the database after a simulated crash preserves lock enforcement (`locking_test.py`).
- **Cross-Phase & Replay Resistance**: Votes commit to `protocol`, `chain_id`, `round`, `validator`, `phase`, `height`, `hash`, and `proof` (SHA-256 digest of sorted `PREVOTE` packets).
- **Bounded Socket Framing**: `network_consensus_v4.py` caps incoming TCP lines at `8,192` bytes with strict socket timeouts (`2s` read timeout) and PID/challenge validation.

### 2.3 Web Explorer Safety (`MiniScan`)
- **Zero Wallet Surface**: MiniScan never accesses `window.ethereum`, EIP-1193 providers, or signature APIs, eliminating phishing or malicious transaction approval risks for visitors.
- **Honest Failure Reporting**: Network timeouts or missing records explicitly surface as `unavailable`.

---

## 3. Known Limitations & Architectural Boundaries

1. **Consensus / EVM Decoupling**: Python BFT scripts validate headers read from Anvil RPC endpoints externally; they do not enforce block production inside Anvil.
2. **Standard EIP-20 `approve` Race Condition**: `MNC.sol` implements baseline EIP-20 `approve` without `EIP-2612` `permit`. Standard allowance-reset hygiene (`approve(spender, 0)` first) applies.
3. **Localhost Transport Model**: Python TCP/HTTP servers bind to `127.0.0.1` without TLS/Noise encryption or WAN peer discovery, as they are designed for local multi-process consensus experimentation.
4. **No External Audit**: Not audited by a commercial security firm.

---

## 4. Release Directory Sanitization Audit

Before packaging the open-source repository, a full scan verified the **complete absence** of:
- Wallet private keys, seed phrases / mnemonics, or keystore files
- Pre-generated validator `.key` files (`validator_keys*`)
- `.env` files or RPC API keys
- Unchecked SQLite `.db` files or raw Anvil state backup JSONs (`data/*`)
- Personal identifiable information (PII) of the creator
