import type { User } from "../types";
import { portraits } from "../media/photos";

export const admins: User[] = [
  {
    id: "admin-mira",
    email: "admin@turo.travel",
    password: "turo123",
    name: "Мира Соколова",
    role: "admin",
    avatar: portraits[20],
    city: "Москва",
    country: "Россия",
    bio: "Следит за маршрутами и профилями на Turo: правит туры и роли, лишнее снимает.",
    languages: ["Русский", "English"],
    rating: 0,
    reviewsCount: 0,
  },
];
