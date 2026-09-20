import type { Locale } from "./helpers";

export function money(value: number, locale: Locale) {
  const tag = locale === "en" ? "en-GB" : "ru-RU";
  return `${value.toLocaleString(tag)} ₽`;
}

function parts(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

export function formatRange(start: string, end: string, locale: Locale) {
  const tag = locale === "en" ? "en-GB" : "ru-RU";
  const a = parts(start);
  const b = parts(end);
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  const year = b.getFullYear();
  return `${a.toLocaleDateString(tag, opts)} — ${b.toLocaleDateString(tag, opts)} ${year}`;
}

export function formatDay(iso: string, locale: Locale) {
  const tag = locale === "en" ? "en-GB" : "ru-RU";
  return parts(iso).toLocaleDateString(tag, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function formatMonthTitle(year: number, month: number, locale: Locale) {
  const tag = locale === "en" ? "en-GB" : "ru-RU";
  return new Date(year, month, 1).toLocaleDateString(tag, { month: "long", year: "numeric" });
}

export const PAID_MARK = "__TURO_PAID__";

export function encodePaidHello(title: string, guests: number) {
  return `${PAID_MARK}|${title}|${guests}`;
}
