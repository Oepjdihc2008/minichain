"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  Database,
  ExternalLink,
  FileCode2,
  Layers,
  Lock,
  Search,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { CopyButton } from "@/components/CopyButton";
import { MncLogo } from "@/components/MncLogo";
import {
  MNC_CONTRACT_ADDRESS,
  MNC_DEPLOYMENT_BLOCK,
  MNC_GENESIS_TX_HASH,
  SEPOLIA_CHAIN_ID,
  SEPOLIA_ETHERSCAN_TOKEN,
} from "@/lib/sepoliaRpc";

export default function HomePage() {
  const { t } = useLanguage();

  const stats = [
    {
      value: "20 / 20",
      labelEn: "Smart Contract Tests",
      labelZh: "智能合约测试通过",
      detailEn: "Foundry Solc 0.8.28 Suites",
      detailZh: "Foundry Solc 0.8.28 测试套件",
    },
    {
      value: "12 / 12",
      labelEn: "MNC Token Tests",
      labelZh: "MNC 专项测试通过",
      detailEn: "ERC-20 Unit & Invariant Checks",
      detailZh: "ERC-20 单元与不变量测试",
    },
    {
      value: "30,000",
      labelEn: "Randomized Fuzz Runs",
      labelZh: "MNC 随机模糊测试",
      detailEn: "Supply & Allowance Conservation",
      detailZh: "供应量守恒与授权边界验证",
    },
    {
      value: "6 / 6",
      labelEn: "Disaster Recovery",
      labelZh: "灾难恢复检查通过",
      detailEn: "State Root & Bytecode Parity",
      detailZh: "状态根与合约字节码完整性",
    },
  ];

  const milestones = [
    {
      icon: Lock,
      titleEn: "SHA-256 & Ed25519 Cryptography",
      titleZh: "SHA-256 哈希与 Ed25519 数字签名",
      descEn:
        "Canonical JSON hashing, PoW block linkage, Ed25519 signed transactions, and pinned validator public-key registries.",
      descZh:
        "规范化 JSON 哈希、PoW 区块链接、Ed25519 交易与选票签名，以及受信任验证器公钥指纹注册表。",
    },
    {
      icon: Cpu,
      titleEn: "Two-Phase BFT & Safe Unlock Lab",
      titleZh: "BFT 两阶段投票与跨轮次安全解锁",
      descEn:
        "4-validator (3f+1) Prevote/Precommit Quorum Certificates, 81-state deadlock analysis, and Tendermint-style PoLC unlocking.",
      descZh:
        "4 节点 (3f+1) Prevote/Precommit 法定人数证书、81 种锁定状态穷举分析及高轮次 QC 安全解锁。",
    },
    {
      icon: Database,
      titleEn: "SQLite ACID Persistence & Audit",
      titleZh: "SQLite 持久化存储与只读历史审计",
      descEn:
        "Atomic BEGIN IMMEDIATE lock-before-sign storage, per-height finality registry, and read-only cryptographic audit scripts.",
      descZh:
        "基于 BEGIN IMMEDIATE 的先落盘锁定后签名、单高度最终性账本及只读密码学历史记录审计。",
    },
    {
      icon: Layers,
      titleEn: "EVM Contracts & Sepolia MNC",
      titleZh: "EVM 智能合约与 Sepolia 链上部署",
      descEn:
        "Zero-dependency Solidity 0.8.28 ERC-20 token (MNC) verified by 30,000 fuzz runs and live on Ethereum Sepolia.",
      descZh:
        "零外部依赖 Solidity 0.8.28 原生 ERC-20 合约，通过 30,000 次模糊测试并公开部署于 Ethereum Sepolia。",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-indigo-500/25 bg-gradient-to-br from-obsidian-900 via-obsidian-850 to-indigo-950/40 p-8 sm:p-12 lg:p-16">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-medium text-indigo-200">
              <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" aria-hidden="true" />
              <span>
                {t(
                  "Open-Source Blockchain Systems Engineering Project",
                  "面向全球开发者的开源区块链工程研究项目"
                )}
              </span>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <MncLogo
                className="h-16 w-16 shrink-0 drop-shadow-[0_0_24px_rgba(234,199,123,0.28)] sm:h-20 sm:w-20"
                ariaLabel="MiniChain & MNC Official Logo"
              />
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                MiniChain
              </h1>
            </div>
            <p className="mt-3 bg-gradient-to-r from-[#EAC77B] via-sky-400 to-indigo-400 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl lg:text-4xl">
              {t(
                "From Cryptographic Primitives to BFT Consensus & EVM Verification",
                "从密码学原语、BFT 共识实验到 EVM 智能合约形式化测试"
              )}
            </p>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              {t(
                "MiniChain is a transparent, from-first-principles blockchain engineering laboratory combining standalone Python BFT consensus & SQLite persistence experiments with Foundry-tested Solidity smart contracts deployed on Ethereum Sepolia.",
                "MiniChain 是一个坚持工程诚实与第一性原理的开源区块链技术实验室，涵盖独立的 Python BFT 两阶段共识与 SQLite 持久化实验，以及经 Foundry 严格验证并部署于 Ethereum Sepolia 的 Solidity 智能合约。"
              )}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link
                href="/explorer"
                className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:from-indigo-500 hover:to-violet-500"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                <span>{t("Launch MiniScan Explorer", "打开 MiniScan 链上浏览器")}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>

              <Link
                href="/architecture"
                className="inline-flex min-h-[48px] items-center gap-2 rounded-xl border border-indigo-400/35 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-indigo-400 hover:bg-slate-800"
              >
                <Layers className="h-4 w-4 text-sky-400" aria-hidden="true" />
                <span>{t("Interactive Architecture", "交互式技术架构图")}</span>
              </Link>

              <Link
                href="/open-source"
                className="inline-flex min-h-[48px] items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white"
              >
                <FileCode2 className="h-4 w-4 text-violet-400" aria-hidden="true" />
                <span>{t("Inspect Source Code", "浏览开源代码")}</span>
              </Link>
            </div>
          </div>

          {/* Original Technical SVG Schematic Illustration */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-indigo-500/25 bg-obsidian-950/90 p-5 shadow-2xl">
              <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-2.5 text-xs font-mono text-slate-400">
                <span>MINICHAIN // DUAL-PLANE TELEMETRY</span>
                <span className="text-emerald-400">VERIFIED</span>
              </div>
              <svg
                viewBox="0 0 420 300"
                role="img"
                aria-label={t(
                  "MiniChain dual-plane engineering schematic showing Python BFT Consensus Lab and Ethereum Sepolia EVM Execution Plane",
                  "MiniChain 双平面工程示意图：展示 Python BFT 共识实验层与 Ethereum Sepolia EVM 合约执行层"
                )}
                className="w-full h-auto"
              >
                <defs>
                  <linearGradient id="hero-plane-a" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.08" />
                  </linearGradient>
                  <linearGradient id="hero-plane-b" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0.08" />
                  </linearGradient>
                </defs>

                {/* Plane A Box */}
                <rect
                  x="14"
                  y="14"
                  width="392"
                  height="118"
                  rx="12"
                  fill="url(#hero-plane-a)"
                  stroke="#38bdf8"
                  strokeOpacity="0.45"
                />
                <text x="28" y="36" fill="#7dd3fc" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  PLANE A · STANDALONE PYTHON BFT CONSENSUS LAB
                </text>

                {/* 4 Validator Nodes */}
                {[
                  { x: 48, label: "VAL A" },
                  { x: 138, label: "VAL B" },
                  { x: 228, label: "VAL C" },
                  { x: 318, label: "VAL D" },
                ].map((n) => (
                  <g key={n.label}>
                    <rect
                      x={n.x}
                      y="50"
                      width="64"
                      height="36"
                      rx="7"
                      fill="#090e1a"
                      stroke="#60a5fa"
                      strokeWidth="1.2"
                    />
                    <text
                      x={n.x + 32}
                      y="72"
                      textAnchor="middle"
                      fill="#e2e8f0"
                      fontSize="10"
                      fontFamily="monospace"
                    >
                      {n.label}
                    </text>
                  </g>
                ))}
                <text x="210" y="114" textAnchor="middle" fill="#cbd5e1" fontSize="10" fontFamily="monospace">
                  Ed25519 Sign · 2-Phase QC (3/4) · SQLite LockStore
                </text>

                {/* Boundary Line */}
                <line
                  x1="24"
                  y1="152"
                  x2="396"
                  y2="152"
                  stroke="#fbbf24"
                  strokeDasharray="5 5"
                  strokeOpacity="0.7"
                />
                <rect x="92" y="141" width="236" height="22" rx="11" fill="#090e1a" stroke="#fbbf24" strokeOpacity="0.55" />
                <text x="210" y="155" textAnchor="middle" fill="#fde68a" fontSize="9.5" fontFamily="monospace">
                  JSON-RPC Header Read Boundary (Decoupled)
                </text>

                {/* Plane B Box */}
                <rect
                  x="14"
                  y="172"
                  width="392"
                  height="114"
                  rx="12"
                  fill="url(#hero-plane-b)"
                  stroke="#a855f7"
                  strokeOpacity="0.45"
                />
                <text x="28" y="194" fill="#d8b4fe" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  PLANE B · EVM SMART CONTRACTS (ANVIL &amp; SEPOLIA)
                </text>

                <rect x="34" y="208" width="166" height="60" rx="8" fill="#090e1a" stroke="#818cf8" strokeWidth="1.2" />
                <text x="117" y="231" textAnchor="middle" fill="#e2e8f0" fontSize="10.5" fontFamily="monospace" fontWeight="bold">
                  MNC.sol (ERC-20)
                </text>
                <text x="117" y="249" textAnchor="middle" fill="#94a3b8" fontSize="9.5" fontFamily="monospace">
                  1,000,000 MNC · 30k Fuzz
                </text>

                <rect x="220" y="208" width="166" height="60" rx="8" fill="#090e1a" stroke="#c084fc" strokeWidth="1.2" />
                <text x="303" y="231" textAnchor="middle" fill="#e2e8f0" fontSize="10.5" fontFamily="monospace" fontWeight="bold">
                  Sepolia #11155111
                </text>
                <text x="303" y="249" textAnchor="middle" fill="#94a3b8" fontSize="9.5" fontFamily="monospace">
                  0x32C8...2Ee6 · Live
                </text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Metrics Strip */}
      <section aria-labelledby="verified-metrics-heading" className="mt-10">
        <h2 id="verified-metrics-heading" className="sr-only">
          {t("Verified Engineering Test Metrics", "已核实的工程测试指标")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.labelEn}
              className="rounded-2xl border border-indigo-500/20 bg-obsidian-900/90 p-6 transition hover:border-indigo-400/40"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-3xl font-extrabold tracking-tight text-white">
                  {item.value}
                </span>
                <CheckCircle2 className="h-5 w-5 text-emerald-400" aria-hidden="true" />
              </div>
              <p className="mt-2 text-sm font-semibold text-indigo-200">
                {t(item.labelEn, item.labelZh)}
              </p>
              <p className="mt-1 text-xs text-slate-400">{t(item.detailEn, item.detailZh)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Public On-Chain Deployment Record */}
      <section
        aria-labelledby="onchain-record-heading"
        className="mt-14 rounded-3xl border border-indigo-500/25 bg-obsidian-900/90 p-6 sm:p-8"
      >
        <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3.5">
            <MncLogo className="h-12 w-12 shrink-0" ariaLabel="MiniChain Coin (MNC) Token Emblem" />
            <div>
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#EAC77B]">
                {t("Public On-Chain Artifact", "公开链上部署记录")}
              </span>
              <h2 id="onchain-record-heading" className="mt-0.5 text-2xl font-bold text-white">
                {t(
                  "MiniChain Coin (MNC) on Ethereum Sepolia",
                  "MiniChain Coin (MNC) · Ethereum Sepolia 测试网记录"
                )}
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/explorer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600/20 border border-indigo-400/35 px-4 py-2 text-xs font-semibold text-indigo-200 hover:bg-indigo-600/30"
            >
              <Terminal className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t("Query Live via MiniScan", "在 MiniScan 实时查询")}</span>
            </Link>
            <a
              href={SEPOLIA_ETHERSCAN_TOKEN}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-200 hover:border-slate-500 hover:text-white"
            >
              <span>Sepolia Etherscan</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-obsidian-950/75 p-4">
            <p className="text-xs text-slate-400">{t("Network & Chain ID", "部署网络与 Chain ID")}</p>
            <p className="mt-1 font-mono text-sm font-semibold text-white">
              Ethereum Sepolia ({SEPOLIA_CHAIN_ID})
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-obsidian-950/75 p-4">
            <p className="text-xs text-slate-400">{t("Token & Symbol", "代币名称与符号")}</p>
            <p className="mt-1 font-mono text-sm font-semibold text-white">
              MiniChain Coin (MNC)
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-obsidian-950/75 p-4">
            <p className="text-xs text-slate-400">{t("Fixed Supply & Decimals", "固定总供应量与精度")}</p>
            <p className="mt-1 font-mono text-sm font-semibold text-white">
              1,000,000 MNC (18 Decimals)
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-obsidian-950/75 p-4 md:col-span-2">
            <p className="text-xs text-slate-400">{t("Contract Address", "智能合约地址")}</p>
            <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
              <code
                id="home-mnc-contract"
                className="break-all font-mono text-xs sm:text-sm text-indigo-300"
              >
                {MNC_CONTRACT_ADDRESS}
              </code>
              <CopyButton
                targetId="home-mnc-contract"
                label={t("Copy MNC contract address", "复制 MNC 合约地址")}
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-obsidian-950/75 p-4">
            <p className="text-xs text-slate-400">{t("Deployment Block & Valuation", "部署区块与经济属性")}</p>
            <p className="mt-1 font-mono text-sm font-semibold text-amber-300">
              Block #{MNC_DEPLOYMENT_BLOCK.toLocaleString("en-US")} · {t("$0 Testnet Only", "零货币价值测试网代币")}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-obsidian-950/75 p-4 md:col-span-3">
            <p className="text-xs text-slate-400">
              {t("Verified Genesis Deployment Transaction Hash", "链上创世部署交易哈希")}
            </p>
            <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
              <code
                id="home-mnc-tx"
                className="break-all font-mono text-xs text-slate-300"
              >
                {MNC_GENESIS_TX_HASH}
              </code>
              <CopyButton
                targetId="home-mnc-tx"
                label={t("Copy genesis deployment transaction hash", "复制创世部署交易哈希")}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Engineering Pillars */}
      <section aria-labelledby="pillars-heading" className="mt-16">
        <div className="max-w-3xl">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-indigo-400">
            {t("Technical Scope", "核心工程成果")}
          </span>
          <h2 id="pillars-heading" className="mt-1 text-2xl font-bold text-white sm:text-3xl">
            {t(
              "Built From Scratch to Demystify Consensus & Smart Contract Safety",
              "从底层实现共识容错与智能合约安全验证"
            )}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">
            {t(
              "Every claim in MiniChain maps directly to executable Python or Solidity files in the open-source repository. Standalone BFT consensus experiments and EVM execution nodes are cleanly separated and documented without exaggeration.",
              "MiniChain 的每一项技术成果均对应开源仓库中可独立运行与复现的 Python 或 Solidity 源码，并严格区分独立 BFT 共识实验层与 Anvil/Sepolia EVM 执行节点，绝不夸大或虚构集成进度。"
            )}
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {milestones.map((m) => {
            const Icon = m.icon;
            return (
              <article
                key={m.titleEn}
                className="rounded-2xl border border-indigo-500/20 bg-obsidian-900/80 p-6 transition hover:border-indigo-400/40"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-white">
                  {t(m.titleEn, m.titleZh)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {t(m.descEn, m.descZh)}
                </p>
              </article>
            );
          })}
        </div>

        {/* Architectural Integrity Banner */}
        <div className="mt-8 rounded-2xl border border-sky-500/25 bg-sky-500/5 p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-bold text-white">
                {t(
                  "Architectural Transparency Commitment",
                  "架构透明性承诺：明确区分独立共识实验与 EVM 节点"
                )}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-300">
                {t(
                  "MiniChain's Python BFT consensus modules (Prevote/Precommit QCs, SQLite lock persistence, and PoLC unlocking) operate as an independent consensus research lab and external JSON-RPC block-header observer over local Anvil EVM instances. They are not yet integrated into an EVM client's internal block-building engine.",
                  "MiniChain 的 Python BFT 共识模块（两阶段投票证书、SQLite 跨轮次锁定与安全解锁）作为独立共识协议实验系统运行，通过 JSON-RPC 外部观测本地 Anvil EVM 节点区块头；当前尚未集成为驱动 EVM 内部出块的底层共识引擎。"
                )}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
