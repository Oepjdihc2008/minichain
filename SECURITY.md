# Security Policy

## Project Scope & Experimental Disclaimer

MiniChain is an open-source distributed systems and smart contract **research and educational project**:

- **Not Independently Audited:** Neither the Python consensus simulations nor the Solidity smart contracts (`MNC.sol`, `MiniChain.sol`, `MiniChainV2.sol`) have undergone a commercial third-party security audit.
- **Testnet Only:** `MiniChain Coin (MNC)` on Ethereum Sepolia (`0x32C80Bb0fd51D32c31b52795a181042BF90E2Ee6`) carries **zero real-world financial value**.
- **Read-Only Web Explorer:** MiniScan never prompts users to connect browser wallets or sign transactions.

## Strict Secret Hygiene Rules

Contributors must **never** commit or upload:
- Wallet private keys, seed phrases / mnemonics, or keystore JSON files
- Validator Ed25519 `.key` files (`validator_keys*`)
- `.env` files or RPC provider API secrets
- Unchecked local SQLite databases (`*.db`) or raw Anvil state dumps (`*backup*.json`, `*state*.json`)
- Personal identifiable information (PII)

## Reporting a Vulnerability

If you discover a logic bug in the BFT locking/unlocking state machines, a smart contract edge case, or an XSS/UI issue in MiniScan:
1. Open a GitHub Security Advisory (preferred for sensitive bugs) or a detailed technical GitHub Issue with a minimal reproduction script (`forge test` or `python3` reproducer).
2. Do not test vulnerabilities against public RPC infrastructure in ways that cause denial of service.
