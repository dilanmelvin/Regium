import { computePayroll } from "@regium/payroll";
import { useRegium } from "@regium/react";
import { formatCurrency } from "@regium/utils";
import { useMemo, useState } from "react";

export function PayrollSimulator({ country }: { country: string }) {
  const regium = useRegium();
  const c = regium.getCountryConfig(country);
  const payrollRules = regium.getPayrollRules(country);
  const taxRules = regium.getTaxRules(country);

  const [grossInput, setGrossInput] = useState("1200000");
  const annualGross = Number(grossInput.replace(/[^\d.]/g, "")) || 0;

  const result = useMemo(
    () => computePayroll({ annualGross, rules: payrollRules, taxRules }),
    [annualGross, payrollRules, taxRules],
  );

  const fmt = (n: number) => formatCurrency(n, c.currency.code, c.officialLanguages[0] ?? "en");

  return (
    <div>
      <div className="page-header">
        <h1>Payroll simulator</h1>
        <p>Deterministic gross→net using {country} payroll & tax metadata.</p>
      </div>

      <div className="card">
        <div className="card__body">
          <div className="field">
            <label className="field__label" htmlFor="payroll-gross">
              Annual gross ({c.currency.code})
            </label>
            <input
              id="payroll-gross"
              className="input input--mono"
              value={grossInput}
              onChange={(e) => setGrossInput(e.target.value)}
              inputMode="decimal"
            />
            <div className="field__hint">Default frequency: {payrollRules.defaultFrequency}</div>
          </div>
        </div>
      </div>

      <div className="row-2">
        <div className="card">
          <div className="card__header">
            <div className="card__title">Summary</div>
          </div>
          <div className="card__body">
            <dl className="kv">
              <dt>Annual gross</dt>
              <dd className="mono">{fmt(result.annualGross)}</dd>
              <dt>Monthly gross</dt>
              <dd className="mono">{fmt(result.monthlyGross)}</dd>
              <dt>Annual tax</dt>
              <dd className="mono">{fmt(result.taxAnnual)}</dd>
              <dt>Monthly tax</dt>
              <dd className="mono">{fmt(result.taxMonthly)}</dd>
              <dt>Net (annual)</dt>
              <dd className="mono">
                <span className="tag tag--success">{fmt(result.netAnnual)}</span>
              </dd>
              <dt>Net (monthly)</dt>
              <dd className="mono">
                <span className="tag tag--success">{fmt(result.netMonthly)}</span>
              </dd>
              <dt>Total employer cost</dt>
              <dd className="mono">{fmt(result.totalEmployerCost)}</dd>
            </dl>
          </div>
        </div>

        <div className="card">
          <div className="card__header">
            <div className="card__title">Deductions (monthly)</div>
          </div>
          <div className="card__body" style={{ padding: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Component</th>
                  <th>Type</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {result.deductions.length === 0 && (
                  <tr>
                    <td colSpan={3} className="muted">
                      No deductions configured.
                    </td>
                  </tr>
                )}
                {result.deductions.map((d, i) => (
                  <tr key={`${d.id}-${i}`}>
                    <td>{d.id}</td>
                    <td className="muted">{d.type}</td>
                    <td className="mono">{fmt(d.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card__header">
          <div className="card__title">Employer contributions (monthly)</div>
        </div>
        <div className="card__body" style={{ padding: 0 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Component</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {result.employerContributions.length === 0 && (
                <tr>
                  <td colSpan={2} className="muted">
                    No employer contributions configured.
                  </td>
                </tr>
              )}
              {result.employerContributions.map((d, i) => (
                <tr key={`${d.id}-${i}`}>
                  <td>{d.id}</td>
                  <td className="mono">{fmt(d.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
