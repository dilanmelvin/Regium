import { useRegium } from "@regium/react";

export function CountryOverview({ country }: { country: string }) {
  const regium = useRegium();
  const c = regium.getCountryConfig(country);
  const banking = regium.getBankingRules(country);
  const tax = regium.getTaxRules(country);
  const labor = regium.getLaborRules(country);
  const localization = regium.getLocalization(country);

  return (
    <div>
      <div className="page-header">
        <h1>{c.name}</h1>
        <p>
          {c.officialName} · {c.iso2} · {c.iso3} · {c.phoneCode}
        </p>
      </div>

      <div className="row-2">
        <div className="card">
          <div className="card__header">
            <div>
              <div className="card__title">Country profile</div>
              <div className="card__subtitle">Authoritative metadata</div>
            </div>
          </div>
          <div className="card__body">
            <dl className="kv">
              <dt>Currency</dt>
              <dd>
                {c.currency.code} ({c.currency.symbol}) — {c.currency.name}
              </dd>
              <dt>Languages</dt>
              <dd>{c.officialLanguages.join(", ")}</dd>
              <dt>Timezones</dt>
              <dd>{c.timezones.join(", ")}</dd>
              <dt>Legal system</dt>
              <dd>{c.legalSystem}</dd>
              <dt>Payroll region</dt>
              <dd>{c.payrollRegion}</dd>
              <dt>Date format</dt>
              <dd className="mono">{c.dateFormat}</dd>
              <dt>Tax authority</dt>
              <dd>{c.primaryTaxAuthority}</dd>
            </dl>
          </div>
        </div>

        <div className="card">
          <div className="card__header">
            <div>
              <div className="card__title">Tax & labor snapshot</div>
              <div className="card__subtitle">Effective today</div>
            </div>
          </div>
          <div className="card__body">
            <dl className="kv">
              <dt>Tax authority</dt>
              <dd>{tax.authority}</dd>
              <dt>Default regime</dt>
              <dd>{tax.defaultRegimeId}</dd>
              <dt>Standard hours</dt>
              <dd>{labor.standardWeeklyHours ?? "—"} hr/week</dd>
              <dt>Max hours</dt>
              <dd>{labor.maxWeeklyHours ?? "—"} hr/week</dd>
              <dt>Banking format</dt>
              <dd>{banking.primaryFormat}</dd>
              <dt>Real-time scheme</dt>
              <dd>{banking.realTimeScheme ?? "—"}</dd>
              <dt>Default locale</dt>
              <dd>{localization.defaultLocale}</dd>
            </dl>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card__header">
          <div>
            <div className="card__title">Leave policies</div>
            <div className="card__subtitle">Statutory minimums</div>
          </div>
        </div>
        <div className="card__body" style={{ padding: 0 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Min days/year</th>
                <th>Paid</th>
                <th>Eligibility (days)</th>
              </tr>
            </thead>
            <tbody>
              {(labor.leavePolicies ?? []).map((p) => (
                <tr key={p.type}>
                  <td>{typeof p.name === "string" ? p.name : (p.name.en ?? p.type)}</td>
                  <td className="mono">{p.minDaysPerYear}</td>
                  <td>{p.paid ? "Yes" : "No"}</td>
                  <td className="mono">{p.eligibilityDays}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
