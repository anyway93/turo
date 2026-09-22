import { admins } from "./admins";
import { moreTravelers } from "./more-travelers";
import { organizers } from "./organizers";
import { travelers } from "./travelers";
import type { User } from "../types";

export const users: User[] = [...admins, ...organizers, ...travelers, ...moreTravelers];

export const demoAccounts = [
  {
    email: "anna@turo.travel",
    password: "turo123",
    key: "demoAnna",
  },
  {
    email: "elena@turo.travel",
    password: "turo123",
    key: "demoElena",
  },
  {
    email: "admin@turo.travel",
    password: "turo123",
    key: "demoAdmin",
  },
] as const;

export function userById(id: string) {
  return users.find((user) => user.id === id);
}

export function userByEmail(email: string) {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}
