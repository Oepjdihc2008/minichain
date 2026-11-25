"use client";

import React, { useState } from "react";
import { AlertTriangle, CheckCircle2, FileCode, Layers } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { ARCHITECTURE_MODULES, ArchitectureModule } from "@/lib/projectData";

export default function ArchitecturePage() {
  const { t } = useLanguage();
  const [selectedId, setSelectedId] = useState<ArchitectureModule["id"]>("consensus");

  const selected =
    ARCHITECTURE_MODULES.find((m) => m.id === selectedId) || ARCHITECTURE_MODULES[0];

  const svgNodes: Array<{
    id: ArchitectureModule["id"];
    x: number;
    y: number;
    w: number;
    h: number;
    labelEn: string;
    labelZh: string;
    subEn: string;
    subZh: string;
    stroke: string;
  }> = [
    {
      id: "nodes",
      x: 36,
      y: 66,
      w: 215,
      h: 78,
      labelEn: "1. Multi-Node Mesh",
      labelZh: "1. 多节点通信网络",
      subEn: "HTTP /compare · TCP Sockets · IPC",
      subZh: "HTTP 比对 · TCP 选票 · 多进程",
      stroke: "#38bdf8",
    },
    {
      id: "consensus",
      x: 282,
      y: 66,
      w: 215,
      h: 78,
      labelEn: "2. BFT Consensus Lab",
      labelZh: "2. BFT 共识实验引擎",
      subEn: "2-Phase QC (3/4) · Safe Unlock",
      subZh: "两阶段投票 (3/4) · 跨轮次解锁",
      stroke: "#60a5fa",
    },
    {
      id: "storage",
      x: 528,
      y: 66,
      w: 215,
      h: 78,
      labelEn: "5. SQLite Storage",
      labelZh: "5. SQLite 持久化存储",
      subEn: "BEGIN IMMEDIATE Locks · Audit",
      subZh: "原子级锁定落盘 · 只读历史审计",
      stroke: "#818cf8",
    },
    {
      id: "cryptography",
      x: 160,
      y: 175,
      w: 460,
      h: 64,
      labelEn: "3. Cryptography Layer (SHA-256 & Ed25519 / EVM Keccak256)",
      labelZh: "3. 密码学安全层 (SHA-256 哈希 · Ed25519 数字签名 · 公钥指纹)",
      subEn: "Canonical JSON Digest · Trusted Validator Registry · Tamper Detection",
      subZh: "规范化 JSON 摘要 · 验证器受信任公钥注册表 · 篡改拦截",
      stroke: "#a78bfa",
    },
    {
      id: "contracts",
      x: 70,
      y: 326,
      w: 300,
      h: 84,
      labelEn: "4. EVM Smart Contracts",
      labelZh: "4. EVM 智能合约与 MNC 代币",
      subEn: "Solidity 0.8.28 · Anvil & Sepolia #11155111",
      subZh: "Solidity 0.8.28 · Anvil 与 Sepolia 测试网",
      stroke: "#c084fc",
    },
    {
      id: "recovery",
      x: 410,
      y: 326,
      w: 300,
      h: 84,
      labelEn: "6. Disaster Recovery",
      labelZh: "6. 节点同步与灾难恢复",
      subEn: "anvil_dumpState / loadState · 6/6 Checks",
      subZh: "状态快照导出恢复 · 6/6 完整性检查",
      stroke: "#e879f9",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-sky-400">
          {t("Interactive System Topology", "交互式系统拓扑")}
        </span>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          {t("MiniChain Technical Architecture", "MiniChain 技术架构")}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-slate-300">
          {t(
            "Select any subsystem in the interactive SVG diagram or module selector below to inspect its source files, cryptographic invariants, and execution boundaries.",
            "点击下方交互式 SVG 架构图或模块按钮，深入查看各子系统的对应源码文件、密码学不变量与运行边界。"
          )}
        </p>
      </div>

      {/* Explicit Separation Callout */}
      <div className="mt-6 rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" aria-hidden="true" />
          <div className="text-sm text-amber-100/95">
            <strong className="font-semibold text-white">
              {t(
                "Explicit Architectural Boundary (No Unclaimed Integration): ",
                "明确架构边界声明（未声称已完成底层集成）："
              )}
            </strong>
            {t(
              "MiniChain consists of two distinct engineering planes: (1) Standalone Python PoW & BFT Consensus Experiments (Ed25519 + SHA-256 + SQLite) that observe local Anvil EVM block headers via read-only JSON-RPC, and (2) Independent EVM Execution Environments (local Foundry Anvil nodes & public Ethereum Sepolia Testnet) hosting Solidity 0.8.28 smart contracts. The Python BFT engine does not drive internal block production inside Anvil.",
              "MiniChain 当前由两个明确分离的工程平面组成：(1) 独立的 Python PoW 与 BFT 共识实验系统（基于 Ed25519 + SHA-256 + SQLite），通过只读 JSON-RPC 观测本地 Anvil EVM 节点的区块头；(2) 独立的 EVM 合约执行环境（本地 Foundry Anvil 节点与 Ethereum Sepolia 公共测试网），运行 Solidity 0.8.28 智能合约。二者尚未完成底层客户端集成。"
            )}
          </div>
        </div>
      </div>

      {/* Module Selector Pills for Keyboard & Mobile Convenience */}
      <div
        className="mt-8 flex flex-wrap gap-2"
        role="group"
        aria-label={t("Select architecture subsystem", "选择架构子系统")}
      >
        {ARCHITECTURE_MODULES.map((m) => {
          const active = m.id === selectedId;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedId(m.id)}
              aria-pressed={active}
              className={`rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition ${
                active
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-sky-400"
                  : "border border-indigo-500/25 bg-obsidian-900 text-slate-300 hover:border-indigo-400/50 hover:text-white"
              }`}
            >
              {t(m.titleEn.split(" (")[0], m.titleZh)}
            </button>
          );
        })}
      </div>

      {/* Interactive SVG Diagram + Detail Inspector */}
      <div className="mt-6 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7 rounded-3xl border border-indigo-500/25 bg-obsidian-900/90 p-4 sm:p-6">
          <svg
            viewBox="0 0 780 440"
            role="img"
            aria-label={t(
              "Interactive MiniChain architecture diagram separating Standalone Python Consensus Lab and EVM Execution Plane",
              "MiniChain 交互式双平面架构图：区分独立 Python 共识实验平面与 EVM 合约执行平面"
            )}
            className="w-full h-auto select-none"
          >
            <defs>
              <linearGradient id="arch-top-bg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.14" />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.06" />
              </linearGradient>
              <linearGradient id="arch-bot-bg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.14" />
                <stop offset="100%" stopColor="#db2777" stopOpacity="0.06" />
              </linearGradient>
              <marker
                id="arrow-cyan"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
              </marker>
              <marker
                id="arrow-amber"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#fbbf24" />
              </marker>
            </defs>

            {/* Plane 1 Container */}
            <rect
              x="16"
              y="18"
              width="748"
              height="238"
              rx="16"
              fill="url(#arch-top-bg)"
              stroke="#38bdf8"
              strokeOpacity="0.35"
            />
            <text x="34" y="44" fill="#7dd3fc" fontSize="12" fontFamily="monospace" fontWeight="bold">
              {t(
                "PLANE 1 · STANDALONE PYTHON CONSENSUS & CRYPTOGRAPHY LAB",
                "平面 1 · 独立 PYTHON 共识与密码学实验系统"
              )}
            </text>

            {/* Plane 2 Container */}
            <rect
              x="16"
              y="292"
              width="748"
              height="134"
              rx="16"
              fill="url(#arch-bot-bg)"
              stroke="#c084fc"
              strokeOpacity="0.35"
            />
            <text x="34" y="315" fill="#e9d5ff" fontSize="12" fontFamily="monospace" fontWeight="bold">
              {t(
                "PLANE 2 · EVM EXECUTION PLANE (LOCAL ANVIL 31337 & PUBLIC SEPOLIA 11155111)",
                "平面 2 · EVM 执行节点平面 (本地 ANVIL 31337 与公共 SEPOLIA 11155111)"
              )}
            </text>

            {/* Separation Boundary */}
            <line
              x1="26"
              y1="274"
              x2="754"
              y2="274"
              stroke="#fbbf24"
              strokeWidth="1.5"
              strokeDasharray="6 6"
            />
            <rect
              x="175"
              y="261"
              width="430"
              height="25"
              rx="12.5"
              fill="#090e1a"
              stroke="#fbbf24"
              strokeOpacity="0.7"
            />
            <text
              x="390"
              y="277"
              textAnchor="middle"
              fill="#fde68a"
              fontSize="10.5"
              fontFamily="monospace"
            >
              {t(
                "Read-Only JSON-RPC Header Observation (eth_getBlockByNumber) · Not Integrated",
                "只读 JSON-RPC 区块头外部观测接口 (eth_getBlockByNumber) · 尚未底层集成"
              )}
            </text>

            {/* Connectors */}
            <line
              x1="251"
              y1="105"
              x2="280"
              y2="105"
              stroke="#38bdf8"
              strokeWidth="2"
              markerEnd="url(#arrow-cyan)"
            />
            <line
              x1="497"
              y1="105"
              x2="526"
              y2="105"
              stroke="#38bdf8"
              strokeWidth="2"
              markerEnd="url(#arrow-cyan)"
            />
            <line
              x1="390"
              y1="144"
              x2="390"
              y2="173"
              stroke="#818cf8"
              strokeWidth="2"
              markerEnd="url(#arrow-cyan)"
            />
            <line
              x1="370"
              y1="368"
              x2="408"
              y2="368"
              stroke="#c084fc"
              strokeWidth="2"
              markerEnd="url(#arrow-cyan)"
            />
            <line
              x1="145"
              y1="326"
              x2="145"
              y2="146"
              stroke="#fbbf24"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              markerEnd="url(#arrow-amber)"
            />

            {/* Interactive SVG Nodes */}
            {svgNodes.map((node) => {
              const isSelected = selectedId === node.id;
              return (
                <g
                  key={node.id}
                  role="button"
                  tabIndex={0}
                  aria-label={t(node.labelEn, node.labelZh)}
                  onClick={() => setSelectedId(node.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedId(node.id);
                    }
                  }}
                  className="cursor-pointer focus:outline-none"
                >
                  <rect
                    x={node.x}
                    y={node.y}
                    width={node.w}
                    height={node.h}
                    rx="12"
                    fill={isSelected ? "#172554" : "#090e1a"}
                    stroke={isSelected ? "#ffffff" : node.stroke}
                    strokeWidth={isSelected ? "2.5" : "1.5"}
                  />
                  <text
                    x={node.x + node.w / 2}
                    y={node.y + (node.h > 70 ? 33 : 27)}
                    textAnchor="middle"
                    fill="#f8fafc"
                    fontSize="12.5"
                    fontWeight="bold"
                  >
                    {t(node.labelEn, node.labelZh)}
                  </text>
                  <text
                    x={node.x + node.w / 2}
                    y={node.y + (node.h > 70 ? 55 : 46)}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="10.5"
                    fontFamily="monospace"
                  >
                    {t(node.subEn, node.subZh)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Subsystem Details */}
        <div className="lg:col-span-5 rounded-3xl border border-indigo-500/30 bg-obsidian-900/95 p-6 sm:p-8">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/30 bg-indigo-500/15 px-3 py-1 font-mono text-xs font-semibold text-indigo-200">
              <Layers className="h-3.5 w-3.5" aria-hidden="true" />
              {selected.plane === "consensus-lab"
                ? t("Plane 1 · Python Consensus Lab", "平面 1 · Python 共识实验")
                : selected.plane === "evm-plane"
                ? t("Plane 2 · EVM Execution Plane", "平面 2 · EVM 合约平面")
                : t("Cross-Plane Cryptography", "跨平面密码学基础")}
            </span>
          </div>

          <h2 className="mt-4 text-xl font-bold text-white sm:text-2xl">
            {t(selected.titleEn, selected.titleZh)}
          </h2>
          <p className="mt-1 font-mono text-xs text-sky-300">
            {t(selected.subtitleEn, selected.subtitleZh)}
          </p>

          <p className="mt-4 text-sm leading-relaxed text-slate-300">
            {t(selected.summaryEn, selected.summaryZh)}
          </p>

          <div className="mt-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {t("Key Engineering Mechanics", "核心工程机制")}
            </h3>
            <ul className="mt-2.5 space-y-2">
              {(t(selected.mechanicsEn, selected.mechanicsZh) as string[]).map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-200">
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {t("Verified Source Files", "对应工程文件")}
            </h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {selected.files.map((file) => (
                <span
                  key={file}
                  className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-obsidian-950 px-2.5 py-1 font-mono text-xs text-indigo-300"
                >
                  <FileCode className="h-3 w-3" aria-hidden="true" />
                  {file}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-amber-500/25 bg-amber-500/5 p-3.5 text-xs leading-relaxed text-amber-200">
            <strong>{t("Scope & Boundary: ", "范围与边界说明：")}</strong>
            {t(selected.boundaryNoteEn, selected.boundaryNoteZh)}
          </div>
        </div>
      </div>

      {/* Architectural Comparison Table */}
      <section aria-labelledby="plane-comparison-heading" className="mt-14">
        <h2 id="plane-comparison-heading" className="text-xl font-bold text-white sm:text-2xl">
          {t(
            "Execution Plane Comparison Matrix",
            "双平面工程边界对照表"
          )}
        </h2>
        <div
          tabIndex={0}
          role="region"
          aria-labelledby="plane-comparison-heading"
          className="table-wrapper mt-4"
        >
          <table className="data-table text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-slate-400">
                <th scope="col">{t("Dimension", "对比维度")}</th>
                <th scope="col">{t("Core PoW Prototype", "Python PoW 原型")}</th>
                <th scope="col">{t("Python BFT Consensus Lab", "Python BFT 共识实验层")}</th>
                <th scope="col">{t("EVM Smart Contract Plane", "EVM 智能合约执行层")}</th>
              </tr>
            </thead>
            <tbody className="text-slate-200">
              <tr>
                <th scope="row">{t("Runtime", "运行环境")}</th>
                <td data-label={t("Core PoW Prototype", "Python PoW 原型")}>
                  Python 3 (`core-pow/blockchain.py`)
                </td>
                <td data-label={t("Python BFT Consensus Lab", "Python BFT 共识实验层")}>
                  Python 3 + Multiprocessing + TCP/HTTP
                </td>
                <td data-label={t("EVM Smart Contract Plane", "EVM 智能合约执行层")}>
                  Foundry Anvil (`31337`) &amp; Ethereum Sepolia (`11155111`)
                </td>
              </tr>
              <tr>
                <th scope="row">{t("Cryptography", "密码学机制")}</th>
                <td data-label={t("Core PoW Prototype", "Python PoW 原型")}>
                  SHA-256 + Ed25519
                </td>
                <td data-label={t("Python BFT Consensus Lab", "Python BFT 共识实验层")}>
                  SHA-256 QC Digest + Ed25519 Registry
                </td>
                <td data-label={t("EVM Smart Contract Plane", "EVM 智能合约执行层")}>
                  Keccak-256 + secp256k1 (EVM Native)
                </td>
              </tr>
              <tr>
                <th scope="row">{t("Persistence", "状态持久化")}</th>
                <td data-label={t("Core PoW Prototype", "Python PoW 原型")}>
                  {t("In-memory chain list", "内存链结构")}
                </td>
                <td data-label={t("Python BFT Consensus Lab", "Python BFT 共识实验层")}>
                  SQLite ACID (`locks`, `rounds`, `finalized`)
                </td>
                <td data-label={t("EVM Smart Contract Plane", "EVM 智能合约执行层")}>
                  EVM World State Trie + `anvil_dumpState`
                </td>
              </tr>
              <tr>
                <th scope="row">{t("Integration Status", "集成状态")}</th>
                <td data-label={t("Core PoW Prototype", "Python PoW 原型")}>
                  {t("Standalone educational ledger", "独立极简账本实验")}
                </td>
                <td data-label={t("Python BFT Consensus Lab", "Python BFT 共识实验层")}>
                  {t("External RPC observer & standalone BFT verifier", "外部只读观测 Anvil 区块头的独立 BFT 验证器")}
                </td>
                <td data-label={t("EVM Smart Contract Plane", "EVM 智能合约执行层")}>
                  {t("Live ERC-20 MNC contract on Sepolia", "Sepolia 真实链上运行 MNC 合约")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
