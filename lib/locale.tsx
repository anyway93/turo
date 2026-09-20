"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Locale } from "@/lib/i18n/helpers";
import { flattenMessages, interpolate } from "@/lib/i18n/helpers";
import { uiEn, uiRu } from "@/lib/i18n/ui";
import { enLexicon } from "@/lib/i18n/lexicon";
import { enDays } from "@/lib/i18n/lexicon-days";
import { enCopy } from "@/lib/i18n/lexicon-copy";
import { formatDay, formatMonthTitle, formatRange, money, PAID_MARK } from "@/lib/i18n/format";

export type { Locale };

const KEY = "turo-locale";

const tables: Record<Locale, Record<string, string>> = {
  ru: flattenMessages(uiRu as unknown as Record<string, unknown>),
  en: flattenMessages(uiEn as unknown as Record<string, unknown>),
};

const lexicon = new Map<string, string>([
  ...Object.entries(enLexicon),
  ...Object.entries(enDays),
  ...Object.entries(enCopy),
]);

export type Translate = (key: string, vars?: Record<string, string | number>) => string;

type LocaleApi = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: Translate;
  tx: (text: string) => string;
  tag: string;
  money: (value: number) => string;
  range: (start: string, end: string) => string;
  day: (iso: string) => string;
  monthTitle: (year: number, month: number) => string;
  line: (text: string) => string;
};

const LocaleContext = createContext<LocaleApi | null>(null);

function translatePhrase(text: string) {
  const hit = lexicon.get(text);
  if (hit) return hit;
  if (/^День\s+\d+/.test(text)) {
    return text.replace(/^День/, "Day").replace("в пути", "on the way");
  }
  return text;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ru");

  useEffect(() => {
    const saved = window.localStorage.getItem(KEY);
    if (saved === "en" || saved === "ru") setLocaleState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem(KEY, locale);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
  }, []);

  const value = useMemo<LocaleApi>(() => {
    const table = tables[locale];
    const ruTable = tables.ru;
    const t: Translate = (key, vars) => interpolate(table[key] || ruTable[key] || key, vars);
    const tx = (text: string) => (locale === "en" ? translatePhrase(text) : text);
    return {
      locale,
      setLocale,
      tag: locale === "en" ? "en-GB" : "ru-RU",
      t,
      tx,
      money: (value) => money(value, locale),
      range: (start, end) => formatRange(start, end, locale),
      day: (iso) => formatDay(iso, locale),
      monthTitle: (year, month) => formatMonthTitle(year, month, locale),
      line: (text) => {
        if (text.startsWith(`${PAID_MARK}|`)) {
          const parts = text.split("|");
          return t("messages.paidHello", { title: tx(parts[1] ?? ""), n: parts[2] ?? "" });
        }
        return tx(text);
      },
    };
  }, [locale, setLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
