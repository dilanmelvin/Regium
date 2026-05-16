import type { ISODate } from "../types/index.js";

/** Convert a `Date` or ISO string to canonical YYYY-MM-DD. */
export function toISODate(value: Date | string): ISODate {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) {
    throw new Error(`Invalid date: ${String(value)}`);
  }
  const yyyy = d.getUTCFullYear().toString().padStart(4, "0");
  const mm = (d.getUTCMonth() + 1).toString().padStart(2, "0");
  const dd = d.getUTCDate().toString().padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/** Compare two ISO dates. Returns -1 / 0 / 1. */
export function compareISODates(a: ISODate, b: ISODate): -1 | 0 | 1 {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

/** Today as ISO date (UTC). */
export function today(): ISODate {
  return toISODate(new Date());
}

/** Format an ISO date according to a country's date format token. */
export function formatDate(date: ISODate, pattern: string): string {
  const [yyyy, mm, dd] = date.split("-");
  if (!yyyy || !mm || !dd) return date;
  return pattern.replace(/YYYY/g, yyyy).replace(/MM/g, mm).replace(/DD/g, dd);
}

/** Add days to an ISO date (returns new ISO date). */
export function addDays(date: ISODate, days: number): ISODate {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return toISODate(d);
}

/** Difference in days between two ISO dates (b - a). */
export function diffDays(a: ISODate, b: ISODate): number {
  const da = new Date(`${a}T00:00:00Z`).getTime();
  const db = new Date(`${b}T00:00:00Z`).getTime();
  return Math.round((db - da) / 86_400_000);
}
