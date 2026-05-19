import type { LocalizedString } from "../types/index.js";

/** Resolve a LocalizedString for a given locale, with graceful fallback. */
export function resolveLocalized(value: LocalizedString, locale: string): string {
  if (typeof value === "string") return value;
  if (value[locale]) return value[locale]!;
  // Try language-only fallback (e.g., "en-US" → "en").
  const lang = locale.split("-")[0];
  if (lang && value[lang]) return value[lang]!;
  // Fallback to first available.
  const first = Object.values(value)[0];
  return first ?? "";
}
