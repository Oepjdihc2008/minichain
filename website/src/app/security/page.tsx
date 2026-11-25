"use client";

import React from "react";
import { AlertTriangle, CheckCircle2, Lock, ShieldAlert, Terminal } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { VERIFIED_TEST_SUITES } from "@/lib/projectData";

export default function SecurityPage() {
  const { t } = useLanguage();

  const knownLimitations = [
    {
      titleEn: "No Independent External Security Audit",
      titleZh: "未经独立第三方商业安全审计",
      descEn:
        "MiniChain has NOT been audited by an external smart contract or cryptography security firm. All test suites are internal automated unit, property/fuzz, and protocol simulation checks.",
      descZh:
        "MiniChain 尚未接受外部独立专业安全机构审计。当前所有安全与正确性数据均来自项目内部自动化单元测试、模糊测试与协议模拟检查。",
    },
    {
      titleEn: "Consensus Lab & EVM Node Decoupling",
      titleZh: "Python 共识实验与 Anvil EVM 节点尚未底层集成",
      descEn:
        "Python BFT consensus modules validate vote quorums, cross-round locks, and certificates externally over JSON-RPC headers; they do not enforce block validity inside Anvil's internal EVM state machine.",
      descZh:
        "Python BFT 共识模块在外部对区块头进行签名投票、跨轮次锁定与证书校验，尚未作为底层共识引擎接入 Anvil EVM 内部状态转换。",
    },
    {
      titleEn: "Minimal EIP-20 Allowance Pattern",
      titleZh: "标准极简 EIP-20 授权竞态特性",
      descEn:
        "MNC.sol implements clean baseline EIP-20 approve/transferFrom without EIP-2612 permit or non-standard allowance helpers. Users on testnets should set allowance to 0 before changing non-zero allowances.",
      descZh:
        "MNC.sol 采用标准极简 EIP-20 实现，未引入 EIP-2612 permit 扩展；与标准 ERC-20 一致，修改非零授权额度前建议先置零。",
    },
    {
      titleEn: "Localhost Loopback Transport Scope",
      titleZh: "本地回环网络传输假设",
      descEn:
        "Python P2P and TCP consensus experiments bind exclusively to 127.0.0.1 with 8 KB packet caps for local multi-process fault research; they do not include production WAN DoS rate-limiting or encrypted Noise/TLS handshakes.",
      descZh:
        "Python 多节点通信实验默认仅绑定 127.0.0.1 本地回环地址并限制 8 KB 数据包大小，未包含面向公网广域环境的加密传输握手与抗 DDoS 限流。",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-sky-400">
          {t("Verification & Threat Model", "验证证据与威胁模型")}
        </span>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          {t("Security & Reproducible Test Evidence", "安全报告与可复现测试结果")}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-slate-300">
          {t(
            "Every test count reported below was executed directly against the repository's Solidity 0.8.28 contracts and Python 3 consensus modules.",
            "下方展示的每一项测试数据均基于仓库中的 Solidity 0.8.28 智能合约与 Python 3 共识模块实测核对，支持开发者在本地一键复现。"
          )}
        </p>
      </div>

      {/* Mandatory Non-Audit Disclaimer */}
      <div className="mt-6 rounded-2xl border border-rose-500/35 bg-rose-500/10 p-5">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" aria-hidden="true" />
          <div className="text-sm leading-relaxed text-rose-100">
            <strong className="font-bold text-white">
              {t("Audit Status Disclosure: ", "安全审计状态声明：")}
            </strong>
            {t(
              "MiniChain and the MNC ERC-20 contract have NOT undergone an independent professional security audit. Never use experimental code with real funds or deploy un-audited contracts to mainnet.",
              "MiniChain 及 MNC 智能合约尚未通过任何独立专业安全机构审计。请勿将本实验代码用于管理真实资金或直接用于主网生产环境。"
            )}
          </div>
        </div>
      </div>

      {/* Headline Verification Summary */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-indigo-500/25 bg-obsidian-900/90 p-5">
          <p className="text-xs font-mono text-slate-400">FOUNDRY SUITE</p>
          <p className="mt-1 font-mono text-2xl font-extrabold text-emerald-400">20 / 20 PASS</p>
          <p className="mt-1 text-xs text-slate-300">
            {t("All 4 Solidity test contracts passing", "全部 4 个智能合约测试集通过")}
          </p>
        </div>
        <div className="rounded-2xl border border-indigo-500/25 bg-obsidian-900/90 p-5">
          <p className="text-xs font-mono text-slate-400">MNC DEDICATED</p>
          <p className="mt-1 font-mono text-2xl font-extrabold text-emerald-400">12 / 12 PASS</p>
          <p className="mt-1 text-xs text-slate-300">
            {t("MNCTest (7) + MNCFuzzTest (5)", "MNCTest (7项) + MNCFuzzTest (5项)")}
          </p>
        </div>
        <div className="rounded-2xl border border-indigo-500/25 bg-obsidian-900/90 p-5">
          <p className="text-xs font-mono text-slate-400">PROPERTY FUZZING</p>
          <p className="mt-1 font-mono text-2xl font-extrabold text-sky-400">30,000 RUNS</p>
          <p className="mt-1 text-xs text-slate-300">
            {t("3 invariants × 10,000 random inputs", "3 项核心不变量 × 10,000 次随机输入")}
          </p>
        </div>
        <div className="rounded-2xl border border-indigo-500/25 bg-obsidian-900/90 p-5">
          <p className="text-xs font-mono text-slate-400">DISASTER RECOVERY</p>
          <p className="mt-1 font-mono text-2xl font-extrabold text-violet-400">6 / 6 PASS</p>
          <p className="mt-1 text-xs text-slate-300">
            {t("State snapshot & post-restore parity", "状态快照恢复与字节码/余额校验")}
          </p>
        </div>
      </div>

      {/* Complete Test Coverage Table */}
      <section aria-labelledby="test-matrix-heading" className="mt-12">
        <h2 id="test-matrix-heading" className="text-xl font-bold text-white sm:text-2xl">
          {t("Complete Verified Test Suite Matrix", "完整实测覆盖矩阵")}
        </h2>
        <div
          tabIndex={0}
          role="region"
          aria-labelledby="test-matrix-heading"
          className="table-wrapper mt-4"
        >
          <table className="data-table text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-slate-400">
                <th scope="col">{t("Suite / Lab", "测试模块")}</th>
                <th scope="col">{t("Plane", "所属平面")}</th>
                <th scope="col">{t("Result", "实测结果")}</th>
                <th scope="col">{t("Verified Coverage Scope", "测试覆盖内容")}</th>
              </tr>
            </thead>
            <tbody className="text-slate-200">
              {VERIFIED_TEST_SUITES.map((suite) => (
                <tr key={suite.id}>
                  <th scope="row">
                    <div className="font-semibold text-white">{suite.module}</div>
                    <div className="font-mono text-xs font-normal text-indigo-300">{suite.file}</div>
                  </th>
                  <td data-label={t("Plane", "所属平面")}>
                    <span className="rounded-md border border-slate-700 bg-obsidian-950 px-2 py-0.5 font-mono text-xs text-slate-300">
                      {suite.plane}
                    </span>
                  </td>
                  <td data-label={t("Result", "实测结果")}>
                    <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                      {suite.passed}/{suite.total} PASS
                      {suite.fuzzRuns ? ` (${suite.fuzzRuns.toLocaleString("en-US")} runs)` : ""}
                    </span>
                  </td>
                  <td
                    data-label={t("Coverage", "覆盖范围")}
                    className="text-xs leading-relaxed text-slate-300"
                  >
                    {t(suite.highlightsEn, suite.highlightsZh)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Known Limitations & Secret Hygiene */}
      <div className="mt-14 grid gap-8 lg:grid-cols-12">
        <section aria-labelledby="limitations-heading" className="lg:col-span-7">
          <h2 id="limitations-heading" className="text-xl font-bold text-white sm:text-2xl">
            {t("Known Limitations & Engineering Boundaries", "已知限制与安全边界")}
          </h2>
          <div className="mt-4 space-y-4">
            {knownLimitations.map((item) => (
              <div
                key={item.titleEn}
                className="rounded-2xl border border-slate-800 bg-obsidian-900/85 p-5"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400" aria-hidden="true" />
                  <h3 className="text-sm font-bold text-white">
                    {t(item.titleEn, item.titleZh)}
                  </h3>
                </div>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-300">
                  {t(item.descEn, item.descZh)}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="repro-commands-heading" className="lg:col-span-5">
          <h2 id="repro-commands-heading" className="text-xl font-bold text-white sm:text-2xl">
            {t("Reproduce Locally", "本地一键复现命令")}
          </h2>
          <div className="mt-4 rounded-2xl border border-indigo-500/25 bg-obsidian-950 p-5">
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-300">
              <Terminal className="h-4 w-4" aria-hidden="true" />
              <span>VERIFY ALL CLAIMS</span>
            </div>
            <pre className="mt-3 overflow-x-auto font-mono text-xs leading-relaxed text-slate-200">
              <code>{`# 1. Smart Contract Unit & Fuzz Suite (20/20 + 30k runs)
cd contracts
forge test -vv
forge test --match-contract MNCFuzzTest --fuzz-runs 10000

# 2. Core SHA-256 PoW + Ed25519 Tamper Test
python3 core-pow/blockchain.py

# 3. Standalone BFT, Locking, Unlock & Finality Labs
cd consensus-lab
python3 bft_test.py
python3 fault_test.py
python3 cross_round_test.py
python3 locking_test.py
python3 leader_test.py
python3 unlock_test.py
python3 finality_test.py

# 4. 6/6 Ephemeral Anvil Disaster Recovery Check
python3 recovery_check.py`}</code>
            </pre>

            <div className="mt-5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4 text-xs text-emerald-200">
              <div className="flex items-center gap-2 font-bold text-white">
                <Lock className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                <span>{t("Repository Secret Hygiene", "发布目录敏感信息清零检查")}</span>
              </div>
              <p className="mt-1.5 leading-relaxed">
                {t(
                  "Zero private keys, mnemonics, keystores, .key files, .env files, or unchecked blockchain backups are included in the public repository.",
                  "公开仓库已严格剔除所有私钥、助记词、Keystore、Validator .key 文件、.env 及未经审查的区块链状态备份。"
                )}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
