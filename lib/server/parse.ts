import { randomBytes } from "crypto";

export function uid(prefix: string) {
  return `${prefix}-${randomBytes(4).toString("hex")}`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]+/gi, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

const continents = new Set(["Европа", "Азия", "Африка", "Америка", "Океания"]);
const difficulties = new Set(["лёгкий", "средний", "сложный"]);
const styles = new Set(["пеший", "город", "гастро", "природа", "море", "культура", "фото", "приключение"]);
const roles = new Set(["traveler", "organizer", "admin"]);

export function isContinent(value: string) {
  return continents.has(value);
}

export function isDifficulty(value: string) {
  return difficulties.has(value);
}

export function isStyle(value: string) {
  return styles.has(value);
}

export function isRole(value: string) {
  return roles.has(value);
}

export function asStringList(value: unknown) {
  if (!Array.isArray(value)) return null;
  const items = value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean);
  return items;
}

export function readJson(request: Request) {
  return request.json().catch(() => null);
}
