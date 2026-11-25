"use client";

import React, { useState } from "react";
import { CheckCircle2, Code2, ExternalLink, FolderGit2, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { CopyButton } from "@/components/CopyButton";
import { OPEN_SOURCE_PREVIEWS } from "@/lib/projectData";
import { SEPOLIA_ETHERSCAN_TOKEN } from "@/lib/sepoliaRpc";

export default function OpenSourcePage() {
  const { t } = useLanguage();
  const [activeFileId, setActiveFileId] = useState(OPEN_SOURCE_PREVIEWS[0].id);

  const activeFile =
    OPEN_SOURCE_PREVIEWS.find((f) => f.id === activeFileId) || OPEN_SOURCE_PREVIEWS[0];

  const hygieneChecks = [
    {
      en: "Zero wallet private keys, mnemonics, or keystore JSONs",
      zh: "零钱包私钥、零助记词、零 Keystore 文件",
    },
    {
      en: "Zero pre-generated validator .key files (generated locally at runtime with 0600 permissions)",
      zh: "零预生成验证器 .key 私钥文件（仅在本地运行时以 0600 权限临时生成）",
    },
    {
      en: "Zero .env files, RPC API secrets, or deployment credentials",
      zh: "零 .env 环境变量、零 API Secret 或部署凭证",
    },
    {
      en: "Zero unchecked local SQLite databases or Anvil state dumps",
      zh: "零未经审查的本地 SQLite 数据库或区块链状态快照备份",
    },
    {
      en: "Zero creator personal identifiable information (PII) in code or git history",
      zh: "源码与 Git 提交记录中零个人身份隐私信息泄露",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div className="max-w-3xl">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-sky-400">
            MIT Licensed · Security-Sanitized Repository
          </span>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {t("Open Source Code & Repository Hub", "开源代码与 GitHub 仓库入口")}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-300">
            {t(
              "Inspect MiniChain's security-checked Solidity smart contracts and Python BFT consensus modules directly below, or clone the MIT-licensed monorepo to run and extend every experiment.",
              "在线审阅经过严格安全脱敏检查的 Solidity 智能合约与 Python BFT 共识源码，或克隆 MIT 开源协议单仓工程参与技术共建。"
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href="https://github.com/Oepjdihc2008/minichain"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            <FolderGit2 className="h-4 w-4" aria-hidden="true" />
            <span>{t("Open GitHub Repository", "访问 GitHub 开源仓库")}</span>
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
          <a
            href={SEPOLIA_ETHERSCAN_TOKEN}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-700 bg-obsidian-900 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:border-slate-500 hover:text-white"
          >
            <span>Sepolia Contract</span>
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Repository Directory Layout + Pre-Publish Security Check */}
      <div id="repo-entry" className="mt-10 grid gap-8 lg:grid-cols-12">
        <section
          aria-labelledby="repo-structure-heading"
          className="lg:col-span-6 rounded-2xl border border-indigo-500/25 bg-obsidian-900/90 p-6"
        >
          <div className="flex items-center justify-between gap-2">
            <h2 id="repo-structure-heading" className="text-lg font-bold text-white">
              {t("Sanitized Monorepo Structure", "开源发布目录结构")}
            </h2>
            <span className="rounded-full border border-indigo-400/30 bg-indigo-500/15 px-2.5 py-0.5 font-mono text-xs text-indigo-200">
              MIT License
            </span>
          </div>
          <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-obsidian-950 p-4 font-mono text-xs leading-relaxed text-slate-200">
            <code>{`minichain/
├── core-pow/
│   └── blockchain.py          # SHA-256 PoW + Ed25519 ledger
├── consensus-lab/
│   ├── bft_test.py            # Quorum intersection proofs (7/7)
│   ├── two_phase.py           # Prevote -> Precommit QC lab (5/5)
│   ├── cross_round_test.py    # 81 lock-state deadlock analysis (7/7)
│   ├── locking_test.py        # SQLite BEGIN IMMEDIATE locks (9/9)
│   ├── unlock_test.py         # PoLC higher-round QC unlock (13/13)
│   ├── leader_test.py         # Proposer rotation & view change (6/6)
│   ├── finality_test.py       # SQLite per-height finality (10/10)
│   └── recovery_check.py      # Anvil state disaster recovery (6/6)
├── contracts/
│   ├── foundry.toml           # Solc 0.8.28 configuration
│   ├── src/                   # MNC.sol, MiniChain.sol, MiniChainV2.sol
│   └── test/                  # 20 unit & 30,000-run fuzz tests
├── docs/                      # Whitepaper, API, Security & Test Reports
├── website/                   # Next.js + TypeScript + Tailwind static site
└── .github/workflows/         # Automated CI & GitHub Pages deployment`}</code>
          </pre>
        </section>

        <section
          aria-labelledby="sanitization-heading"
          className="lg:col-span-6 rounded-2xl border border-emerald-500/25 bg-obsidian-900/90 p-6"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" aria-hidden="true" />
            <h2 id="sanitization-heading" className="text-lg font-bold text-white">
              {t("Pre-Release Security Audit Checklist", "开源目录敏感信息安全核查")}
            </h2>
          </div>
          <p className="mt-2 text-sm text-slate-300">
            {t(
              "Every file in the public release tree has been scanned for secrets, validator keys, database dumps, and personal metadata prior to publication.",
              "整个公开发布目录已完成全量自动化扫描，确保不包含任何私钥、验证器密钥文件、未经检查的备份及个人隐私数据。"
            )}
          </p>
          <ul className="mt-4 space-y-2.5">
            {hygieneChecks.map((item) => (
              <li
                key={item.en}
                className="flex items-start gap-2.5 rounded-xl border border-slate-800 bg-obsidian-950/80 p-3 text-xs sm:text-sm text-slate-200"
              >
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400"
                  aria-hidden="true"
                />
                <span>{t(item.en, item.zh)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 rounded-xl border border-indigo-500/25 bg-indigo-500/10 p-4 text-xs leading-relaxed text-indigo-100">
            <strong>{t("Public GitHub Repository: ", "公开 GitHub 仓库地址：")}</strong>
            <a
              href="https://github.com/Oepjdihc2008/minichain"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-indigo-400/50 underline-offset-4 hover:text-white"
            >
              https://github.com/Oepjdihc2008/minichain
            </a>{" "}
            —{" "}
            {t(
              "Fork, inspect GitHub Actions CI, or submit pull requests under the MIT License.",
              "支持全球开发者在 MIT 开源协议下直接克隆、查看 CI 验证流水线或提交 PR。"
            )}
          </div>
        </section>
      </div>

      {/* Interactive Real Code Inspector */}
      <section aria-labelledby="code-viewer-heading" className="mt-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-indigo-400" aria-hidden="true" />
            <h2 id="code-viewer-heading" className="text-xl font-bold text-white">
              {t("Verified Source Code Preview", "核心开源代码在线预览")}
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {OPEN_SOURCE_PREVIEWS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFileId(f.id)}
                aria-pressed={f.id === activeFileId}
                className={`rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition ${
                  f.id === activeFileId
                    ? "bg-indigo-600 text-white"
                    : "border border-slate-700 bg-obsidian-900 text-slate-300 hover:border-indigo-400"
                }`}
              >
                {f.path}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-indigo-500/25 bg-obsidian-950 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <p className="font-mono text-xs font-semibold text-indigo-300">{activeFile.path}</p>
              <p className="mt-0.5 text-xs text-slate-400">
                {t(activeFile.descEn, activeFile.descZh)}
              </p>
            </div>
            <CopyButton
              targetId="opensource-code-snippet"
              label={t(`Copy ${activeFile.path} source code`, `复制 ${activeFile.path} 源码`)}
            />
          </div>

          <pre
            tabIndex={0}
            className="mt-4 max-h-[480px] overflow-auto font-mono text-xs leading-relaxed text-slate-200"
          >
            <code id="opensource-code-snippet">{activeFile.code}</code>
          </pre>
        </div>
      </section>
    </div>
  );
}
