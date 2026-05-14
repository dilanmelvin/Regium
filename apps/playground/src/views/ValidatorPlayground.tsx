import { useRegium } from "@regium/react";
import { useEffect, useMemo, useState } from "react";

export function ValidatorPlayground({ country }: { country: string }) {
  const regium = useRegium();
  const fields = useMemo(() => {
    const company = regium.getCompanyFields(country);
    const employee = regium.getEmployeeFields(country);
    return [...company, ...employee].filter((f) => (f.validatorIds ?? []).length > 0);
  }, [country, regium]);

  const [fieldId, setFieldId] = useState(fields[0]?.id ?? "");
  const [value, setValue] = useState(fields[0]?.example ?? "");
  const [result, setResult] = useState<{
    ok: boolean;
    errors: string[];
    normalized?: string;
  } | null>(null);

  // Reset when country changes.
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional reset on country change
  useEffect(() => {
    setFieldId(fields[0]?.id ?? "");
    setValue(fields[0]?.example ?? "");
    setResult(null);
  }, [country]);

  const onValidate = () => {
    if (!fieldId) return;
    try {
      const r = regium.validate({ country, field: fieldId, value });
      setResult({
        ok: r.ok,
        errors: r.errors.map((e) => `${e.code}: ${e.message}`),
        normalized: r.normalized,
      });
    } catch (e) {
      setResult({ ok: false, errors: [(e as Error).message] });
    }
  };

  const selected = fields.find((f) => f.id === fieldId);

  return (
    <div>
      <div className="page-header">
        <h1>Validator playground</h1>
        <p>
          Try any compliance ID for {country}. Validators are fully deterministic and tree-shakable.
        </p>
      </div>

      <div className="card">
        <div className="card__body">
          <div className="row-2">
            <div className="field">
              <label className="field__label" htmlFor="vp-field">
                Field
              </label>
              <select
                id="vp-field"
                className="select"
                value={fieldId}
                onChange={(e) => {
                  setFieldId(e.target.value);
                  const f = fields.find((x) => x.id === e.target.value);
                  setValue(f?.example ?? "");
                  setResult(null);
                }}
              >
                {fields.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.id} — {typeof f.label === "string" ? f.label : (f.label.en ?? f.id)}
                  </option>
                ))}
              </select>
              {selected?.issuingAuthority && (
                <div className="field__hint">Issued by {selected.issuingAuthority}</div>
              )}
            </div>

            <div className="field">
              <label className="field__label" htmlFor="vp-value">
                Value
              </label>
              <input
                id="vp-value"
                className="input input--mono"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={selected?.example}
              />
              {selected?.example && (
                <div className="field__hint">
                  Example: <span className="mono">{selected.example}</span>
                </div>
              )}
            </div>
          </div>

          <div className="btn-row">
            <button type="button" className="btn btn--primary" onClick={onValidate}>
              Validate
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                setValue("");
                setResult(null);
              }}
            >
              Clear
            </button>
          </div>

          {result && (
            <div className="result" data-status={result.ok ? "ok" : "error"}>
              {result.ok ? "✓ Valid" : "✗ Invalid"}
              {result.normalized && `\nnormalized: ${result.normalized}`}
              {result.errors.length > 0 && `\n\n${result.errors.join("\n")}`}
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card__header">
          <div>
            <div className="card__title">Available validators</div>
            <div className="card__subtitle">Fields with attached validators for {country}</div>
          </div>
        </div>
        <div className="card__body" style={{ padding: 0 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Field</th>
                <th>Category</th>
                <th>Validators</th>
                <th>Example</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((f) => (
                <tr key={f.id}>
                  <td>{f.id}</td>
                  <td>{f.category}</td>
                  <td className="mono subtle">{(f.validatorIds ?? []).join(", ")}</td>
                  <td className="mono">{f.example ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
