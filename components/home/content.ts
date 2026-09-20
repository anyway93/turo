export const paths = [
  {
    href: "#places",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
    index: "01",
    kicker: "Путешественникам",
    title: "Найти тур",
    text: "Авторские маршруты с датами, ценой и свободными местами. Запись в два шага.",
    action: "К каталогу",
  },
  {
    href: "#auth",
    id: "create",
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=80",
    index: "02",
    kicker: "Гидам",
    title: "Создать тур",
    text: "Опишите маршрут, поставьте цену и откройте набор. Turo — это витрина, не посредник.",
    action: "Разместить",
    accent: true,
  },
] as const;

export const steps = [
  {
    index: "01",
    title: "Регистрация",
    text: "Один профиль — и как гость, и как автор маршрута.",
  },
  {
    index: "02",
    title: "Выбор или создание",
    text: "Бронируйте чужой тур или опубликуйте свой на ближайшие даты.",
  },
  {
    index: "03",
    title: "Встреча",
    text: "Подтверждение, чат с организатором и выезд без лишних писем.",
  },
] as const;

export const places = [
  {
    name: "Киото",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1400&q=80",
  },
  {
    name: "Марракеш",
    image:
      "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Лисий фьорд",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80",
  },
] as const;
