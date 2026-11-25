"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { CopyButton } from "@/components/CopyButton";
import {
  BalanceLookupResult,
  ContractInspectionResult,
  fetchNetworkStatus,
  inspectContract,
  isValidAddress,
  isValidTxHash,
  lookupAddressBalance,
  lookupTransaction,
  MNC_CONTRACT_ADDRESS,
  MNC_GENESIS_TX_HASH,
  MNC_TREASURY_HOLDER,
  NetworkStatusData,
  SEPOLIA_ETHERSCAN_TOKEN,
  TransactionLookupResult,
} from "@/lib/sepoliaRpc";

export default function MiniScanExplorerPage() {
  const { t } = useLanguage();

  // Live Network Status
  const [netStatus, setNetStatus] = useState<NetworkStatusData | null>(null);
  const [netLoading, setNetLoading] = useState(true);

  // Contract Inspector
  const [contractInput, setContractInput] = useState(MNC_CONTRACT_ADDRESS);
  const [contractError, setContractError] = useState("");
  const [contractLoading, setContractLoading] = useState(true);
  const [contractData, setContractData] = useState<ContractInspectionResult | null>(null);

  // Balance Query
  const [balanceInput, setBalanceInput] = useState(MNC_TREASURY_HOLDER);
  const [balanceError, setBalanceError] = useState("");
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [balanceData, setBalanceData] = useState<BalanceLookupResult | null>(null);

  // Transaction Query
  const [txInput, setTxInput] = useState(MNC_GENESIS_TX_HASH);
  const [txError, setTxError] = useState("");
  const [txLoading, setTxLoading] = useState(false);
  const [txData, setTxData] = useState<TransactionLookupResult | null>(null);

  const loadInitialTelemetry = useCallback(async () => {
    setNetLoading(true);
    setContractLoading(true);
    const [net, mncInfo, holderBal, genesisTx] = await Promise.all([
      fetchNetworkStatus(),
      inspectContract(MNC_CONTRACT_ADDRESS),
      lookupAddressBalance(MNC_TREASURY_HOLDER),
      lookupTransaction(MNC_GENESIS_TX_HASH),
    ]);
    setNetStatus(net);
    setContractData(mncInfo);
    setBalanceData(holderBal);
    setTxData(genesisTx);
    setNetLoading(false);
    setContractLoading(false);
  }, []);

  useEffect(() => {
    void loadInitialTelemetry();
  }, [loadInitialTelemetry]);

  const refreshNetwork = async () => {
    setNetLoading(true);
    const res = await fetchNetworkStatus();
    setNetStatus(res);
    setNetLoading(false);
  };

  const handleContractSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidAddress(contractInput)) {
      setContractError(
        t(
          "Please enter a valid 42-character hexadecimal 0x address.",
          "请输入有效的 42 字符 0x 十六进制合约地址。"
        )
      );
      return;
    }
    setContractError("");
    setContractLoading(true);
    const res = await inspectContract(contractInput);
    setContractData(res);
    setContractLoading(false);
  };

  const handleBalanceSubmit = async (e: React.FormEvent, overrideAddr?: string) => {
    e.preventDefault();
    const target = (overrideAddr ?? balanceInput).trim();
    if (!isValidAddress(target)) {
      setBalanceError(
        t(
          "Please enter a valid 42-character hexadecimal 0x address.",
          "请输入有效的 42 字符 0x 十六进制钱包或合约地址。"
        )
      );
      return;
    }
    setBalanceError("");
    setBalanceLoading(true);
    const res = await lookupAddressBalance(target);
    setBalanceData(res);
    setBalanceLoading(false);
  };

  const handleTxSubmit = async (e: React.FormEvent, overrideHash?: string) => {
    e.preventDefault();
    const target = (overrideHash ?? txInput).trim();
    if (!isValidTxHash(target)) {
      setTxError(
        t(
          "Please enter a valid 66-character hexadecimal 0x transaction hash.",
          "请输入有效的 66 字符 0x 十六进制交易哈希。"
        )
      );
      return;
    }
    setTxError("");
    setTxLoading(true);
    const res = await lookupTransaction(target);
    setTxData(res);
    setTxLoading(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header & Strict Wallet-Free Security Banner */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-sky-400">
            MiniScan // Read-Only Ethereum Sepolia RPC Explorer
          </span>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {t("MiniScan Blockchain Explorer", "MiniScan 只读区块链浏览器")}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            {t(
              "Direct JSON-RPC queries against Ethereum Sepolia (Chain ID 11155111). All figures are fetched live from the network—if an RPC endpoint cannot be reached, fields explicitly report unavailable.",
              "直接向 Ethereum Sepolia 公共测试网（Chain ID 11155111）发起实时 JSON-RPC 查询。所有结果均为真实链上数据；若网络不可达则明确显示 unavailable，绝不编造。"
            )}
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-semibold text-emerald-200">
          <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
          <span>
            {t(
              "100% Read-Only · Wallet Connection Disabled for User Safety",
              "100% 纯只读查询 · 已禁止连接任何钱包以保障资产安全"
            )}
          </span>
        </div>
      </div>

      {/* Live Sepolia Network Status Panel */}
      <section
        aria-labelledby="network-status-heading"
        className="mt-8 rounded-2xl border border-indigo-500/25 bg-obsidian-900/90 p-5 sm:p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <Activity className="h-5 w-5 text-sky-400" aria-hidden="true" />
            <h2 id="network-status-heading" className="text-base font-bold text-white">
              {t("Ethereum Sepolia Network Status", "Ethereum Sepolia 实时网络状态")}
            </h2>
            {netLoading ? (
              <span className="rounded-full bg-slate-800 px-2.5 py-0.5 font-mono text-xs text-slate-300">
                {t("Querying RPC...", "正在查询 RPC...")}
              </span>
            ) : netStatus?.available ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 font-mono text-xs font-semibold text-emerald-300">
                <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                ONLINE ({netStatus.latencyMs} ms)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/15 px-2.5 py-0.5 font-mono text-xs font-semibold text-rose-300">
                <AlertCircle className="h-3 w-3" aria-hidden="true" />
                unavailable
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => void refreshNetwork()}
            disabled={netLoading}
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-indigo-400 hover:text-white disabled:opacity-60"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${netLoading ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            <span>{t("Refresh Telemetry", "刷新网络状态")}</span>
          </button>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" role="status" aria-live="polite">
          <div className="rounded-xl border border-slate-800 bg-obsidian-950/75 p-3.5">
            <p className="text-xs text-slate-400">{t("Chain ID", "链 ID (Chain ID)")}</p>
            <p className="mt-1 font-mono text-base font-bold text-white">
              {netLoading
                ? "..."
                : netStatus?.available && netStatus.chainId !== null
                ? netStatus.chainId
                : "unavailable"}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-obsidian-950/75 p-3.5">
            <p className="text-xs text-slate-400">{t("Latest Sepolia Block", "最新区块高度")}</p>
            <p className="mt-1 font-mono text-base font-bold text-sky-300">
              {netLoading
                ? "..."
                : netStatus?.available && netStatus.blockNumber !== null
                ? `#${netStatus.blockNumber.toLocaleString("en-US")}`
                : "unavailable"}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-obsidian-950/75 p-3.5">
            <p className="text-xs text-slate-400">{t("Gas Price", "当前 Gas 价格")}</p>
            <p className="mt-1 font-mono text-base font-bold text-indigo-300">
              {netLoading
                ? "..."
                : netStatus?.available && netStatus.gasPriceGwei
                ? `${netStatus.gasPriceGwei} Gwei`
                : "unavailable"}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-obsidian-950/75 p-3.5">
            <p className="text-xs text-slate-400">{t("Block Txs & Timestamp", "区块交易数与时间")}</p>
            <p className="mt-1 font-mono text-xs font-semibold text-slate-200">
              {netLoading
                ? "..."
                : netStatus?.available && netStatus.blockTimestamp
                ? `${netStatus.txCount ?? 0} txs · ${new Date(
                    netStatus.blockTimestamp * 1000
                  ).toISOString().slice(11, 19)} UTC`
                : "unavailable"}
            </p>
          </div>
        </div>
      </section>

      {/* Main Query Grid: Contract Inspector & Balance Lookup */}
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* 1. Contract & Total Supply Inspector */}
        <section
          aria-labelledby="contract-query-heading"
          className="rounded-2xl border border-indigo-500/25 bg-obsidian-900/90 p-6"
        >
          <div className="flex items-center justify-between gap-2">
            <h2 id="contract-query-heading" className="text-lg font-bold text-white">
              {t("1. Smart Contract & Supply Query", "1. 合约地址与代币总供应量查询")}
            </h2>
            <a
              href={SEPOLIA_ETHERSCAN_TOKEN}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-indigo-300 hover:text-indigo-200"
            >
              <span>Etherscan</span>
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          </div>

          <search className="mt-4">
            <form
              aria-labelledby="contract-query-heading"
              onSubmit={(e) => void handleContractSubmit(e)}
              noValidate
            >
              <label
                htmlFor="contract-address-input"
                className="block text-xs font-semibold text-slate-300"
              >
                {t(
                  "Sepolia Contract Address (0x + 40 hex chars)",
                  "Sepolia 合约地址 (0x 开头 42 位十六进制)"
                )}
              </label>
              <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
                <input
                  id="contract-address-input"
                  name="contractAddress"
                  type="text"
                  value={contractInput}
                  onChange={(e) => {
                    setContractInput(e.target.value);
                    if (contractError) setContractError("");
                  }}
                  onBlur={() => {
                    if (contractInput && !isValidAddress(contractInput)) {
                      setContractError(
                        t("Format must be 0x followed by 40 hex characters.", "格式须为 0x 加 40 位十六进制字符。")
                      );
                    }
                  }}
                  aria-invalid={contractError ? "true" : undefined}
                  aria-describedby={contractError ? "contract-err" : undefined}
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  enterKeyHint="search"
                  className="explorer-input flex-1 rounded-xl border border-slate-700 bg-obsidian-950 px-3.5 py-2.5 font-mono text-sm text-white"
                />
                <button
                  type="submit"
                  disabled={contractLoading}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
                >
                  <Search className="h-4 w-4" aria-hidden="true" />
                  <span>{t("Inspect Contract", "查询合约")}</span>
                </button>
              </div>
              {contractError && (
                <p id="contract-err" role="alert" className="mt-2 text-xs text-rose-400">
                  {contractError}
                </p>
              )}
            </form>
          </search>

          <div className="mt-5 space-y-2.5 rounded-xl border border-slate-800 bg-obsidian-950/85 p-4 text-sm" role="status" aria-live="polite">
            {contractLoading ? (
              <p className="font-mono text-xs text-slate-400">
                {t("Fetching live contract state from Sepolia...", "正在从 Sepolia 读取合约实时状态...")}
              </p>
            ) : !contractData || !contractData.available ? (
              <p className="font-mono text-xs text-rose-300">
                {t("Contract telemetry: unavailable", "合约状态数据：unavailable")}
              </p>
            ) : (
              <>
                <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                  <span className="text-xs text-slate-400">{t("Contract Address", "合约地址")}</span>
                  <div className="flex items-center gap-1.5">
                    <code id="exp-contract-addr" className="font-mono text-xs text-indigo-300">
                      {contractData.address.slice(0, 10)}...{contractData.address.slice(-8)}
                    </code>
                    <span id="exp-contract-full" className="sr-only">
                      {contractData.address}
                    </span>
                    <CopyButton
                      targetId="exp-contract-full"
                      label={t("Copy full contract address", "复制完整合约地址")}
                      compact
                    />
                  </div>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs text-slate-400">{t("Token Name & Symbol", "代币名称与符号")}</span>
                  <span className="font-mono text-xs font-semibold text-white">
                    {contractData.tokenName} ({contractData.tokenSymbol})
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs text-slate-400">{t("Live Total Supply", "实时总供应量")}</span>
                  <span className="font-mono text-sm font-bold text-emerald-300">
                    {contractData.totalSupplyFormatted !== "unavailable"
                      ? `${contractData.totalSupplyFormatted} ${
                          contractData.tokenSymbol !== "unavailable" ? contractData.tokenSymbol : ""
                        }`
                      : "unavailable"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs text-slate-400">{t("Decimals", "精度 (Decimals)")}</span>
                  <span className="font-mono text-xs text-slate-200">
                    {contractData.decimals !== null ? contractData.decimals : "unavailable"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-slate-400">{t("Deployed Bytecode", "链上字节码大小")}</span>
                  <span className="font-mono text-xs text-slate-200">
                    {contractData.bytecodeBytes !== null
                      ? `${contractData.bytecodeBytes.toLocaleString("en-US")} bytes`
                      : "unavailable"}
                  </span>
                </div>
              </>
            )}
          </div>
        </section>

        {/* 2. Testnet MNC & ETH Balance Lookup */}
        <section
          aria-labelledby="balance-query-heading"
          className="rounded-2xl border border-indigo-500/25 bg-obsidian-900/90 p-6"
        >
          <h2 id="balance-query-heading" className="text-lg font-bold text-white">
            {t("2. Testnet Address Balance Lookup", "2. 测试网账户余额查询 (MNC & ETH)")}
          </h2>

          <search className="mt-4">
            <form
              aria-labelledby="balance-query-heading"
              onSubmit={(e) => void handleBalanceSubmit(e)}
              noValidate
            >
              <label
                htmlFor="balance-address-input"
                className="block text-xs font-semibold text-slate-300"
              >
                {t(
                  "Wallet or Contract Address on Sepolia (Read-Only)",
                  "输入任意 Sepolia 地址查询实时测试网余额（纯只读）"
                )}
              </label>
              <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
                <input
                  id="balance-address-input"
                  name="walletAddress"
                  type="text"
                  value={balanceInput}
                  onChange={(e) => {
                    setBalanceInput(e.target.value);
                    if (balanceError) setBalanceError("");
                  }}
                  onBlur={() => {
                    if (balanceInput && !isValidAddress(balanceInput)) {
                      setBalanceError(
                        t("Format must be 0x followed by 40 hex characters.", "格式须为 0x 加 40 位十六进制字符。")
                      );
                    }
                  }}
                  aria-invalid={balanceError ? "true" : undefined}
                  aria-describedby={balanceError ? "balance-err" : undefined}
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  enterKeyHint="search"
                  className="explorer-input flex-1 rounded-xl border border-slate-700 bg-obsidian-950 px-3.5 py-2.5 font-mono text-sm text-white"
                />
                <button
                  type="submit"
                  disabled={balanceLoading}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
                >
                  <Search className="h-4 w-4" aria-hidden="true" />
                  <span>{t("Check Balance", "查询余额")}</span>
                </button>
              </div>
              {balanceError && (
                <p id="balance-err" role="alert" className="mt-2 text-xs text-rose-400">
                  {balanceError}
                </p>
              )}

              <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400">{t("Sample Addresses:", "示例地址：")}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    setBalanceInput(MNC_TREASURY_HOLDER);
                    void handleBalanceSubmit(e, MNC_TREASURY_HOLDER);
                  }}
                  className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 font-mono text-[11px] text-sky-300 hover:border-sky-400"
                >
                  {t("Genesis Holder (0x5090...90F6)", "创世持币地址 (0x5090...90F6)")}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    setBalanceInput(MNC_CONTRACT_ADDRESS);
                    void handleBalanceSubmit(e, MNC_CONTRACT_ADDRESS);
                  }}
                  className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 font-mono text-[11px] text-indigo-300 hover:border-indigo-400"
                >
                  {t("MNC Contract", "MNC 合约自身")}
                </button>
              </div>
            </form>
          </search>

          <div className="mt-5 space-y-2.5 rounded-xl border border-slate-800 bg-obsidian-950/85 p-4 text-sm" role="status" aria-live="polite">
            {balanceLoading ? (
              <p className="font-mono text-xs text-slate-400">
                {t("Querying balanceOf(address) on Sepolia...", "正在查询 Sepolia 链上实时余额...")}
              </p>
            ) : !balanceData || !balanceData.available ? (
              <p className="font-mono text-xs text-rose-300">
                {t("Balance lookup: unavailable", "测试网余额：unavailable")}
              </p>
            ) : (
              <>
                <div className="flex justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs text-slate-400">{t("Queried Address", "查询地址")}</span>
                  <code className="font-mono text-xs text-slate-200">
                    {balanceData.address.slice(0, 10)}...{balanceData.address.slice(-8)}
                  </code>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs text-slate-400">{t("MNC Testnet Balance", "MNC 测试网代币余额")}</span>
                  <span className="font-mono text-sm font-bold text-sky-300">
                    {balanceData.mncBalance !== "unavailable"
                      ? `${balanceData.mncBalance} MNC`
                      : "unavailable"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs text-slate-400">{t("Sepolia ETH Balance", "Sepolia ETH 余额")}</span>
                  <span className="font-mono text-xs text-slate-200">
                    {balanceData.sepoliaEthBalance !== "unavailable"
                      ? `${balanceData.sepoliaEthBalance} SepoliaETH`
                      : "unavailable"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-slate-400">{t("Account Nonce", "已发送交易数 (Nonce)")}</span>
                  <span className="font-mono text-xs text-slate-200">
                    {balanceData.txCountNonce !== null ? balanceData.txCountNonce : "unavailable"}
                  </span>
                </div>
              </>
            )}
          </div>
        </section>
      </div>

      {/* 3. Transaction Hash Inspector */}
      <section
        aria-labelledby="tx-query-heading"
        className="mt-8 rounded-2xl border border-indigo-500/25 bg-obsidian-900/90 p-6"
      >
        <h2 id="tx-query-heading" className="text-lg font-bold text-white">
          {t("3. Sepolia Transaction Hash Lookup & Event Decoder", "3. 交易哈希查询与 ERC-20 事件解码")}
        </h2>

        <search className="mt-4">
          <form
            aria-labelledby="tx-query-heading"
            onSubmit={(e) => void handleTxSubmit(e)}
            noValidate
          >
            <label htmlFor="tx-hash-input" className="block text-xs font-semibold text-slate-300">
              {t(
                "Sepolia Transaction Hash (0x + 64 hex chars)",
                "输入 Sepolia 交易哈希 (0x 开头 66 位十六进制)"
              )}
            </label>
            <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
              <input
                id="tx-hash-input"
                name="txHash"
                type="text"
                value={txInput}
                onChange={(e) => {
                  setTxInput(e.target.value);
                  if (txError) setTxError("");
                }}
                onBlur={() => {
                  if (txInput && !isValidTxHash(txInput)) {
                    setTxError(
                      t(
                        "Format must be 0x followed by 64 hex characters.",
                        "格式须为 0x 加 64 位十六进制字符。"
                      )
                    );
                  }
                }}
                aria-invalid={txError ? "true" : undefined}
                aria-describedby={txError ? "tx-err" : undefined}
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                enterKeyHint="search"
                className="explorer-input flex-1 rounded-xl border border-slate-700 bg-obsidian-950 px-3.5 py-2.5 font-mono text-xs sm:text-sm text-white"
              />
              <button
                type="submit"
                disabled={txLoading}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                <span>{t("Lookup Transaction", "查询交易")}</span>
              </button>
            </div>
            {txError && (
              <p id="tx-err" role="alert" className="mt-2 text-xs text-rose-400">
                {txError}
              </p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400">{t("Verified Preset:", "真实交易预设：")}</span>
              <button
                type="button"
                onClick={(e) => {
                  setTxInput(MNC_GENESIS_TX_HASH);
                  void handleTxSubmit(e, MNC_GENESIS_TX_HASH);
                }}
                className="rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1 font-mono text-[11px] text-indigo-300 hover:border-indigo-400"
              >
                {t("MNC Deployment & Genesis Mint Tx", "MNC 合约部署与创世铸造交易")}
              </button>
            </div>
          </form>
        </search>

        <div className="mt-5 rounded-xl border border-slate-800 bg-obsidian-950/85 p-4 text-sm" role="status" aria-live="polite">
          {txLoading ? (
            <p className="font-mono text-xs text-slate-400">
              {t("Fetching transaction & receipt from Sepolia...", "正在从 Sepolia 查询交易与回执...")}
            </p>
          ) : !txData || !txData.available ? (
            <p className="font-mono text-xs text-rose-300">
              {t("Transaction data: unavailable", "交易查询结果：unavailable")}
            </p>
          ) : !txData.found ? (
            <p className="font-mono text-xs text-amber-300">
              {t(
                "Transaction not found on Ethereum Sepolia (unavailable).",
                "在 Ethereum Sepolia 上未找到该交易记录 (unavailable)。"
              )}
            </p>
          ) : (
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <span className="text-xs text-slate-400">{t("Status", "执行状态")}</span>
                  <p className="mt-0.5 font-mono text-xs font-bold text-emerald-400">
                    {txData.status}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">{t("Block Number", "所属区块")}</span>
                  <p className="mt-0.5 font-mono text-xs text-white">
                    {txData.blockNumber !== null
                      ? `#${txData.blockNumber.toLocaleString("en-US")}`
                      : "unavailable"}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">{t("Gas Used", "消耗 Gas")}</span>
                  <p className="mt-0.5 font-mono text-xs text-white">{txData.gasUsed}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">{t("ETH Value", "附带 ETH")}</span>
                  <p className="mt-0.5 font-mono text-xs text-white">{txData.valueEth} ETH</p>
                </div>
              </div>

              <div className="grid gap-2 border-t border-slate-800 pt-3 text-xs font-mono">
                <div className="break-all">
                  <span className="text-slate-400">From: </span>
                  <span className="text-slate-200">{txData.from}</span>
                </div>
                <div className="break-all">
                  <span className="text-slate-400">To: </span>
                  <span className="text-slate-200">{txData.to}</span>
                </div>
                {txData.createdContract && (
                  <div className="break-all">
                    <span className="text-slate-400">Created Contract: </span>
                    <span className="text-indigo-300">{txData.createdContract}</span>
                  </div>
                )}
              </div>

              {txData.decodedEvents.length > 0 && (
                <div className="border-t border-slate-800 pt-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                    {t("Decoded ERC-20 Logs", "解码的 ERC-20 链上事件")}
                  </p>
                  <div className="mt-2 space-y-2">
                    {txData.decodedEvents.map((ev, idx) => (
                      <div
                        key={`${ev.contract}-${idx}`}
                        className="rounded-lg border border-indigo-500/20 bg-obsidian-900 p-3 font-mono text-xs text-slate-200"
                      >
                        <span className="font-bold text-indigo-300">{ev.event}</span> ·{" "}
                        <span className="text-emerald-300">{ev.amountFormatted} tokens</span>
                        <div className="mt-1 break-all text-[11px] text-slate-400">
                          from {ev.from} → to {ev.to}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
