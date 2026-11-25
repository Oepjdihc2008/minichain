"use client";

import React, { useEffect, useRef, useState } from "react";
import { BookOpen, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { MncLogo } from "@/components/MncLogo";
import {
  MNC_CONTRACT_ADDRESS,
  MNC_DEPLOYMENT_BLOCK,
  MNC_GENESIS_TX_HASH,
} from "@/lib/sepoliaRpc";

interface DocSection {
  id: string;
  tabEn: string;
  tabZh: string;
  titleEn: string;
  titleZh: string;
  summaryEn: string;
  summaryZh: string;
  blocks: Array<{
    headingEn: string;
    headingZh: string;
    bodyEn: string[];
    bodyZh: string[];
    code?: string;
  }>;
}

const DOC_SECTIONS: DocSection[] = [
  {
    id: "whitepaper",
    tabEn: "Whitepaper",
    tabZh: "白皮书",
    titleEn: "MiniChain Technical Whitepaper (v1.0)",
    titleZh: "MiniChain 技术白皮书 (v1.0)",
    summaryEn:
      "A transparent, first-principles exploration of cryptographic ledgers, Byzantine Fault Tolerant quorum safety, durable validator locking, and verifiable EVM smart contracts.",
    summaryZh:
      "以第一性原理探索密码学账本、拜占庭容错法定人数安全性、持久化跨轮次锁定与可验证 EVM 智能合约的开源工程白皮书。",
    blocks: [
      {
        headingEn: "1. Abstract & Motivation",
        headingZh: "1. 摘要与立项背景",
        bodyEn: [
          "Production blockchain clients contain hundreds of thousands of lines of networking, serialization, consensus, and virtual-machine optimization code, making it difficult for engineers and students to trace core safety invariants end-to-end.",
          "MiniChain decomposes blockchain engineering into focused, self-contained, executable modules: (1) a minimal SHA-256 Proof-of-Work + Ed25519 signed ledger, (2) a standalone Python BFT consensus laboratory implementing two-phase voting, SQLite ACID lock persistence, and Proof-of-Lock-Change (PoLC) safe unlocking, and (3) zero-dependency Solidity 0.8.28 smart contracts verified with 30,000 randomized fuzz runs and deployed on Ethereum Sepolia.",
        ],
        bodyZh: [
          "工业级区块链客户端往往包含数十万行网络传输、状态树优化与虚拟机代码，使开发者难以直观追踪最核心的分布式安全不变量。",
          "MiniChain 将区块链核心机制拆解为可独立运行、可严格验证的最小工程闭环：(1) SHA-256 工作量证明与 Ed25519 数字签名原型；(2) 独立的 Python BFT 共识实验室（涵盖两阶段投票、SQLite 原子锁存储与高轮次 QC 安全解锁）；(3) 零外部依赖的 Solidity 0.8.28 智能合约，通过 30,000 次模糊测试并公开部署于 Ethereum Sepolia。",
        ],
      },
      {
        headingEn: "2. Non-Financial Experimental Token Model (MNC)",
        headingZh: "2. 非金融属性实验代币模型 (MNC)",
        bodyEn: [
          `MiniChain Coin (MNC) is a fixed-supply (1,000,000 MNC, 18 decimals) ERC-20 smart contract deployed on Ethereum Sepolia Testnet at ${MNC_CONTRACT_ADDRESS} (Block #${MNC_DEPLOYMENT_BLOCK}, Tx ${MNC_GENESIS_TX_HASH}).`,
          "MNC exists strictly to test ERC-20 state conservation, allowance accounting, read-only RPC indexing, and Anvil state recovery. MNC has zero monetary value, no token sale, no liquidity pool, and no investment utility.",
        ],
        bodyZh: [
          `MiniChain Coin (MNC) 是部署于 Ethereum Sepolia 测试网 (${MNC_CONTRACT_ADDRESS}，区块 #${MNC_DEPLOYMENT_BLOCK}) 的固定供应量（1,000,000 MNC，18 位精度）ERC-20 智能合约。`,
          "MNC 仅用于验证代币总供应量守恒、授权额度状态机、只读链上索引与灾难恢复机制，不具备任何货币价值，绝不设立资金池或进行任何代币募资。",
        ],
      },
    ],
  },
  {
    id: "architecture",
    tabEn: "Technical Architecture",
    tabZh: "技术架构",
    titleEn: "Dual-Plane System Architecture",
    titleZh: "双平面系统技术架构",
    summaryEn:
      "Clear separation between the standalone Python consensus verification lab and the Foundry Anvil / Ethereum Sepolia EVM execution environments.",
    summaryZh:
      "严格区分独立 Python 共识验证实验平面与 Foundry Anvil / Ethereum Sepolia EVM 合约执行平面。",
    blocks: [
      {
        headingEn: "Plane A: Standalone Python Consensus & Storage Lab",
        headingZh: "平面 A：独立 Python 共识与持久化实验层",
        bodyEn: [
          "Validators A, B, C, and D run in isolated OS processes (`mp.get_context('spawn')`), authenticate via Ed25519 keypairs pinned in a SHA-256 fingerprint registry, and exchange votes over TCP sockets (`127.0.0.1`) or verify certificates in deterministic state-machine labs.",
          "Quorum math enforces n = 4, q = 3, f = 1: any two quorums of size 3 intersect in at least 2 validators, ensuring at least 1 honest validator bridges rounds and refuses conflicting Precommits.",
        ],
        bodyZh: [
          "验证器节点 A、B、C、D 在操作系统级独立子进程 (`spawn`) 中运行，使用 Ed25519 密钥对签名选票，并通过 TCP 套接字或状态机模拟器完成法定人数聚合。",
          "法定人数参数遵循 n = 4, q = 3, f = 1：任意两个 3 票法定人数集合至少相交于 2 个节点，保证即使存在 1 个拜占庭恶意节点，交集中至少有 1 个诚实节点拒绝冲突签名。",
        ],
      },
      {
        headingEn: "Plane B: EVM Smart Contract Execution & Boundary",
        headingZh: "平面 B：EVM 智能合约执行层及耦合边界说明",
        bodyEn: [
          "Smart contracts (`MiniChain.sol`, `MiniChainV2.sol`, `MNC.sol`) execute on local Anvil nodes (`Chain ID 31337`) and public Ethereum Sepolia (`Chain ID 11155111`).",
          "Architectural Honesty: Python validator scripts query Anvil via read-only JSON-RPC (`eth_chainId`, `eth_getBlockByNumber`) to observe chain heads; they are NOT integrated into Anvil's internal consensus/mining loop.",
        ],
        bodyZh: [
          "智能合约 (`MiniChain.sol`、`MiniChainV2.sol`、`MNC.sol`) 运行在本地 Foundry Anvil 节点 (`Chain ID 31337`) 与 Ethereum Sepolia 测试网 (`Chain ID 11155111`)。",
          "工程边界说明：Python 共识实验脚本通过只读 JSON-RPC (`eth_chainId`、`eth_getBlockByNumber`) 观测本地 Anvil 节点区块头，尚未与 Anvil 内部出块引擎合并集成。",
        ],
      },
    ],
  },
  {
    id: "api",
    tabEn: "API Documentation",
    tabZh: "API 接口文档",
    titleEn: "Smart Contract ABI & Local Lab Protocol Reference",
    titleZh: "智能合约接口与实验协议 API 文档",
    summaryEn:
      "Function signatures, JSON-RPC calls, P2P HTTP endpoints, and SQLite persistence schemas.",
    summaryZh:
      "MNC 智能合约 ABI 选择器、JSON-RPC 调用格式、P2P 对等接口与 SQLite 表结构说明。",
    blocks: [
      {
        headingEn: "1. MNC (ERC-20) Solidity Interface",
        headingZh: "1. MNC (ERC-20) 智能合约公开接口",
        bodyEn: [
          "Contract Address (Sepolia): 0x32C80Bb0fd51D32c31b52795a181042BF90E2Ee6 · Compiler: Solc ^0.8.28.",
        ],
        bodyZh: [
          "Sepolia 合约地址：0x32C80Bb0fd51D32c31b52795a181042BF90E2Ee6 · 编译器版本：Solc ^0.8.28。",
        ],
        code: `function name() external pure returns (string memory);        // 0x06fdde03 -> "MiniChain Coin"
function symbol() external pure returns (string memory);      // 0x95d89b41 -> "MNC"
function decimals() external pure returns (uint8);            // 0x313ce567 -> 18
function totalSupply() external pure returns (uint256);       // 0x18160ddd -> 1_000_000 * 10**18
function balanceOf(address account) external view returns (uint256); // 0x70a08231
function allowance(address owner, address spender) external view returns (uint256); // 0xdd62ed3e
function transfer(address to, uint256 amount) external returns (bool); // 0xa9059cbb
function approve(address spender, uint256 amount) external returns (bool); // 0x095ea7b3
function transferFrom(address from, address to, uint256 amount) external returns (bool); // 0x23b872dd`,
      },
      {
        headingEn: "2. Python P2P HTTP & SQLite Schemas",
        headingZh: "2. Python P2P HTTP 接口与 SQLite 表结构",
        bodyEn: [
          "Local peer observer servers (`consensus-lab/p2p.py`) expose GET `/head` and GET `/compare` on loopback ports 9101/9102. SQLite schemas (`locks`, `rounds`, `finalized`) persist consensus state.",
        ],
        bodyZh: [
          "本地对等观测节点 (`consensus-lab/p2p.py`) 在 9101/9102 端口提供 GET `/head` 与 GET `/compare` 只读接口；SQLite 包含 `locks`、`rounds` 与 `finalized` 三张核心表。",
        ],
        code: `-- SQLite Validator Lock Table (consensus-lab/locking_test.py)
CREATE TABLE IF NOT EXISTS locks (
    validator TEXT,
    height INTEGER,
    round_id INTEGER NOT NULL,
    block_hash TEXT NOT NULL,
    PRIMARY KEY (validator, height)
);

-- SQLite Finalized Certificate Registry (consensus-lab/integrated_finality.py)
CREATE TABLE IF NOT EXISTS finalized (
    height INTEGER PRIMARY KEY,
    hash TEXT NOT NULL,
    certificate TEXT NOT NULL
);`,
      },
    ],
  },
  {
    id: "dev-guide",
    tabEn: "Developer Guide",
    tabZh: "开发者指南",
    titleEn: "Local Setup & Developer Workflow",
    titleZh: "本地环境搭建与开发者指南",
    summaryEn:
      "Run every Python consensus simulation, Foundry smart contract test, and website build in under 3 minutes.",
    summaryZh:
      "3 分钟内在本地完整运行 Python 共识实验、Foundry 智能合约测试与官方网站构建。",
    blocks: [
      {
        headingEn: "Prerequisites & Quickstart",
        headingZh: "前置依赖与快速启动",
        bodyEn: [
          "Requires Python 3.9+ (with `cryptography` package), Foundry (`forge`, `cast`, `anvil`), and Node.js 20+ for the static website.",
        ],
        bodyZh: [
          "需安装 Python 3.9+（含 `cryptography` 库）、Foundry 工具链 (`forge`、`cast`、`anvil`) 以及 Node.js 20+（用于构建静态官网）。",
        ],
        code: `# Clone repository
git clone https://github.com/<your-org-or-username>/minichain.git
cd minichain

# Run Solidity tests + 30,000 MNC fuzz runs
cd contracts && forge test && forge test --match-contract MNCFuzzTest --fuzz-runs 10000

# Run Python consensus & disaster recovery suites
cd ../consensus-lab
pip install cryptography
python3 bft_test.py && python3 locking_test.py && python3 unlock_test.py && python3 recovery_check.py

# Build static website & MiniScan Explorer
cd ../website && npm install && npm run build`,
      },
    ],
  },
  {
    id: "security-report",
    tabEn: "Security Report",
    tabZh: "安全报告",
    titleEn: "Internal Engineering Security Report",
    titleZh: "内部工程安全评估报告",
    summaryEn:
      "Cryptographic controls, smart contract invariants, secret management rules, and threat boundaries.",
    summaryZh:
      "密码学控制措施、智能合约安全不变量、密钥隔离策略与已知威胁边界。",
    blocks: [
      {
        headingEn: "Key Security Controls & Disclaimers",
        headingZh: "核心安全机制与免责声明",
        bodyEn: [
          "1. Smart Contract Simplicity: `MNC.sol` (101 LOC) avoids complex inheritance trees, upgradeable proxies, `delegatecall`, external callbacks, or mint/burn privileges, minimizing attack surface.",
          "2. Atomic Crash-Safe Locking: `LockStore.precommit()` executes `BEGIN IMMEDIATE` in SQLite and commits the `(validator, height)` lock to disk BEFORE generating the Ed25519 signature.",
          "3. Un-Audited Status: MiniChain has NOT undergone an independent commercial security audit and must never be used to custody real-world value.",
        ],
        bodyZh: [
          "1. 合约极简化设计：`MNC.sol`（仅 101 行）不引入复杂继承链、可升级代理、`delegatecall`、外部回调或增发权限，最大限度收敛攻击面。",
          "2. 崩溃安全锁定：`LockStore.precommit()` 在生成 Ed25519 签名前，通过 SQLite `BEGIN IMMEDIATE` 事务将锁定记录落盘。",
          "3. 未审计声明：本项目未经外部独立专业安全机构审计，严禁用于托管真实资产。",
        ],
      },
    ],
  },
  {
    id: "test-report",
    tabEn: "Test Report",
    tabZh: "测试报告",
    titleEn: "Verified Execution & Fuzz Test Report",
    titleZh: "完整自动化与随机模糊测试报告",
    summaryEn:
      "Summary of Foundry gas benchmarks, 30,000 fuzz executions, 6/6 disaster recovery checks, and Python BFT labs.",
    summaryZh:
      "汇总 Foundry Gas 基准数据、30,000 次随机模糊测试、6/6 灾难恢复检查与 Python BFT 共识实验结果。",
    blocks: [
      {
        headingEn: "Verified Benchmark Output",
        headingZh: "实测基准输出记录",
        bodyEn: [
          "All 4 Foundry test suites (20/20 tests) complete in < 20ms; 30,000 randomized fuzz executions across `MNCFuzzTest` pass in ~93ms with zero invariant violations.",
        ],
        bodyZh: [
          "全部 4 个 Foundry 测试集（20/20 测试用例）在 20ms 内全部通过；`MNCFuzzTest` 的 30,000 次随机输入模糊测试在约 93ms 内全部通过，零不变量违背。",
        ],
        code: `Ran 4 test suites: 20 tests passed, 0 failed, 0 skipped
- MNCTest: 7/7 passed (transfer gas: 61,649 | transferFrom gas: 119,708)
- MNCFuzzTest: 5/5 passed (3 fuzz invariants × 10,000 runs = 30,000 runs)
- MiniChainTest: 5/5 passed
- MiniChainV2Test: 3/3 passed (unauthorized external call rejected)

Python Consensus & Recovery Verification:
- bft_test.py: 7/7 PASS           - fault_test.py: 8/8 PASS
- cross_round_test.py: 7/7 PASS   - locking_test.py: 9/9 PASS
- leader_test.py: 6/6 PASS        - unlock_test.py: 13/13 PASS
- finality_test.py: 10/10 PASS    - recovery_check.py: 6/6 PASS`,
      },
    ],
  },
  {
    id: "roadmap",
    tabEn: "Roadmap",
    tabZh: "发展路线图",
    titleEn: "Technical Research Roadmap",
    titleZh: "开源技术研究路线图",
    summaryEn:
      "Purely engineering-focused milestones for open-source contributors—zero financial or price milestones.",
    summaryZh:
      "纯工程导向的开源技术演进计划，专注于分布式系统与形式化验证，不含任何代币价格或商业承诺。",
    blocks: [
      {
        headingEn: "Completed & Upcoming Engineering Phases",
        headingZh: "已完成阶段与后续研发方向",
        bodyEn: [
          "Phase 1 (Completed): Minimal SHA-256 PoW + Ed25519 ledger (`core-pow/blockchain.py`) and local Anvil EVM contracts (`MiniChain`, `MiniChainV2`, `MNC`).",
          "Phase 2 (Completed): Multi-process validator voting, 4-node Two-Phase Prevote/Precommit QCs, SQLite lock/finality persistence, PoLC safe unlock model, 30,000 fuzz runs, 6/6 disaster recovery, and Ethereum Sepolia deployment.",
          "Phase 3 (Open Research): Asynchronous network delay/partition simulator with deterministic seed replay and timeout-driven view-change pacemakers.",
          "Phase 4 (Open Research): Engine API / ABCI-style bridge prototype connecting the Python BFT finality engine to a custom minimal execution state machine, plus Halmos/Certora symbolic verification specs for Solidity contracts.",
        ],
        bodyZh: [
          "第一阶段（已完成）：极简 SHA-256 PoW + Ed25519 账本原型与 Solidity 智能合约开发。",
          "第二阶段（已完成）：多进程验证器通信、4 节点两阶段 Prevote/Precommit 证书、SQLite 锁与最终性存储、PoLC 安全解锁、30,000 次模糊测试、6/6 灾难恢复及 Ethereum Sepolia 部署。",
          "第三阶段（规划研究）：支持确定性随机种子的异步网络延迟/分区模拟器，以及基于超时的自动视图切换 Pacemaker。",
          "第四阶段（规划研究）：探索类 ABCI / Engine API 桥接实验，将 BFT 共识层与极简状态执行机真正打通，并为智能合约引入符号执行形式化验证。",
        ],
      },
    ],
  },
];

export default function DocsPage() {
  const { t } = useLanguage();
  const [selectedTab, setSelectedTab] = useState<string>("whitepaper");
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Sync hidden="until-found" for native browser Find-in-Page (modern-web-guidance: tabs)
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    for (const sec of DOC_SECTIONS) {
      const panel = panelRefs.current[sec.id];
      if (!panel) continue;
      if (sec.id === selectedTab) {
        panel.removeAttribute("hidden");
      } else {
        panel.setAttribute("hidden", "until-found");
      }

      const onBeforeMatch = () => setSelectedTab(sec.id);
      panel.addEventListener("beforematch", onBeforeMatch);
      cleanups.push(() => panel.removeEventListener("beforematch", onBeforeMatch));
    }
    return () => cleanups.forEach((fn) => fn());
  }, [selectedTab]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIdx: number | null = null;
    if (e.key === "ArrowRight") {
      nextIdx = (index + 1) % DOC_SECTIONS.length;
    } else if (e.key === "ArrowLeft") {
      nextIdx = (index - 1 + DOC_SECTIONS.length) % DOC_SECTIONS.length;
    } else if (e.key === "Home") {
      nextIdx = 0;
    } else if (e.key === "End") {
      nextIdx = DOC_SECTIONS.length - 1;
    }

    if (nextIdx !== null) {
      e.preventDefault();
      const nextSec = DOC_SECTIONS[nextIdx];
      setSelectedTab(nextSec.id);
      const btn = tabRefs.current[nextSec.id];
      btn?.focus();
      btn?.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-sky-400">
          {t("Engineering Documentation Suite", "完整技术文档中心")}
        </span>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          {t("MiniChain Documentation", "MiniChain 技术文档")}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-slate-300">
          {t(
            "Complete reference documentation covering the Whitepaper, Dual-Plane Architecture, API Reference, Developer Guide, Security Report, Test Report, and Engineering Roadmap.",
            "涵盖白皮书、技术架构、API 接口规范、开发者指南、安全报告、测试报告与研发路线图七大核心文档。"
          )}
        </p>
      </div>

      {/* Single-Row Scrollable Accessible Tablist */}
      <div className="mt-8">
        <div
          role="tablist"
          aria-label={t("MiniChain Documentation Sections", "MiniChain 技术文档章节")}
          className="tablist-scroller"
        >
          {DOC_SECTIONS.map((sec, idx) => {
            const isSelected = sec.id === selectedTab;
            return (
              <button
                key={sec.id}
                ref={(el) => {
                  tabRefs.current[sec.id] = el;
                }}
                id={`doc-tab-${sec.id}`}
                role="tab"
                type="button"
                aria-selected={isSelected}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setSelectedTab(sec.id)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className="tab-btn text-sm font-medium"
              >
                {t(sec.tabEn, sec.tabZh)}
              </button>
            );
          })}
        </div>

        {/* Tab Panels (No padding/border on outer panel so hidden="until-found" renders zero height) */}
        <div className="mt-6">
          {DOC_SECTIONS.map((sec) => {
            const isSelected = sec.id === selectedTab;
            return (
              <div
                key={sec.id}
                ref={(el) => {
                  panelRefs.current[sec.id] = el;
                }}
                role="tabpanel"
                aria-labelledby={`doc-tab-${sec.id}`}
                tabIndex={isSelected ? 0 : undefined}
                hidden={!isSelected ? true : undefined}
              >
                <div className="rounded-3xl border border-indigo-500/25 bg-obsidian-900/90 p-6 sm:p-10">
                  <div className="flex items-start gap-4">
                    {sec.id === "whitepaper" && (
                      <MncLogo
                        className="h-14 w-14 shrink-0"
                        ariaLabel="MiniChain Official Brand Emblem"
                      />
                    )}
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono text-indigo-300">
                        <BookOpen className="h-4 w-4" aria-hidden="true" />
                        <span>MINICHAIN DOCS // {sec.id.toUpperCase()}</span>
                      </div>
                      <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                        {t(sec.titleEn, sec.titleZh)}
                      </h2>
                      <p className="mt-2 text-sm sm:text-base text-slate-300">
                        {t(sec.summaryEn, sec.summaryZh)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 space-y-8 border-t border-slate-800 pt-8">
                    {sec.blocks.map((b) => (
                      <section key={b.headingEn}>
                        <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                          <CheckCircle2
                            className="h-4 w-4 shrink-0 text-sky-400"
                            aria-hidden="true"
                          />
                          <span>{t(b.headingEn, b.headingZh)}</span>
                        </h3>
                        <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-300">
                          {(t(b.bodyEn, b.bodyZh) as string[]).map((para, i) => (
                            <p key={i}>{para}</p>
                          ))}
                        </div>
                        {b.code && (
                          <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-obsidian-950 p-4 font-mono text-xs leading-relaxed text-indigo-200">
                            <code>{b.code}</code>
                          </pre>
                        )}
                      </section>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
