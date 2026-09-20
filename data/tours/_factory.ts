import { hydrateTour } from "../dates";
import type { Departure, ItineraryDay, Tour } from "../types";

export function days(count: number, titles: string[]): ItineraryDay[] {
  return Array.from({ length: count }, (_, index) => ({
    day: index + 1,
    title: titles[index] ?? `День ${index + 1}: в пути`,
    text:
      index === 0
        ? "Встреча, размещение, короткий выход в город или к воде. Без гонки в первый вечер."
        : index === count - 1
          ? "Свободное утро, трансфер, прощание. Билеты домой не входят в цену."
          : "Движение по маршруту в спокойном темпе. Обед в локальном месте, вечер без обязательной программы.",
  }));
}

const includedBase = [
  "Проживание в выбранном формате",
  "Завтраки",
  "Работа гида и локальных проводников",
  "Трансферы по программе",
  "Входные билеты по списку",
];

const excludedBase = [
  "Международный перелёт",
  "Обеды и ужины, если не указано иное",
  "Личная страховка",
  "Сувениры и чаевые",
];

export function makeTour(
  tour: Omit<Tour, "included" | "excluded" | "source" | "departures"> & {
    included?: string[];
    excluded?: string[];
    departures?: Departure[];
  },
): Tour {
  return hydrateTour({
    ...tour,
    departures: tour.departures ?? [],
    included: tour.included ?? includedBase,
    excluded: tour.excluded ?? excludedBase,
    source: "seed",
  });
}
