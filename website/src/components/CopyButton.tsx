"use client";

import React, { useEffect, useRef, useState } from "react";
import { Check, Copy, AlertCircle } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

let lastAnnouncedMessage = "";

interface CopyButtonProps {
  targetId: string;
  label: string;
  compact?: boolean;
}

export function CopyButton({ targetId, label, compact = false }: CopyButtonProps) {
  const { t } = useLanguage();
  const btnRef = useRef<HTMLButtonElement>(null);
  const tipRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  const performCopy = async () => {
    const button = btnRef.current;
    const tip = tipRef.current;
    const target = document.getElementById(targetId);
    if (!button || !tip || !target) return;

    const text =
      target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement
        ? target.value.trim()
        : target.innerText.trim();

    if (!text) return;

    let ok = false;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch {
      ok = false;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    button.removeAttribute("data-copied");
    button.removeAttribute("data-failed");
    tip.textContent = "";
    void button.offsetWidth;

    let message = ok ? t("Copied", "已复制") : t("Copy failed", "复制失败");
    if (message === lastAnnouncedMessage) {
      message += "\u00A0";
    }
    lastAnnouncedMessage = message;

    button.setAttribute(ok ? "data-copied" : "data-failed", "");
    setState(ok ? "copied" : "failed");
    requestAnimationFrame(() => {
      if (tipRef.current) tipRef.current.textContent = message;
    });

    timerRef.current = setTimeout(() => {
      button.removeAttribute("data-copied");
      button.removeAttribute("data-failed");
      if (tipRef.current) tipRef.current.textContent = "";
      setState("idle");
    }, 2000);
  };

  useEffect(() => {
    const button = btnRef.current;
    if (!button) return;

    const onCommand = (event: Event) => {
      const cmdEvent = event as Event & { command?: string; source?: Element };
      if (cmdEvent.source === button && cmdEvent.command === "--copy") {
        void performCopy();
      }
    };

    if ("CommandEvent" in window) {
      document.addEventListener("command", onCommand, true);
      return () => document.removeEventListener("command", onCommand, true);
    }

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      void performCopy();
    };
    button.addEventListener("click", onClick);
    return () => button.removeEventListener("click", onClick);
  });

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <span className="copy-wrap">
      <button
        ref={btnRef}
        type="button"
        {...({ command: "--copy", commandfor: targetId } as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        aria-label={label}
        className={`copy-button rounded-md border border-indigo-500/30 bg-slate-900/90 text-slate-300 hover:border-indigo-400 hover:text-white transition-colors ${
          compact ? "px-2 py-1 text-xs" : "px-2.5 py-1.5 text-xs"
        }`}
      >
        {state === "copied" ? (
          <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
        ) : state === "failed" ? (
          <AlertCircle className="h-3.5 w-3.5 text-rose-400" aria-hidden="true" />
        ) : (
          <Copy className="h-3.5 w-3.5 text-indigo-300" aria-hidden="true" />
        )}
      </button>
      <span ref={tipRef} className="copy-tip" role="status" />
    </span>
  );
}
