import type { Departure, Tour } from "./types";

export function todayIso() {
  const now = new Date();
  return toIso(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

export function toIso(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function parseYmd(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

export function addDaysIso(iso: string, days: number) {
  const date = parseYmd(iso);
  date.setDate(date.getDate() + days);
  return toIso(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

export function tripEnd(start: string, durationDays: number) {
  return addDaysIso(start, Math.max(durationDays, 1) - 1);
}

export function upcomingWeekdays(weekday: number, count: number, from = todayIso()) {
  const start = parseYmd(from);
  const delta = (weekday - start.getDay() + 7) % 7;
  const first = addDaysIso(from, delta === 0 && start.getTime() < Date.now() - 86_400_000 ? 7 : delta);
  return Array.from({ length: count }, (_, index) => addDaysIso(first, index * 7));
}

export function spreadStarts(start: string, extra = 4, stepDays = 14, min = todayIso()) {
  let first = start;
  let guard = 0;
  while (first < min && guard < 80) {
    first = addDaysIso(first, stepDays);
    guard += 1;
  }
  return Array.from({ length: extra + 1 }, (_, index) => addDaysIso(first, index * stepDays));
}

export function hydrateTour(tour: Tour): Tour {
  const source =
    tour.departures?.length > 0
      ? tour.departures
      : spreadStarts(tour.startDate).map((start, index) => ({
          start,
          taken:
            index === 0
              ? tour.seatsTaken
              : Math.min(Math.max(tour.seats - 1, 0), (index * 2) % Math.max(tour.seats, 1)),
        }));
  const unique = new Map<string, Departure>();
  for (const item of source) unique.set(item.start, item);
  const departures = [...unique.values()].sort((a, b) => a.start.localeCompare(b.start));
  const first = departures[0]?.start ?? tour.startDate;
  return {
    ...tour,
    departures,
    startDate: first,
    endDate: tripEnd(first, tour.durationDays),
  };
}

export function leftover(tour: Pick<Tour, "seats" | "departures" | "seatsTaken">, start?: string) {
  if (!tour.departures?.length) {
    return Math.max(0, tour.seats - tour.seatsTaken);
  }
  if (start) {
    const found = tour.departures.find((item) => item.start === start);
    if (!found) return 0;
    return Math.max(0, tour.seats - found.taken);
  }
  return tour.departures.reduce((max, item) => Math.max(max, tour.seats - item.taken), 0);
}

export function openDepartures(tour: Pick<Tour, "seats" | "departures">) {
  return (tour.departures ?? []).filter((item) => item.taken < tour.seats);
}

export function nextOpenStart(tour: Pick<Tour, "seats" | "departures">) {
  return openDepartures(tour)[0]?.start ?? tour.departures?.[0]?.start;
}

export function seatKey(slug: string, start: string) {
  return `${slug}::${start}`;
}

export function takenMap(tour: Pick<Tour, "departures">) {
  const map: Record<string, number> = {};
  for (const item of tour.departures ?? []) map[item.start] = item.taken;
  return map;
}
