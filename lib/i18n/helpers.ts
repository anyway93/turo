export type Locale = "ru" | "en";

export function interpolate(template: string, vars?: Record<string, string | number>) {
  if (!vars) return template;
  let out = template;
  for (const [key, value] of Object.entries(vars)) {
    out = out.replaceAll(`{${key}}`, String(value));
  }
  return out;
}

export function flattenMessages(
  input: Record<string, unknown>,
  prefix = "",
  target: Record<string, string> = {},
) {
  for (const [key, value] of Object.entries(input)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      flattenMessages(value as Record<string, unknown>, path, target);
    } else {
      target[path] = String(value);
    }
  }
  return target;
}
