"use client";

import React, { useState } from "react";
import {
  Bug,
  CheckCircle2,
  Copy,
  ExternalLink,
  GitFork,
  GitPullRequest,
  HeartHandshake,
  Lock,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Star,
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { MncLogo } from "@/components/MncLogo";
import { CopyButton } from "@/components/CopyButton";

interface DemoNetworkCard {
  id: string;
  symbol: string;
  nameEn: string;
  nameZh: string;
  networkEn: string;
  networkZh: string;
  placeholderAddress: string;
  accentColor: string;
  logo: React.ReactNode;
}

const DEMO_NETWORKS: DemoNetworkCard[] = [
  {
    id: "eth",
    symbol: "ETH",
    nameEn: "Ethereum (ETH)",
    nameZh: "Ethereum (ETH)",
    networkEn: "Only supports Ethereum network assets",
    networkZh: "仅支持接收 Ethereum 网络资产",
    placeholderAddress: "DEMO-ONLY · 0x0000...DISABLED_PENDING_REVIEW",
    accentColor: "#627EEA",
    logo: (
      <svg viewBox="0 0 40 40" className="h-11 w-11" aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="#627EEA" />
        <path d="M20 7.5L12.5 20.1L20 24.5L27.5 20.1L20 7.5Z" fill="#FFFFFF" fillOpacity="0.92" />
        <path d="M20 26.2L12.5 21.8L20 32.5L27.5 21.8L20 26.2Z" fill="#FFFFFF" fillOpacity="0.72" />
      </svg>
    ),
  },
  {
    id: "sol",
    symbol: "SOL",
    nameEn: "Solana (SOL)",
    nameZh: "Solana (SOL)",
    networkEn: "Only supports Solana network assets",
    networkZh: "仅支持接收 Solana 网络资产",
    placeholderAddress: "DEMO-ONLY · SOL_PLACEHOLDER_DISABLED",
    accentColor: "#14F195",
    logo: (
      <svg viewBox="0 0 40 40" className="h-11 w-11" aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="#0B1221" stroke="#9945FF" strokeWidth="1.5" />
        <defs>
          <linearGradient id="sol-g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9945FF" />
            <stop offset="100%" stopColor="#14F195" />
          </linearGradient>
        </defs>
        <path d="M12.5 14.5H26.5L28.5 11.8H14.5L12.5 14.5Z" fill="url(#sol-g)" />
        <path d="M12.5 21.4H26.5L28.5 18.7H14.5L12.5 21.4Z" fill="url(#sol-g)" />
        <path d="M27.5 25.5H13.5L11.5 28.2H25.5L27.5 25.5Z" fill="url(#sol-g)" />
      </svg>
    ),
  },
  {
    id: "btc",
    symbol: "BTC",
    nameEn: "Bitcoin (BTC)",
    nameZh: "Bitcoin (BTC)",
    networkEn: "Only supports Bitcoin (Native SegWit) network assets",
    networkZh: "仅支持接收 Bitcoin (Native SegWit) 网络资产",
    placeholderAddress: "DEMO-ONLY · bc1q_placeholder_disabled",
    accentColor: "#F7931A",
    logo: (
      <svg viewBox="0 0 40 40" className="h-11 w-11" aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="#F7931A" />
        <text
          x="20"
          y="27"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="21"
          fontWeight="bold"
          fontFamily="sans-serif"
        >
          ₿
        </text>
      </svg>
    ),
  },
  {
    id: "bnb",
    symbol: "BNB",
    nameEn: "BNB Chain (BNB)",
    nameZh: "BNB Chain (BNB)",
    networkEn: "Only supports BNB Smart Chain network assets",
    networkZh: "仅支持接收 BNB Chain 网络资产",
    placeholderAddress: "DEMO-ONLY · 0x0000...BNB_DISABLED",
    accentColor: "#F3BA2F",
    logo: (
      <svg viewBox="0 0 40 40" className="h-11 w-11" aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="#F3BA2F" />
        <path
          d="M20 9.5L24.2 13.7L21.7 16.2L20 14.5L18.3 16.2L15.8 13.7L20 9.5ZM13.7 15.8L16.2 18.3L13.7 20.8L11.2 18.3L13.7 15.8ZM26.3 15.8L28.8 18.3L26.3 20.8L23.8 18.3L26.3 15.8ZM20 17.5L22.5 20L20 22.5L17.5 20L20 17.5ZM20 30.5L15.8 26.3L18.3 23.8L20 25.5L21.7 23.8L24.2 26.3L20 30.5Z"
          fill="#FFFFFF"
        />
      </svg>
    ),
  },
  {
    id: "trx",
    symbol: "TRX",
    nameEn: "Tron (TRX)",
    nameZh: "Tron (TRX)",
    networkEn: "Only supports Tron network assets",
    networkZh: "仅支持接收 Tron 网络资产",
    placeholderAddress: "DEMO-ONLY · TRON_PLACEHOLDER_DISABLED",
    accentColor: "#EB0029",
    logo: (
      <svg viewBox="0 0 40 40" className="h-11 w-11" aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="#EB0029" />
        <path
          d="M11.5 12.2L28.8 15.4L19.6 30.2L11.5 12.2ZM14.6 14.3L20.1 26.2L24.8 17.6L14.6 14.3Z"
          fill="#FFFFFF"
        />
      </svg>
    ),
  },
];

export default function SupportPage() {
  const { t } = useLanguage();
  const [selectedNetId, setSelectedNetId] = useState<string>("eth");

  const activeNet = DEMO_NETWORKS.find((n) => n.id === selectedNetId) || DEMO_NETWORKS[0];

  const nonFinancialActions = [
    {
      icon: Star,
      titleEn: "Star on GitHub",
      titleZh: "在 GitHub 点亮 Star",
      descEn: "Help other distributed-systems and Solidity engineers discover MiniChain.",
      descZh: "帮助更多分布式系统与智能合约开发者发现 MiniChain 开源项目。",
      href: "https://github.com/Oepjdihc2008/minichain",
      ctaEn: "Star Repository",
      ctaZh: "前往点亮 Star",
    },
    {
      icon: GitFork,
      titleEn: "Fork MiniChain",
      titleZh: "Fork 仓库进行实验",
      descEn: "Clone the BFT locking labs, run 30,000 Foundry fuzz tests, and experiment locally.",
      descZh: "复刻 BFT 跨轮次锁定实验室与 Foundry 模糊测试套件，在本地自由扩展。",
      href: "https://github.com/Oepjdihc2008/minichain/fork",
      ctaEn: "Fork on GitHub",
      ctaZh: "前往 Fork",
    },
    {
      icon: GitPullRequest,
      titleEn: "Contribute Code",
      titleZh: "参与开源代码贡献",
      descEn: "Tackle open Good First Issues on network simulators, invariants, or MiniScan.",
      descZh: "认领开源社区 Good First Issues，共同推进共识模拟与形式化验证。",
      href: "https://github.com/Oepjdihc2008/minichain/blob/main/CONTRIBUTING.md",
      ctaEn: "Read Contributing Guide",
      ctaZh: "查看贡献指南",
    },
    {
      icon: Bug,
      titleEn: "Report a Bug",
      titleZh: "反馈 Bug 与改进建议",
      descEn: "Found an edge case in our locking logic, docs, or explorer? Open a GitHub Issue.",
      descZh: "如在共识逻辑、技术文档或 MiniScan 浏览器中发现边界问题，欢迎提交 Issue。",
      href: "https://github.com/Oepjdihc2008/minichain/issues/new",
      ctaEn: "Open an Issue",
      ctaZh: "提交 Issue",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-[#D9B66C]/35 bg-gradient-to-br from-[#0B1426] via-[#101D35] to-[#081020] p-8 shadow-[0_0_60px_rgba(217,182,108,0.08)] sm:p-12">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D9B66C]/40 bg-[#D9B66C]/10 px-3.5 py-1.5 text-xs font-semibold text-[#EAC77B]">
              <HeartHandshake className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t("Open-Source Community Support", "开源社区支持与共建")}</span>
            </div>

            <div className="mt-5 flex items-center gap-4">
              <MncLogo
                className="h-14 w-14 shrink-0 drop-shadow-[0_0_20px_rgba(234,199,123,0.3)] sm:h-16 sm:w-16"
                ariaLabel="MiniChain & MNC Official Logo"
              />
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {t("Support the Future of MiniChain", "支持 MiniChain 的未来")}
              </h1>
            </div>

            <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
              {t(
                "Your support helps keep MiniChain open, accessible, and continuously improving.",
                "您的支持有助于 MiniChain 持续开源、发展和改进。"
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-200 max-w-xs">
            <div className="flex items-center gap-2 font-bold text-white">
              <ShieldCheck className="h-4 w-4 text-emerald-400" aria-hidden="true" />
              <span>{t("Zero Wallet Connection", "绝不连接任何钱包")}</span>
            </div>
            <p className="mt-1.5 leading-relaxed">
              {t(
                "This page never requests browser wallet connections, never reads wallet permissions, and never initiates transactions.",
                "本页面绝不要求访问者连接钱包，绝不读取钱包权限，也绝不自动发起任何链上交易。"
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Non-Financial Community Support Section */}
      <section aria-labelledby="non-financial-heading" className="mt-12">
        <div className="max-w-3xl">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#EAC77B]">
            {t("Active Ways to Help Today", "当前最直接的开源支持方式")}
          </span>
          <h2 id="non-financial-heading" className="mt-1 text-2xl font-bold text-white sm:text-3xl">
            {t("Support MiniChain Without Spending Anything", "非资金方式支持开源项目")}
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            {t(
              "Open-source engineering thrives on code review, reproducibility testing, and community visibility.",
              "开源工程项目的成长离不开全球开发者的代码审阅、测试反馈与社区分享。"
            )}
          </p>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {nonFinancialActions.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.titleEn}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between rounded-2xl border border-[#D9B66C]/25 bg-obsidian-900/90 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#EAC77B]/60 hover:bg-[#101D35]/80"
              >
                <div>
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#D9B66C]/30 bg-[#101D35] text-[#EAC77B]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-white">
                    {t(item.titleEn, item.titleZh)}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                    {t(item.descEn, item.descZh)}
                  </p>
                </div>
                <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#EAC77B] group-hover:text-white">
                  <span>{t(item.ctaEn, item.ctaZh)}</span>
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </div>
              </a>
            );
          })}
        </div>

        {/* Share MiniChain Card */}
        <div className="mt-5 flex flex-col items-start justify-between gap-4 rounded-2xl border border-indigo-500/25 bg-obsidian-900/90 p-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3.5">
            <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#D9B66C]/30 bg-[#101D35] text-[#EAC77B]">
              <Share2 className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {t("Share MiniChain", "分享 MiniChain 给更多开发者")}
              </h3>
              <p className="mt-0.5 text-xs text-slate-400">
                {t(
                  "Copy the official MiniChain website link to share with distributed systems & Solidity communities.",
                  "复制 MiniChain 官方网站链接，推荐给对分布式共识与智能合约感兴趣的技术社区。"
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-obsidian-950 px-3 py-2">
            <code id="share-minichain-url" className="font-mono text-xs text-indigo-200">
              https://oepjdihc2008.github.io/minichain/
            </code>
            <CopyButton
              targetId="share-minichain-url"
              label={t("Copy MiniChain official website URL", "复制 MiniChain 官方网站链接")}
              compact
            />
          </div>
        </div>
      </section>

      {/* Reserved Crypto Support Card UI Preview (Disabled Demo Placeholder) */}
      <section aria-labelledby="donation-preview-heading" className="mt-16">
        <div className="max-w-3xl">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-amber-300">
            {t("Future Sponsorship UI Preview · Currently Disabled", "预留加密打赏界面预览 · 当前默认禁用")}
          </span>
          <h2 id="donation-preview-heading" className="mt-1 text-2xl font-bold text-white sm:text-3xl">
            {t("Donation Receive Card (Non-Payment Demo Placeholder)", "打赏收款卡片（非收款演示占位界面）")}
          </h2>
        </div>

        {/* Mandatory Governance & Non-Payment Notice */}
        <div className="mt-4 rounded-2xl border border-amber-400/35 bg-amber-500/10 p-5 text-sm leading-relaxed text-amber-100">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" aria-hidden="true" />
            <div>
              <strong className="font-bold text-white">
                {t("Live Donations Disabled by Default: ", "重要声明 — 真实收款功能默认禁用：")}
              </strong>
              {t(
                "The receive card below is an explicitly labeled non-payment UI preview placeholder. No real wallet address or scannable payment QR code is displayed. Real financial sponsorship remains disabled until adult-assisted fund governance, privacy, and compliance review are completed.",
                "下方展示的收款卡片仅为明确标注的非收款界面演示占位符，不显示真实私人钱包地址，也不生成真实支付二维码。真实收款模块默认禁用，待成年人协助完成资金管理、隐私及合规审核后再行评估。"
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-12">
          {/* Network Selector Column */}
          <div className="lg:col-span-5 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {t("Preview Supported Network Layouts", "切换预览不同网络的收款卡片布局")}
            </p>
            <div className="grid gap-2.5">
              {DEMO_NETWORKS.map((net) => {
                const selected = net.id === selectedNetId;
                return (
                  <button
                    key={net.id}
                    type="button"
                    onClick={() => setSelectedNetId(net.id)}
                    aria-pressed={selected}
                    className={`flex items-center justify-between rounded-2xl border p-3.5 text-left transition ${
                      selected
                        ? "border-[#EAC77B] bg-[#101D35] shadow-[0_0_24px_rgba(234,199,123,0.16)]"
                        : "border-slate-800 bg-obsidian-900/80 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="scale-90">{net.logo}</div>
                      <div>
                        <p className="text-sm font-bold text-white">
                          {t(net.nameEn, net.nameZh)}
                        </p>
                        <p className="text-xs text-slate-400">
                          {t("Demo Placeholder Mode", "非收款演示占位模式")}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full border border-[#D9B66C]/35 bg-[#D9B66C]/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#EAC77B]">
                      {net.symbol}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Centered Luxury Wallet-Style Receive Card (Demo Placeholder) */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-md rounded-3xl border border-[#D9B66C]/45 bg-gradient-to-b from-[#101D35] via-[#0B1528] to-[#070E1C] p-6 shadow-[0_0_50px_rgba(217,182,108,0.12)] sm:p-8">
              {/* Top Network Logo & Name */}
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  {activeNet.logo}
                  <span className="absolute -bottom-1 -right-1 rounded-full border border-[#101D35] bg-[#101D35] p-0.5">
                    <MncLogo className="h-4 w-4" />
                  </span>
                </div>

                <h3 className="mt-3 text-xl font-bold text-white">
                  {activeNet.symbol} {t("Receive (Demo)", "收款（演示占位）")}
                </h3>

                {/* Network Consistency Hint */}
                <p className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-[#D9B66C]/30 bg-[#D9B66C]/10 px-3 py-1 text-xs font-medium text-[#EAC77B]">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{t(activeNet.networkEn, activeNet.networkZh)}</span>
                </p>
              </div>

              {/* Centered Non-Scannable Demo QR Placeholder Area */}
              <div className="mt-6 rounded-2xl border border-[#D9B66C]/25 bg-[#060C18] p-6">
                <div
                  role="img"
                  aria-label={t(
                    "Non-scannable demo QR placeholder — live donations are disabled",
                    "非支付演示二维码占位区域 — 真实收款功能已禁用"
                  )}
                  className="mx-auto flex h-52 w-52 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#D9B66C]/40 bg-[#101D35]/70 p-4 text-center"
                >
                  <MncLogo className="h-14 w-14 opacity-90" />
                  <span className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-amber-500/15 px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-amber-300">
                    <Lock className="h-3 w-3" aria-hidden="true" />
                    {t("DEMO PLACEHOLDER", "非收款演示占位")}
                  </span>
                  <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
                    {t(
                      "Not a real payment QR code. Disabled pending governance & compliance review.",
                      "不生成真实支付二维码，待合规与资金管理审核后再评估。"
                    )}
                  </p>
                </div>

                {/* Placeholder Address + Disabled Copy Button */}
                <div className="mt-5 rounded-xl border border-slate-800 bg-[#0B1426] p-3.5">
                  <p className="text-[11px] font-medium text-slate-400">
                    {t("Receive Address (Placeholder Only)", "收款地址（仅界面占位，不可转账）")}
                  </p>
                  <div className="mt-1.5 flex items-center justify-between gap-2">
                    <code className="break-all font-mono text-xs text-slate-400">
                      {activeNet.placeholderAddress}
                    </code>
                    <button
                      type="button"
                      disabled
                      aria-disabled="true"
                      title={t("Disabled — no real payment address configured", "已禁用 — 当前为非收款演示占位符")}
                      className="inline-flex h-9 w-9 shrink-0 cursor-not-allowed items-center justify-center rounded-lg border border-slate-700 bg-slate-900/70 text-slate-500"
                    >
                      <Copy className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Explicit Non-Investment & Privacy Footer inside Card */}
              <p className="mt-4 text-center text-[11px] leading-relaxed text-slate-400">
                {t(
                  "MiniChain is an open-source research project. Supporting MiniChain confers no financial return, equity, or token value. MNC on Sepolia has $0 monetary value.",
                  "MiniChain 是开源技术研究项目，支持行为不构成任何投资回报承诺；Sepolia 测试网上的 MNC 代币不具备任何货币价值。"
                )}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
