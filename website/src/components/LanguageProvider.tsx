"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Locale = "en" | "zh";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: <T>(enVal: T, zhVal: T) => T;
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: "en",
  setLocale: () => {},
  t: (enVal) => enVal,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("minichain-locale");
      if (saved === "en" || saved === "zh") {
        setLocaleState(saved);
        document.documentElement.lang = saved === "zh" ? "zh-CN" : "en";
      }
    } catch {
      // Ignore storage access restrictions
    }
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    document.documentElement.lang = next === "zh" ? "zh-CN" : "en";
    try {
      window.localStorage.setItem("minichain-locale", next);
    } catch {
      // Ignore storage access restrictions
    }
  };

  const t = <T,>(enVal: T, zhVal: T): T => (locale === "zh" ? zhVal : enVal);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
