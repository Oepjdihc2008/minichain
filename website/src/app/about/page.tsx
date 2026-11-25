"use client";

import React from "react";
import { Compass, GitPullRequest, Lock, Scale, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function AboutPage() {
  const { t } = useLanguage();

  const principles = [
    {
      icon: Compass,
      titleEn: "First-Principles Systems Engineering",
      titleZh: "第一性原理与底层工程实践",
      descEn:
        "Rather than wrapping opaque third-party SDKs, MiniChain implements block hashing, Ed25519 vote verification, quorum intersection checks, SQLite lock persistence, and ERC-20 state logic directly so every line is auditable by peers.",
      descZh:
        "拒绝黑盒式堆砌第三方框架，从零实现区块哈希、Ed25519 选票校验、法定人数交集计算、SQLite 原子锁存储与原生 ERC-20 逻辑，让每一行代码都清晰可读、可被同行审阅。",
    },
    {
      icon: Scale,
      titleEn: "Radical Technical Honesty",
      titleZh: "绝对诚实的技术边界声明",
      descEn:
        "We document exact architectural boundaries—explicitly distinguishing standalone Python BFT consensus simulations from Anvil/Sepolia EVM execution nodes, disclosing un-audited status, and reporting real RPC availability.",
      descZh:
        "如实披露每一处架构边界——明确区分独立 Python BFT 共识实验与 Anvil/Sepolia EVM 节点，坦诚说明未经商业审计的现状，杜绝任何虚假宣传。",
    },
    {
      icon: GitPullRequest,
      titleEn: "Zero-Hype Global Collaboration",
      titleZh: "零金融炒作的全球开发者协作",
      descEn:
        "MiniChain is 100% focused on distributed systems education, consensus fault-tolerance modeling, and smart contract testing. There are no token sales, financial promises, or commercial paywalls.",
      descZh:
        "MiniChain 100% 专注于分布式系统实验、共识容错建模与智能合约安全测试交流，不含任何代币融资、价格承诺或商业付费门槛。",
    },
    {
      icon: Lock,
      titleEn: "Creator Privacy & Pseudonymous Open Source",
      titleZh: "维护者隐私保护与纯粹代码文化",
      descEn:
        "In accordance with open-source security best practices, MiniChain is maintained under project-level contributor attribution without exposing personal names, schools, ages, or physical addresses.",
      descZh:
        "遵循开源社区安全与隐私保护准则，MiniChain 以开源项目贡献者身份维护，不公开项目创建者的真实姓名、学校、年龄或住址等敏感个人信息，让技术作品本身说话。",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-sky-400">
          {t("Research Mission & Philosophy", "工程研究使命与理念")}
        </span>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          {t("About MiniChain", "关于 MiniChain")}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
          {t(
            "MiniChain is an independent open-source blockchain engineering research project built to explore how cryptographic primitives, Byzantine Fault Tolerant consensus rules, crash-safe storage, and EVM smart contracts work under failure conditions.",
            "MiniChain 是一个独立的开源区块链工程研究项目，旨在深入探索密码学原语、拜占庭容错（BFT）共识规则、崩溃安全持久化存储以及 EVM 智能合约在故障与对抗条件下的运行机制。"
          )}
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {principles.map((p) => {
          const Icon = p.icon;
          return (
            <article
              key={p.titleEn}
              className="rounded-2xl border border-indigo-500/25 bg-obsidian-900/90 p-6"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="mt-4 text-lg font-bold text-white">{t(p.titleEn, p.titleZh)}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                {t(p.descEn, p.descZh)}
              </p>
            </article>
          );
        })}
      </div>

      {/* Research Directions & Call for Contributors */}
      <section className="mt-12 rounded-3xl border border-indigo-500/25 bg-gradient-to-br from-obsidian-900 to-indigo-950/35 p-8">
        <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          <span>OPEN CALL FOR DISTRIBUTED SYSTEMS &amp; SOLIDITY ENGINEERS</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold text-white">
          {t("Future Engineering Directions", "未来技术发展方向与贡献邀请")}
        </h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-300">
          <p>
            {t(
              "MiniChain welcomes peer review, bug reports, formal verification specs, and protocol experiments from developers worldwide. Key areas of ongoing research include:",
              "MiniChain 诚邀全球分布式系统工程师、智能合约开发者与高校/独立研究者参与代码审阅、提交 Issue 与共同研发，当前重点探索方向包括："
            )}
          </p>
          <ul className="list-disc space-y-2 pl-5 text-slate-200">
            <li>
              {t(
                "Deterministic network simulator modeling message delay, packet reordering, and asymmetric network partitions across BFT rounds.",
                "确定性异步网络模拟器：建模消息延迟、乱序与非对称网络分区下的 BFT 安全性与活性。"
              )}
            </li>
            <li>
              {t(
                "Bridging the gap between standalone Python BFT consensus finality and an execution engine via a clean state-transition API.",
                "共识与执行引擎桥接实验：探索通过清晰的状态转换接口将独立 Python BFT 共识层与极简执行层打通。"
              )}
            </li>
            <li>
              {t(
                "Symbolic execution and invariant verification (Halmos / Foundry invariant suites) for smart contract state machines.",
                "形式化验证与符号执行：引入 Halmos 与 Foundry 有状态不变量测试（Stateful Invariant Testing）强化合约验证。"
              )}
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
