export const SEPOLIA_CHAIN_ID = 11155111;
export const MNC_CONTRACT_ADDRESS = "0x32C80Bb0fd51D32c31b52795a181042BF90E2Ee6";
export const MNC_GENESIS_TX_HASH = "0x40c220f1c9f4bdcd770965b8b3d1c9e6d253cb5067b27859d2456413d4b7b4b8";
export const MNC_DEPLOYMENT_BLOCK = 12207520;
export const MNC_TREASURY_HOLDER = "0x50909575Ef5a00e4CB383146560134fB453990F6";
export const SEPOLIA_ETHERSCAN_TOKEN =
  "https://sepolia.etherscan.io/token/0x32C80Bb0fd51D32c31b52795a181042BF90E2Ee6";

// Verified CORS-enabled public Ethereum Sepolia JSON-RPC endpoints
export const SEPOLIA_RPC_ENDPOINTS = [
  "https://ethereum-sepolia-rpc.publicnode.com",
];

const TRANSFER_TOPIC =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
const APPROVAL_TOPIC =
  "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925";

export class RpcUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RpcUnavailableError";
  }
}

export async function sepoliaRpcCall<T = unknown>(
  method: string,
  params: unknown[] = [],
  timeoutMs = 8000
): Promise<{ result: T; endpoint: string; latencyMs: number }> {
  let lastError: unknown = null;

  for (const endpoint of SEPOLIA_RPC_ENDPOINTS) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const start = performance.now();

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method,
          params,
        }),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const json = await response.json();
      if (json.error) {
        throw new Error(json.error.message || "RPC returned error");
      }

      const latencyMs = Math.round(performance.now() - start);
      return { result: json.result as T, endpoint, latencyMs };
    } catch (err) {
      clearTimeout(timer);
      lastError = err;
    }
  }

  throw new RpcUnavailableError(
    lastError instanceof Error ? lastError.message : "Sepolia RPC unavailable"
  );
}

export function isValidAddress(value: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(value.trim());
}

export function isValidTxHash(value: string): boolean {
  return /^0x[0-9a-fA-F]{64}$/.test(value.trim());
}

export function decodeAbiString(hex: string): string {
  if (!hex || hex === "0x" || hex.length < 130) {
    return "unavailable";
  }
  try {
    const clean = hex.slice(2);
    const offset = parseInt(clean.slice(0, 64), 16) * 2;
    const length = parseInt(clean.slice(offset, offset + 64), 16);
    const strHex = clean.slice(offset + 64, offset + 64 + length * 2);
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      bytes[i] = parseInt(strHex.slice(i * 2, i * 2 + 2), 16);
    }
    return new TextDecoder().decode(bytes);
  } catch {
    return "unavailable";
  }
}

export function formatUnits(rawHexOrBigInt: string | bigint, decimals = 18): string {
  try {
    const value =
      typeof rawHexOrBigInt === "bigint"
        ? rawHexOrBigInt
        : rawHexOrBigInt === "0x" || !rawHexOrBigInt
        ? 0n
        : BigInt(rawHexOrBigInt);

    const base = 10n ** BigInt(decimals);
    const integerPart = value / base;
    const fractionPart = value % base;

    const intFormatted = integerPart.toLocaleString("en-US");
    if (fractionPart === 0n) {
      return intFormatted;
    }
    const fracStr = fractionPart
      .toString()
      .padStart(decimals, "0")
      .slice(0, 6)
      .replace(/0+$/, "");
    return fracStr ? `${intFormatted}.${fracStr}` : intFormatted;
  } catch {
    return "unavailable";
  }
}

export interface NetworkStatusData {
  available: boolean;
  chainId: number | null;
  blockNumber: number | null;
  blockHash: string | null;
  blockTimestamp: number | null;
  txCount: number | null;
  gasPriceGwei: string | null;
  endpoint: string | null;
  latencyMs: number | null;
  error?: string;
}

