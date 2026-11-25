# API & Protocol Reference

## 1. `MNC.sol` Smart Contract Interface (Ethereum Sepolia)

- **Network:** Ethereum Sepolia (`Chain ID: 11155111`)
- **Contract Address:** `0x32C80Bb0fd51D32c31b52795a181042BF90E2Ee6`
- **Solidity Version:** `^0.8.28`

### Read-Only View / Pure Functions

| Function Signature | Selector | Return Type | Description |
| :--- | :--- | :--- | :--- |
| `name()` | `0x06fdde03` | `string` | Returns `"MiniChain Coin"` |
| `symbol()` | `0x95d89b41` | `string` | Returns `"MNC"` |
| `decimals()` | `0x313ce567` | `uint8` | Returns `18` |
| `totalSupply()` | `0x18160ddd` | `uint256` | Returns `1000000000000000000000000` (`1e24`) |
| `balanceOf(address)` | `0x70a08231` | `uint256` | Token balance of `account` in wei |
| `allowance(address,address)` | `0xdd62ed3e` | `uint256` | Remaining spender allowance |

### State-Mutating Functions (Testnet Only)

| Function Signature | Selector | Reverts On | Emits |
| :--- | :--- | :--- | :--- |
| `transfer(address to, uint256 amount)` | `0xa9059cbb` | `to == address(0)` or `balanceOf[msg.sender] < amount` | `Transfer(msg.sender, to, amount)` |
| `approve(address spender, uint256 amount)` | `0x095ea7b3` | — | `Approval(msg.sender, spender, amount)` |
| `transferFrom(address from, address to, uint256 amount)` | `0x23b872dd` | `allowance < amount`, `to == address(0)`, or `balance < amount` | `Transfer(from, to, amount)` |

---

## 2. MiniScan JSON-RPC Queries

MiniScan (`website/src/lib/sepoliaRpc.ts`) performs strictly **read-only** JSON-RPC 2.0 `POST` calls against public CORS-enabled Ethereum Sepolia endpoints:

- `eth_chainId` — Verifies `0xaa36a7` (`11155111`).
- `eth_getBlockByNumber(["latest", false])` — Retrieves latest Sepolia block number, hash, timestamp, and tx count.
- `eth_gasPrice` — Retrieves live network gas price.
- `eth_getCode([address, "latest"])` — Verifies deployed contract bytecode length (`3,004` bytes for `MNC`).
- `eth_call([{ to, data }, "latest"])` — Executes read-only ERC-20 queries (`name`, `symbol`, `decimals`, `totalSupply`, `balanceOf`).
- `eth_getBalance([address, "latest"])` & `eth_getTransactionCount([address, "latest"])` — Queries native `SepoliaETH` balance and EOA nonce.
- `eth_getTransactionByHash([txHash])` & `eth_getTransactionReceipt([txHash])` — Fetches transaction status and decodes `Transfer` / `Approval` event logs.

If any RPC request fails or times out, MiniScan explicitly returns `"unavailable"` rather than fabricated placeholder values.

---

## 3. Python Consensus Lab Schemas

### 3.1 P2P HTTP Endpoints (`consensus-lab/p2p.py`)

- `GET /head`:
```json
{
  "chain_id": 31337,
  "height": 6,
  "hash": "0x...",
  "parent": "0x...",
  "state_root": "0x..."
}
```
- `GET /compare`:
```json
{
  "node": "A",
  "peer_connected": true,
  "local_height": 6,
  "remote_height": 6,
  "same_hash": true,
  "same_parent": true,
  "same_state": true
}
```

### 3.2 Two-Phase Vote Packet (`consensus-lab/two_phase.py`)

```json
{
  "vote": {
    "protocol": "MiniChain-V5-Lab",
    "chain_id": 31337,
    "round": "<128-bit-random-hex>",
    "validator": "A",
    "phase": "PRECOMMIT",
    "height": 6,
    "hash": "0x...",
    "proof": "<sha256-digest-of-sorted-prevote-certificate>"
  },
  "signature": "<ed25519-hex-signature>"
}
```
