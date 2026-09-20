import { moreTravelers } from "./more-travelers";
import { organizers } from "./organizers";
import { travelers } from "./travelers";
import type { User } from "../types";

export const users: User[] = [...organizers, ...travelers, ...moreTravelers];

export const demoAccounts = [
  {
    email: "anna@turo.travel",
    password: "turo123",
    label: "Путешественница Анна",
    hint: "Есть брони и чаты с гидами",
  },
  {
    email: "elena@turo.travel",
    password: "turo123",
    label: "Организатор Елена",
    hint: "Чаты разложены по её турам",
  },
  {
    email: "marco@turo.travel",
    password: "turo123",
    label: "Организатор Marco",
    hint: "Итальянские маршруты и гости",
  },
] as const;

export function userById(id: string) {
  return users.find((user) => user.id === id);
}

export function userByEmail(email: string) {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}
