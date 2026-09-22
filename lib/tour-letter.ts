import type { Locale } from "@/lib/i18n/helpers";
import type { TourStyle } from "@/data";

type LetterInput = {
  locale: Locale;
  title: string;
  subtitle: string;
  city: string;
  country: string;
  days: number;
  seats: number;
  style: string;
  styleKey: TourStyle;
  difficulty: string;
  meeting: string;
  cancellation: string;
  included: string[];
  excluded: string[];
  host: string;
};

const voiceRu: Record<TourStyle, string> = {
  море: "Вода здесь задаёт день, а не открытка.",
  пеший: "Идём, пока шаг лёгкий. Геройствовать не нужно.",
  город: "Город показываю с той стороны, куда не сворачивает автобус.",
  гастро: "Еда здесь не пункт программы, а причина остановиться.",
  природа: "Маршрут держится на месте: тропа, свет и пауза.",
  культура: "Историю рассказываю там, где она ещё живая, а не на табличке.",
  фото: "Останавливаемся, когда свет хороший, а не когда так написано в расписании.",
  приключение: "Приключение у нас тихое: новый берег, а не гонка.",
};

const voiceEn: Record<TourStyle, string> = {
  море: "The water sets the day, not a postcard.",
  пеший: "We walk while the step stays easy. No heroics.",
  город: "I show the city from the side a bus never turns down.",
  гастро: "Food here is a reason to stop, not a line in the plan.",
  природа: "The route hangs on the place: a path, the light, a pause.",
  культура: "I tell the history where it is still alive, not on a plaque.",
  фото: "We stop when the light is good, not when the timetable says so.",
  приключение: "The adventure is quiet: a new shore, not a race.",
};

function list(items: string[], n: number, join: string) {
  return items
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, n)
    .join(join);
}

function daysRu(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "день";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "дня";
  return "дней";
}

export function tourLetter(input: LetterInput) {
  const included = list(input.included, 3, input.locale === "en" ? ", " : ", ");
  const excluded = list(input.excluded, 2, input.locale === "en" ? " and " : " и ");
  const host = input.host.trim();

  if (input.locale === "en") {
    return [
      `${voiceEn[input.styleKey]} “${input.title}” is ${input.days} days in ${input.city}, ${input.country}. ${input.subtitle}`,
      `The group is up to ${input.seats} people. The pace is ${input.style}, the effort ${input.difficulty}. Already with you: ${included}. You still cover ${excluded} yourself.`,
      `We meet at ${input.meeting}. ${input.cancellation}. After you pay, write me in the chat — I’ll say what to pack and how to arrive without a rush.${host ? ` — ${host}` : ""}`,
    ];
  }

  return [
    `${voiceRu[input.styleKey]} «${input.title}» — это ${input.days} ${daysRu(input.days)} в ${input.city}, ${input.country}. ${input.subtitle}`,
    `Группа до ${input.seats} человек. Темп — ${input.style}, сложность ${input.difficulty}. С вами уже ${included}. Отдельно остаются ${excluded}.`,
    `Встречаемся здесь: ${input.meeting}. ${input.cancellation}. После оплаты напишите мне в чат — скажу, что положить в рюкзак и как дойти без спешки.${host ? ` — ${host}` : ""}`,
  ];
}
