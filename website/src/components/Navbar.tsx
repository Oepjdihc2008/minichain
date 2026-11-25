"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, Menu, X, ShieldCheck } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

const NAV_ITEMS = [
  { href: "/", en: "Home", zh: "首页" },
  { href: "/architecture", en: "Architecture", zh: "技术架构" },
  { href: "/explorer", en: "MiniScan", zh: "MiniScan 浏览器" },
  { href: "/security", en: "Security", zh: "安全与测试" },
  { href: "/docs", en: "Docs", zh: "技术文档" },
  { href: "/open-source", en: "Open Source", zh: "开源代码" },
  { href: "/about", en: "About", zh: "关于项目" },
];

export function Navbar() {
  const pathname = usePathname() || "/";
  const { locale, setLocale, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isCurrent = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname === `${href}/` || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-indigo-500/20 bg-obsidian-950/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-3 text-white focus-visible:rounded-lg"
        >
          <svg
            viewBox="0 0 36 36"
            className="h-9 w-9 shrink-0 transition-transform duration-300 group-hover:scale-105"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="mc-brand-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
            <polygon
              points="18,2 32,10 32,26 18,34 4,26 4,10"
              fill="rgba(99,102,241,0.14)"
              stroke="url(#mc-brand-grad)"
              strokeWidth="2"
            />
            <circle cx="18" cy="11" r="2.6" fill="#38bdf8" />
            <circle cx="11" cy="23" r="2.6" fill="#818cf8" />
            <circle cx="25" cy="23" r="2.6" fill="#c084fc" />
            <path
              d="M18 11 L11 23 L25 23 Z"
              fill="none"
              stroke="url(#mc-brand-grad)"
              strokeWidth="1.6"
            />
          </svg>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white">MiniChain</span>
              <span className="rounded-full border border-indigo-400/30 bg-indigo-500/15 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-indigo-300">
                Sepolia Lab
              </span>
            </div>
            <p className="hidden text-[11px] text-slate-400 sm:block">
              {t("Consensus & EVM Engineering Research", "分布式共识与 EVM 工程研究")}
            </p>
          </div>
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-2">
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => {
              const active = isCurrent(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`nav-link rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-indigo-500/10 text-white"
                        : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                    }`}
                  >
                    {t(item.en, item.zh)}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300 xl:inline-flex">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              {t("Read-Only · No Wallet", "纯只读 · 无需连钱包")}
            </span>

            <button
              type="button"
              onClick={() => setLocale(locale === "en" ? "zh" : "en")}
              aria-label={
                locale === "en"
                  ? "Switch language to Simplified Chinese"
                  : "切换语言为英文 (Switch to English)"
              }
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-slate-900/90 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:border-indigo-400 hover:text-white"
            >
              <Globe className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
              <span>{locale === "en" ? "中文" : "EN"}</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-primary-nav"
              className="mobile-menu-trigger inline-flex min-h-[40px] min-w-[40px] items-center justify-center gap-1.5 rounded-lg border border-indigo-500/30 bg-slate-900/90 px-2.5 py-2 text-xs font-medium text-slate-200 hover:border-indigo-400 hover:text-white lg:hidden"
            >
              {mobileOpen ? (
                <X className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Menu className="h-4 w-4" aria-hidden="true" />
              )}
              <span>{t("Menu", "菜单")}</span>
            </button>
          </div>
        </nav>
      </div>

      {mobileOpen && (
        <div
          id="mobile-primary-nav"
          className="border-t border-indigo-500/20 bg-obsidian-900/98 px-4 py-3 lg:hidden"
        >
          <ul className="grid gap-1">
            {NAV_ITEMS.map((item) => {
              const active = isCurrent(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={`nav-link block rounded-lg px-3 py-2.5 text-sm font-medium ${
                      active
                        ? "bg-indigo-500/15 text-white"
                        : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                    }`}
                  >
                    {t(item.en, item.zh)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
