import { africaTours } from "./africa";
import { americasTours } from "./americas";
import { asiaTours } from "./asia";
import { europeTours } from "./europe";
import { oceaniaTours } from "./oceania";
import type { Tour } from "../types";

export const tours: Tour[] = [
  ...europeTours,
  ...asiaTours,
  ...africaTours,
  ...americasTours,
  ...oceaniaTours,
];

export function tourBySlug(slug: string) {
  return tours.find((tour) => tour.slug === slug);
}

export const continents = [
  "Европа",
  "Азия",
  "Африка",
  "Америка",
  "Океания",
] as const;

export const tourStyles = [
  "пеший",
  "город",
  "гастро",
  "природа",
  "море",
  "культура",
  "фото",
  "приключение",
] as const;
