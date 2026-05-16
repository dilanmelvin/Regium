/**
 * Format a number as a currency string for the given locale.
 * Falls back gracefully if Intl.NumberFormat is unavailable.
 */
export function formatCurrency(
  amount: number,
  currency: string,
  locale = "en-US",
  decimals?: number,
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(decimals ?? 2)}`;
  }
}

/** Format a number with locale-aware separators. */
export function formatNumber(
  value: number,
  locale = "en-US",
  options?: Intl.NumberFormatOptions,
): string {
  try {
    return new Intl.NumberFormat(locale, options).format(value);
  } catch {
    return String(value);
  }
}

/** Round to a given number of decimal places without floating-point drift. */
export function round(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}
