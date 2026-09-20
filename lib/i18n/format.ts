import type { Locale } from "./helpers";

export function money(value: number, locale: Locale) {
  const tag = locale === "en" ? "en-GB" : "ru-RU";
  return `${value.toLocaleString(tag)} ₽`;
}

export function formatRange(start: string, end: string, locale: Locale) {
  const tag = locale === "en" ? "en-GB" : "ru-RU";
  const a = new Date(start);
  const b = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  const year = b.getFullYear();
  return `${a.toLocaleDateString(tag, opts)} — ${b.toLocaleDateString(tag, opts)} ${year}`;
}

export const PAID_MARK = "__TURO_PAID__";

export function encodePaidHello(title: string, guests: number) {
  return `${PAID_MARK}|${title}|${guests}`;
}
