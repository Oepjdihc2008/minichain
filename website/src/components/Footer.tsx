"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, ShieldAlert } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { MNC_CONTRACT_ADDRESS, SEPOLIA_ETHERSCAN_TOKEN } from "@/lib/sepoliaRpc";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-20 border-t border-indigo-500/20 bg-obsidian-950/90">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-xl border border-amber-500/25 bg-amber-500/5 p-4 text-xs leading-relaxed text-amber-200/90">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
            <p>
              <strong>{t("Experimental Research Notice:", "实验性研究声明：")}</strong>{" "}
              {t(
                "MiniChain is an open-source distributed systems and EVM engineering research project. MiniChain Coin (MNC) is deployed exclusively on Ethereum Sepolia Testnet (Chain ID 11155111) and holds ZERO monetary or financial value. There is no token sale, liquidity pool, or mainnet token. This site is strictly read-only and never asks users to connect a wallet.",
                "MiniChain 是面向全球开发者的分布式系统与 EVM 智能合约开源工程研究项目。MiniChain Coin (MNC) 仅部署于 Ethereum Sepolia 测试网（Chain ID 11155111），不具备任何真实货币或金融价值，不存在代币销售、资金池或主网代币。本站为纯只读技术站点，绝不要求用户连接钱包。"
              )}
            </p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="text-base font-bold text-white">MiniChain Open-Source Lab</p>
            <p className="mt-2 max-w-md text-sm text-slate-400">
              {t(
                "From scratch SHA-256 PoW, Ed25519 validator voting, BFT quorum intersection, SQLite-persisted locking, and Foundry-verified Solidity smart contracts.",
                "从零构建 SHA-256 工作量证明、Ed25519 验证器投票、BFT 法定人数交集、SQLite 持久化跨轮次锁定，以及经 Foundry 严格验证的 Solidity 智能合约。"
              )}
            </p>
            <p className="mt-4 font-mono text-xs text-slate-400">
              Sepolia MNC:{" "}
              <a
                href={SEPOLIA_ETHERSCAN_TOKEN}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-indigo-300 underline decoration-indigo-500/40 underline-offset-4 hover:text-indigo-200"
              >
                {MNC_CONTRACT_ADDRESS}
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            </p>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              {t("Engineering", "工程模块")}
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/architecture" className="hover:text-white">
                  {t("System Architecture", "系统架构图")}
                </Link>
              </li>
              <li>
                <Link href="/explorer" className="hover:text-white">
                  {t("MiniScan Sepolia Explorer", "MiniScan 链上浏览器")}
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-white">
                  {t("Security & Test Evidence", "安全与测试证据")}
                </Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-white">
                  {t("Whitepaper & Docs", "白皮书与技术文档")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              {t("Community & Governance", "开源与社区")}
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/open-source" className="hover:text-white">
                  {t("Sanitized Source Code", "安全审查开源代码")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">
                  {t("Research Mission & Privacy", "研究目标与隐私保护")}
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/Oepjdihc2008/minichain"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-white"
                >
                  <span>GitHub Repository</span>
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href={SEPOLIA_ETHERSCAN_TOKEN}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-white"
                >
                  <span>Sepolia Etherscan</span>
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-slate-800/80 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>© 2026 MiniChain Open-Source Contributors · Released under the MIT License.</p>
          <p className="font-mono">
            Chain ID: 11155111 (Ethereum Sepolia) · Solc 0.8.28 · Python 3 + Foundry
          </p>
        </div>
      </div>
    </footer>
  );
}
