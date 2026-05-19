import { computeTax } from "../tax/index.js";
import type { PayrollRules, SalaryComponent, TaxRules } from "../types/index.js";
import { round } from "../utils/index.js";

export interface PayrollInput {
  /** Annual gross salary in country currency. */
  annualGross: number;
  rules: PayrollRules;
  taxRules?: TaxRules;
  /** Per-component overrides keyed by component id. */
  overrides?: Record<string, number>;
  /** Tax regime id to use. */
  regimeId?: string;
}

export interface PayrollLine {
  id: string;
  type: SalaryComponent["type"];
  amount: number;
}

export interface PayrollResult {
  annualGross: number;
  monthlyGross: number;
  earnings: PayrollLine[];
  deductions: PayrollLine[];
  employerContributions: PayrollLine[];
  taxAnnual: number;
  taxMonthly: number;
  netAnnual: number;
  netMonthly: number;
  totalEmployerCost: number;
  currency?: string;
}

/**
 * Compute a deterministic gross→net pay slip for a single employee.
 * The computation is intentionally simplified but covers the major levers:
 * earnings, statutory contributions, tax, employer cost.
 */
export function computePayroll(input: PayrollInput): PayrollResult {
  const annualGross = input.annualGross;
  const monthlyGross = round(annualGross / 12, 2);

  const earnings: PayrollLine[] = [];
  const deductions: PayrollLine[] = [];
  const employerContributions: PayrollLine[] = [];

  // Earnings — only `earning` components contribute to the gross they describe;
  // for our simple model, the input is already the gross, so we record the
  // structure of the "Basic" / allowance breakdown if components are defined.
  const components = input.rules.components ?? [];
  const earningComponents = components.filter(
    (c) => c.type === "earning" || c.type === "allowance",
  );
  if (earningComponents.length > 0) {
    let allocated = 0;
    for (const c of earningComponents) {
      const override = input.overrides?.[c.id];
      let amount = override ?? 0;
      if (override === undefined && c.computation === "percent-of-gross" && c.defaultRate) {
        amount = round((monthlyGross * c.defaultRate) / 100, 2);
      } else if (override === undefined && c.computation === "fixed" && c.defaultRate) {
        amount = c.defaultRate;
      }
      if (amount > 0) {
        earnings.push({ id: c.id, type: c.type, amount });
        allocated += amount;
      }
    }
    // Residual earnings if any.
    const residual = round(monthlyGross - allocated, 2);
    if (residual > 0) earnings.push({ id: "residual", type: "earning", amount: residual });
  } else {
    earnings.push({ id: "gross", type: "earning", amount: monthlyGross });
  }

  // Contributions
  for (const ctr of input.rules.contributions ?? []) {
    const base = ctr.ceiling ? Math.min(monthlyGross, ctr.ceiling) : monthlyGross;
    if (ctr.floor && monthlyGross < ctr.floor) continue;
    const amount = round((base * ctr.rate) / 100, 2);
    if (amount === 0) continue;
    if (ctr.payer === "employee" || ctr.payer === "both") {
      deductions.push({ id: ctr.id, type: "employee-contribution", amount });
    }
    if (ctr.payer === "employer" || ctr.payer === "both") {
      employerContributions.push({ id: ctr.id, type: "employer-contribution", amount });
    }
  }

  // Tax
  let taxAnnual = 0;
  if (input.taxRules) {
    const tax = computeTax({
      income: annualGross,
      rules: input.taxRules,
      regimeId: input.regimeId,
    });
    taxAnnual = tax.totalTax;
    deductions.push({ id: "tax", type: "tax", amount: round(taxAnnual / 12, 2) });
  }

  const taxMonthly = round(taxAnnual / 12, 2);
  const totalEmployeeDeductions = deductions.reduce((s, d) => s + d.amount, 0);
  const netMonthly = round(monthlyGross - totalEmployeeDeductions, 2);
  const netAnnual = round(netMonthly * 12, 2);
  const totalEmployerCost = round(
    annualGross + employerContributions.reduce((s, c) => s + c.amount, 0) * 12,
    2,
  );

  return {
    annualGross,
    monthlyGross,
    earnings,
    deductions,
    employerContributions,
    taxAnnual,
    taxMonthly,
    netAnnual,
    netMonthly,
    totalEmployerCost,
    currency: input.rules.currency,
  };
}

export type { PayrollRules };