export async function fetchNetworkStatus(): Promise<NetworkStatusData> {
  try {
    const [chainRes, blockRes, gasRes] = await Promise.all([
      sepoliaRpcCall<string>("eth_chainId"),
      sepoliaRpcCall<{
        number: string;
        hash: string;
        timestamp: string;
        transactions: unknown[];
      }>("eth_getBlockByNumber", ["latest", false]),
      sepoliaRpcCall<string>("eth_gasPrice"),
    ]);

    const chainId = parseInt(chainRes.result, 16);
    if (chainId !== SEPOLIA_CHAIN_ID || !blockRes.result) {
      throw new Error("Unexpected chain ID or empty block");
    }

    const gasWei = BigInt(gasRes.result);
    const gasGwei = (Number(gasWei) / 1e9).toFixed(4);

    return {
      available: true,
      chainId,
      blockNumber: parseInt(blockRes.result.number, 16),
      blockHash: blockRes.result.hash,
      blockTimestamp: parseInt(blockRes.result.timestamp, 16),
      txCount: Array.isArray(blockRes.result.transactions)
        ? blockRes.result.transactions.length
        : null,
      gasPriceGwei: gasGwei,
      endpoint: chainRes.endpoint,
      latencyMs: chainRes.latencyMs,
    };
  } catch (err) {
    return {
      available: false,
      chainId: null,
      blockNumber: null,
      blockHash: null,
      blockTimestamp: null,
      txCount: null,
      gasPriceGwei: null,
      endpoint: null,
      latencyMs: null,
      error: err instanceof Error ? err.message : "unavailable",
    };
  }
}

export interface ContractInspectionResult {
  available: boolean;
  address: string;
  isContract: boolean;
  bytecodeBytes: number | null;
  ethBalance: string;
  tokenName: string;
  tokenSymbol: string;
  decimals: number | null;
  totalSupplyFormatted: string;
  totalSupplyRaw: string;
  error?: string;
}

export async function inspectContract(address: string): Promise<ContractInspectionResult> {
  const cleanAddr = address.trim();
  try {
    const [codeRes, ethBalRes] = await Promise.all([
      sepoliaRpcCall<string>("eth_getCode", [cleanAddr, "latest"]),
      sepoliaRpcCall<string>("eth_getBalance", [cleanAddr, "latest"]),
    ]);

    const code = codeRes.result || "0x";
    const isContract = code.length > 2;
    const bytecodeBytes = isContract ? (code.length - 2) / 2 : 0;

    if (!isContract) {
      return {
        available: true,
        address: cleanAddr,
        isContract: false,
        bytecodeBytes: 0,
        ethBalance: formatUnits(ethBalRes.result, 18),
        tokenName: "unavailable (EOA / No bytecode)",
        tokenSymbol: "unavailable",
        decimals: null,
        totalSupplyFormatted: "unavailable",
        totalSupplyRaw: "unavailable",
      };
    }

    const [nameRes, symRes, decRes, supRes] = await Promise.allSettled([
      sepoliaRpcCall<string>("eth_call", [{ to: cleanAddr, data: "0x06fdde03" }, "latest"]),
      sepoliaRpcCall<string>("eth_call", [{ to: cleanAddr, data: "0x95d89b41" }, "latest"]),
      sepoliaRpcCall<string>("eth_call", [{ to: cleanAddr, data: "0x313ce567" }, "latest"]),
      sepoliaRpcCall<string>("eth_call", [{ to: cleanAddr, data: "0x18160ddd" }, "latest"]),
    ]);

    const tokenName =
      nameRes.status === "fulfilled" ? decodeAbiString(nameRes.value.result) : "unavailable";
    const tokenSymbol =
      symRes.status === "fulfilled" ? decodeAbiString(symRes.value.result) : "unavailable";
    const decimals =
      decRes.status === "fulfilled" && decRes.value.result && decRes.value.result !== "0x"
        ? parseInt(decRes.value.result, 16)
        : null;
    const supplyRawHex =
      supRes.status === "fulfilled" && supRes.value.result && supRes.value.result !== "0x"
        ? supRes.value.result
        : null;

    return {
      available: true,
      address: cleanAddr,
      isContract: true,
      bytecodeBytes,
      ethBalance: formatUnits(ethBalRes.result, 18),
      tokenName,
      tokenSymbol,
      decimals,
      totalSupplyFormatted:
        supplyRawHex !== null && decimals !== null
          ? formatUnits(supplyRawHex, decimals)
          : "unavailable",
      totalSupplyRaw:
        supplyRawHex !== null ? BigInt(supplyRawHex).toString(10) : "unavailable",
    };
  } catch (err) {
    return {
      available: false,
      address: cleanAddr,
      isContract: false,
      bytecodeBytes: null,
      ethBalance: "unavailable",
      tokenName: "unavailable",
      tokenSymbol: "unavailable",
      decimals: null,
      totalSupplyFormatted: "unavailable",
      totalSupplyRaw: "unavailable",
      error: err instanceof Error ? err.message : "unavailable",
    };
  }
}

export interface BalanceLookupResult {
  available: boolean;
  address: string;
  mncBalance: string;
  mncRaw: string;
  sepoliaEthBalance: string;
  txCountNonce: number | null;
  error?: string;
}

