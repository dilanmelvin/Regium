import type { TaxRegime, TaxRules } from "@regium/types";
import { round } from "@regium/utils";

export interface TaxComputation {
  taxableIncome: number;
  baseTax: number;
  surcharge: number;
  cess: number;
  totalTax: number;
  effectiveRate: number;
  regimeId: string;
  breakdown: {
    from: number;
    to: number | null;
    rate: number;
    portion: number;
    tax: number;
  }[];
}

export interface ComputeTaxOptions {
  /** Pre-deduction income for the period covered by the regime. */
  income: number;
  rules: TaxRules;
  /** Regime to use; defaults to `defaultRegimeId`. */
  regimeId?: string;
}

/**
 * Compute tax payable using slab-based progressive taxation.
 * Supports surcharges and cess.
 */
export function computeTax(opts: ComputeTaxOptions): TaxComputation {
  const regime = pickRegime(opts.rules, opts.regimeId);
  const standardDeduction = regime.standardDeduction ?? 0;
  const taxable = Math.max(0, opts.income - standardDeduction);

  let baseTax = 0;
  const breakdown: TaxComputation["breakdown"] = [];
  for (const slab of regime.slabs) {
    const upper = slab.to ?? Number.POSITIVE_INFINITY;
    if (taxable <= slab.from) {
      breakdown.push({ from: slab.from, to: slab.to, rate: slab.rate, portion: 0, tax: 0 });
      continue;
    }
    const portion = Math.min(taxable, upper) - slab.from;
    const slabTax = round((portion * slab.rate) / 100, 2) + (slab.fixedAmount ?? 0);
    baseTax += slabTax;
    breakdown.push({
      from: slab.from,
      to: slab.to,
      rate: slab.rate,
      portion: round(portion, 2),
      tax: round(slabTax, 2),
    });
    if (taxable <= upper) break;
  }

  let surcharge = 0;
  for (const sc of opts.rules.surcharges ?? []) {
    if (taxable >= sc.threshold) {
      surcharge = round((baseTax * sc.rate) / 100, 2);
      break;
    }
  }
  const cess = opts.rules.cessRate
    ? round(((baseTax + surcharge) * opts.rules.cessRate) / 100, 2)
    : 0;
  const totalTax = round(baseTax + surcharge + cess, 2);
  const effectiveRate = taxable === 0 ? 0 : round((totalTax / taxable) * 100, 2);

  return {
    taxableIncome: round(taxable, 2),
    baseTax: round(baseTax, 2),
    surcharge,
    cess,
    totalTax,
    effectiveRate,
    regimeId: regime.id,
    breakdown,
  };
}

export function pickRegime(rules: TaxRules, regimeId?: string): TaxRegime {
  const id = regimeId ?? rules.defaultRegimeId;
  const found = rules.regimes.find((r) => r.id === id);
  if (!found) throw new Error(`Tax regime "${id}" not found`);
  return found;
}

export type { TaxRules, TaxRegime };
