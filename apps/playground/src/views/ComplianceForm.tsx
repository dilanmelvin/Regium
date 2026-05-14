import { useRegiumForm } from "@regium/react";
import { useState } from "react";

export function ComplianceForm({ country }: { country: string }) {
  const [audience, setAudience] = useState<"company" | "employee">("employee");
  const form = useRegiumForm({ country, audience, locale: "en" });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.validate();
  };

  return (
    <div>
      <div className="page-header">
        <h1>Dynamic compliance form</h1>
        <p>Generated from country metadata. Fields and validators are resolved at runtime.</p>
      </div>

      <div className="card">
        <div className="card__header">
          <div>
            <div className="card__title">
              {audience === "company" ? "Company" : "Employee"} fields — {country}
            </div>
            <div className="card__subtitle">{form.fields.length} fields generated</div>
          </div>
          <div className="btn-row" style={{ margin: 0 }}>
            <button
              type="button"
              className="btn"
              data-active={audience === "employee"}
              onClick={() => setAudience("employee")}
              style={
                audience === "employee"
                  ? { background: "#0f172a", color: "#fff", borderColor: "#0f172a" }
                  : undefined
              }
            >
              Employee
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => setAudience("company")}
              style={
                audience === "company"
                  ? { background: "#0f172a", color: "#fff", borderColor: "#0f172a" }
                  : undefined
              }
            >
              Company
            </button>
          </div>
        </div>
        <div className="card__body">
          <form onSubmit={onSubmit}>
            {form.fields.map((f) => {
              const label = typeof f.label === "string" ? f.label : (f.label.en ?? f.id);
              const errors = form.errors[f.id];
              const inputId = `field-${f.id}`;
              return (
                <div key={f.id} className="field">
                  <label className="field__label" htmlFor={inputId}>
                    {label}
                    {f.required && <span className="field__required">*</span>}
                  </label>
                  <input
                    id={inputId}
                    className="input input--mono"
                    value={form.values[f.id] ?? ""}
                    onChange={(e) => form.setValue(f.id, e.target.value)}
                    placeholder={f.example ?? ""}
                    data-error={errors !== undefined && errors.length > 0}
                  />
                  <div className="field__hint">
                    {f.issuingAuthority && <>Issuer: {f.issuingAuthority} · </>}
                    {f.example && (
                      <>
                        Example: <span className="mono">{f.example}</span>
                      </>
                    )}
                  </div>
                  {errors && errors.length > 0 && (
                    <div className="field__error">{errors.join(" · ")}</div>
                  )}
                </div>
              );
            })}

            <div className="btn-row">
              <button className="btn btn--primary" type="submit">
                Validate form
              </button>
              <button className="btn btn--ghost" type="button" onClick={form.reset}>
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