export async function lookupAddressBalance(address: string): Promise<BalanceLookupResult> {
  const cleanAddr = address.trim();
  try {
    const padded = cleanAddr.slice(2).toLowerCase().padStart(64, "0");
    const [mncRes, ethRes, nonceRes] = await Promise.all([
      sepoliaRpcCall<string>("eth_call", [
        { to: MNC_CONTRACT_ADDRESS, data: `0x70a08231${padded}` },
        "latest",
      ]),
      sepoliaRpcCall<string>("eth_getBalance", [cleanAddr, "latest"]),
      sepoliaRpcCall<string>("eth_getTransactionCount", [cleanAddr, "latest"]),
    ]);

    return {
      available: true,
      address: cleanAddr,
      mncBalance: formatUnits(mncRes.result, 18),
      mncRaw: BigInt(mncRes.result || "0x0").toString(10),
      sepoliaEthBalance: formatUnits(ethRes.result, 18),
      txCountNonce: parseInt(nonceRes.result, 16),
    };
  } catch (err) {
    return {
      available: false,
      address: cleanAddr,
      mncBalance: "unavailable",
      mncRaw: "unavailable",
      sepoliaEthBalance: "unavailable",
      txCountNonce: null,
      error: err instanceof Error ? err.message : "unavailable",
    };
  }
}

export interface DecodedEventLog {
  contract: string;
  event: string;
  from: string;
  to: string;
  amountFormatted: string;
}

export interface TransactionLookupResult {
  available: boolean;
  found: boolean;
  hash: string;
  status: "SUCCESS" | "REVERTED" | "PENDING" | "UNAVAILABLE";
  blockNumber: number | null;
  from: string;
  to: string;
  createdContract: string | null;
  valueEth: string;
  gasUsed: string;
  decodedEvents: DecodedEventLog[];
  error?: string;
}

export async function lookupTransaction(txHash: string): Promise<TransactionLookupResult> {
  const cleanHash = txHash.trim();
  try {
    const [txRes, receiptRes] = await Promise.all([
      sepoliaRpcCall<{
        hash: string;
        from: string;
        to: string | null;
        value: string;
        blockNumber: string | null;
      } | null>("eth_getTransactionByHash", [cleanHash]),
      sepoliaRpcCall<{
        status: string;
        blockNumber: string;
        gasUsed: string;
        contractAddress: string | null;
        logs: Array<{
          address: string;
          topics: string[];
          data: string;
        }>;
      } | null>("eth_getTransactionReceipt", [cleanHash]),
    ]);

    if (!txRes.result) {
      return {
        available: true,
        found: false,
        hash: cleanHash,
        status: "UNAVAILABLE",
        blockNumber: null,
        from: "unavailable",
        to: "unavailable",
        createdContract: null,
        valueEth: "unavailable",
        gasUsed: "unavailable",
        decodedEvents: [],
      };
    }

    const tx = txRes.result;
    const receipt = receiptRes.result;

    const decodedEvents: DecodedEventLog[] = [];
    if (receipt?.logs) {
      for (const log of receipt.logs) {
        const topic0 = log.topics?.[0]?.toLowerCase();
        if (
          (topic0 === TRANSFER_TOPIC || topic0 === APPROVAL_TOPIC) &&
          log.topics.length >= 3
        ) {
          const fromAddr = "0x" + log.topics[1].slice(26);
          const toAddr = "0x" + log.topics[2].slice(26);
          decodedEvents.push({
            contract: log.address,
            event: topic0 === TRANSFER_TOPIC ? "Transfer" : "Approval",
            from: fromAddr,
            to: toAddr,
            amountFormatted: formatUnits(log.data, 18),
          });
        }
      }
    }

    return {
      available: true,
      found: true,
      hash: cleanHash,
      status: !receipt
        ? "PENDING"
        : receipt.status === "0x1"
        ? "SUCCESS"
        : "REVERTED",
      blockNumber: tx.blockNumber ? parseInt(tx.blockNumber, 16) : null,
      from: tx.from,
      to: tx.to || "Contract Creation",
      createdContract: receipt?.contractAddress || null,
      valueEth: formatUnits(tx.value, 18),
      gasUsed: receipt?.gasUsed ? parseInt(receipt.gasUsed, 16).toLocaleString("en-US") : "unavailable",
      decodedEvents,
    };
  } catch (err) {
    return {
      available: false,
      found: false,
      hash: cleanHash,
      status: "UNAVAILABLE",
      blockNumber: null,
      from: "unavailable",
      to: "unavailable",
      createdContract: null,
      valueEth: "unavailable",
      gasUsed: "unavailable",
      decodedEvents: [],
      error: err instanceof Error ? err.message : "unavailable",
    };
  }
}
