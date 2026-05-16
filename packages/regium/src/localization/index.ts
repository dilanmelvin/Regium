import type { Localization, LocalizedString } from "../types/index.js";
import { formatCurrency, formatDate, formatNumber, resolveLocalized } from "../utils/index.js";

export interface LocalizationContext {
  locale: string;
  localization?: Localization;
  currency?: string;
}

/** Resolve a localized string for a context. */
export function t(value: LocalizedString, ctx: LocalizationContext): string {
  return resolveLocalized(value, ctx.locale);
}

/** Format an amount in a context-aware way. */
export function money(amount: number, ctx: LocalizationContext, decimals?: number): string {
  const currency = ctx.currency ?? "USD";
  return formatCurrency(amount, currency, ctx.locale, decimals);
}

/** Format a number with locale separators. */
export function num(
  value: number,
  ctx: LocalizationContext,
  options?: Intl.NumberFormatOptions,
): string {
  return formatNumber(value, ctx.locale, options);
}

/** Format an ISO date with the country's date format. */
export function date(iso: string, ctx: LocalizationContext): string {
  const pattern = ctx.localization?.dateFormats.medium ?? "YYYY-MM-DD";
  return formatDate(iso, pattern);
}

/** Tiny ICU-like interpolation: "Hello, {name}". */
export function interpolate(template: string, params: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const v = params[key];
    return v === undefined ? `{${key}}` : String(v);
  });
}

export type { Localization, LocalizedString };
