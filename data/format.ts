import { leftover } from "./dates";
import type { Tour } from "./types";

export function money(value: number) {
  return `${value.toLocaleString("ru-RU")} ₽`;
}

export function moneyFrom(value: number) {
  return `от ${money(value)}`;
}

export function formatRange(start: string, end: string) {
  const a = new Date(start);
  const b = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  const year = b.getFullYear();
  return `${a.toLocaleDateString("ru-RU", opts)} — ${b.toLocaleDateString("ru-RU", opts)} ${year}`;
}

export function seatsLeft(tour: Tour, start?: string) {
  return leftover(tour, start);
}

export function tourPath(tour: Pick<Tour, "slug" | "source">) {
  if (tour.source === "user") return `/tour/?slug=${tour.slug}`;
  return `/tours/${tour.slug}/`;
}

export function bookPath(tour: Pick<Tour, "slug" | "source">, date?: string) {
  const query = date ? `&date=${date}` : "";
  return `/book/?slug=${tour.slug}${query}`;
}

export function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
