/**
 * Regium Experience Centre
 * Interactive explorer for 218 countries.
 */
(async function () {
  "use strict";

  // ─── Load data ───────────────────────────────────────────────────────
  let regiumData = null;
  try {
    const res = await fetch("/regium-data.json");
    if (!res.ok) throw new Error("HTTP " + res.status);
    regiumData = await res.json();
  } catch (err) {
    document.getElementById("exp-info").textContent = "Error loading data. Run pnpm build first.";
    return;
  }
  if (!regiumData.countries || !regiumData.countries.length) return;

  // ─── Helpers ─────────────────────────────────────────────────────────
  const sorted = regiumData.countries.slice().sort((a, b) => a.name.localeCompare(b.name));

  function getCountry(iso) { return sorted.find((c) => c.iso2 === iso); }

  function label(v) {
    if (typeof v === "string") return v;
    if (!v) return "—";
    return v.en || v[Object.keys(v)[0]] || "—";
  }

  function esc(s) {
    return String(s || "—").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  // ─── Dropdown ────────────────────────────────────────────────────────
  const select = document.getElementById("exp-country");

  function populateDropdown(list) {
    select.innerHTML = list.map((c) =>
      `<option value="${c.iso2}">${esc(c.name)} · ${c.iso2} · ${c.currency.code}${c.tier === "T1" ? " ★" : ""}</option>`
    ).join("");
  }
  populateDropdown(sorted);

  // ─── Search ──────────────────────────────────────────────────────────
  document.getElementById("exp-search").addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase().trim();
    const filtered = q ? sorted.filter((c) =>
      c.name.toLowerCase().includes(q) || c.iso2.toLowerCase().includes(q) ||
      c.iso3.toLowerCase().includes(q) || c.currency.code.toLowerCase().includes(q)
    ) : sorted;
    populateDropdown(filtered);
    if (select.options.length > 0) { select.selectedIndex = 0; onCountryChange(select.value); }
  });

  // ─── Tabs ────────────────────────────────────────────────────────────
  document.querySelectorAll(".exp-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".exp-tab").forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".exp-panel").forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      const panel = document.getElementById("panel-" + tab.dataset.tab);
      if (panel) panel.classList.add("active");
    });
  });

  // ─── Overview ────────────────────────────────────────────────────────
  function renderOverview(c) {
    document.getElementById("overview-grid").innerHTML = [
      ["Country", c.name], ["Official name", c.officialName],
      ["ISO codes", `${c.iso2} · ${c.iso3} · ${c.isoNumeric}`],
      ["Phone code", c.phoneCode], ["Currency", `${c.currency.code} (${c.currency.symbol})`],
      ["Timezones", c.timezones.join(", ")], ["Languages", c.officialLanguages.join(", ")],
      ["Payroll region", c.payrollRegion], ["Legal system", c.legalSystem],
      ["Week starts", c.weekStart], ["Date format", c.dateFormat],
      ["Tax authority", c.primaryTaxAuthority],
    ].map(([k, v]) =>
      `<div class="exp-card"><div class="exp-card__label">${esc(k)}</div><div class="exp-card__value">${esc(v)}</div></div>`
    ).join("");
  }

  // ─── Fields table ────────────────────────────────────────────────────
  function renderFields(fields, id) {
    const wrap = document.getElementById(id);
    if (!fields || !fields.length) {
      wrap.innerHTML = '<p style="padding:20px;color:var(--text-subtle)">No detailed fields for this country yet (T4 stub).</p>';
      return;
    }
    wrap.innerHTML = `<table class="exp-table"><thead><tr>
      <th>ID</th><th>Label</th><th>Category</th><th>Required</th><th>Sensitivity</th><th>Validators</th><th>Example</th>
    </tr></thead><tbody>${fields.map((f) => `<tr>
      <td class="mono">${esc(f.id)}</td>
      <td>${esc(label(f.label))}</td>
      <td>${esc(f.category)}</td>
      <td>${f.required ? '<span class="badge badge--required">Required</span>' : '<span class="badge badge--optional">Optional</span>'}</td>
      <td>${f.sensitivity === "pii" ? '<span class="badge badge--pii">PII</span>' : esc(f.sensitivity || "—")}</td>
      <td class="mono">${esc((f.validatorIds || []).join(", ") || "—")}</td>
      <td class="mono">${esc(f.example || "—")}</td>
    </tr>`).join("")}</tbody></table>`;
  }

  // ─── Validate ────────────────────────────────────────────────────────
  function renderValidate(c) {
    const all = [...(c.companyFields || []), ...(c.employeeFields || [])];
    const sel = document.getElementById("val-field");
    if (!all.length) {
      sel.innerHTML = "<option disabled>No validatable fields</option>";
      return;
    }
    sel.innerHTML = all.map((f) =>
      `<option value="${esc(f.id)}" data-example="${esc(f.example || "")}">${esc(f.id)} — ${esc(label(f.label))}</option>`
    ).join("");
    document.getElementById("val-value").value = all[0]?.example || "";
    document.getElementById("val-result").textContent = "Select a field, enter a value, and click Validate.";
    document.getElementById("val-result").className = "exp-validate__result";
  }

  document.getElementById("val-btn").addEventListener("click", () => {
    const fieldId = document.getElementById("val-field").value;
    const value = document.getElementById("val-value").value.trim();
    const resultEl = document.getElementById("val-result");
    if (!value) { resultEl.textContent = "Please enter a value."; resultEl.className = "exp-validate__result"; return; }

    const c = getCountry(select.value);
    if (!c) return;
    const all = [...(c.companyFields || []), ...(c.employeeFields || [])];
    const field = all.find((f) => f.id === fieldId);

    if (!field || !(field.validatorIds || []).length) {
      resultEl.textContent = `✓ No validator attached to "${fieldId}" — accepted as-is.`;
      resultEl.className = "exp-validate__result ok";
      return;
    }

    const validators = regiumData.validators || {};
    let ok = true; const errors = []; let normalized = value;
    for (const vid of field.validatorIds) {
      const v = validators[vid];
      if (!v || !v.pattern) continue;
      const test = v.canonical ? value.replace(/[^A-Za-z0-9]/g, "").toUpperCase() : value.trim();
      normalized = test;
      if (!new RegExp(v.pattern, v.flags || "").test(test)) {
        ok = false; errors.push(`${vid}: Format mismatch`);
      }
    }
    resultEl.textContent = ok
      ? `✓ Valid\n\nField: ${fieldId}\nValue: ${value}\nNormalized: ${normalized}\nValidators: ${field.validatorIds.join(", ")}`
      : `✗ Invalid\n\nField: ${fieldId}\nValue: ${value}\n\nErrors:\n${errors.join("\n")}`;
    resultEl.className = "exp-validate__result " + (ok ? "ok" : "error");
  });

  document.getElementById("val-field").addEventListener("change", (e) => {
    document.getElementById("val-value").value = e.target.selectedOptions[0]?.getAttribute("data-example") || "";
    document.getElementById("val-result").textContent = "Select a field, enter a value, and click Validate.";
    document.getElementById("val-result").className = "exp-validate__result";
  });

  // ─── Payroll ─────────────────────────────────────────────────────────
  function renderPayroll(c) {
    const grid = document.getElementById("payroll-grid");
    const p = c.payrollRules || {}, t = c.taxRules || {}, l = c.laborRules || {};
    let html = "";

    const summary = [
      ["Frequency", p.defaultFrequency || "monthly"],
      ["Currency", p.currency || c.currency?.code || "—"],
      ["Hours/day", p.workingHoursPerDay || "—"],
      ["Days/month", p.workingDaysPerMonth || "—"],
      ["Overtime", p.overtimeMandatory ? `Yes (${p.overtimeMultiplier || 1}×)` : "No"],
      ["13th month", p.thirteenthMonth ? "Yes" : "No"],
      ["Tax authority", t.authority || c.primaryTaxAuthority || "—"],
      ["Tax year", t.taxYearStart || "01-01"],
      ["Default regime", t.defaultRegimeId || "—"],
      ["Std hours/week", l.standardWeeklyHours || "—"],
      ["Max hours/week", l.maxWeeklyHours || "—"],
      ["Min notice (days)", l.termination?.minNoticeDays ?? "—"],
      ["Severance", l.termination?.severanceMandatory ? "Yes" : "No"],
    ];

    html += '<h3 class="exp-section-title">Summary</h3><div class="exp-grid">';
    html += summary.map(([k, v]) =>
      `<div class="exp-card"><div class="exp-card__label">${esc(k)}</div><div class="exp-card__value exp-card__value--mono">${esc(String(v))}</div></div>`
    ).join("") + "</div>";

    if ((p.contributions || []).length) {
      html += '<h3 class="exp-section-title">Statutory contributions</h3><div class="exp-table-wrap"><table class="exp-table"><thead><tr><th>ID</th><th>Name</th><th>Payer</th><th>Rate</th><th>Ceiling</th><th>Authority</th></tr></thead><tbody>';
      html += p.contributions.map((c) =>
        `<tr><td class="mono">${esc(c.id)}</td><td>${esc(label(c.name))}</td><td>${esc(c.payer)}</td><td class="mono">${c.rate}%</td><td class="mono">${c.ceiling ? c.ceiling.toLocaleString() : "—"}</td><td>${esc(c.authority || "—")}</td></tr>`
      ).join("") + "</tbody></table></div>";
    }

    if ((t.regimes || []).length) {
      html += '<h3 class="exp-section-title">Tax regimes & slabs</h3>';
      for (const r of t.regimes) {
        html += `<div class="exp-regime-header">${esc(label(r.name))}${r.id === t.defaultRegimeId ? ' <span class="badge badge--required">Default</span>' : ""}</div>`;
        if (r.standardDeduction) html += `<p class="exp-regime-note">Standard deduction: ${r.currency} ${r.standardDeduction.toLocaleString()}</p>`;
        html += '<div class="exp-table-wrap"><table class="exp-table"><thead><tr><th>From</th><th>To</th><th>Rate</th></tr></thead><tbody>';
        html += (r.slabs || []).map((s) =>
          `<tr><td class="mono">${s.from.toLocaleString()}</td><td class="mono">${s.to ? s.to.toLocaleString() : "∞"}</td><td class="mono">${s.rate}%</td></tr>`
        ).join("") + "</tbody></table></div>";
      }
    }

    if ((l.leavePolicies || []).length) {
      html += '<h3 class="exp-section-title">Leave policies</h3><div class="exp-table-wrap"><table class="exp-table"><thead><tr><th>Type</th><th>Name</th><th>Min days/yr</th><th>Paid</th></tr></thead><tbody>';
      html += l.leavePolicies.map((lv) =>
        `<tr><td>${esc(lv.type)}</td><td>${esc(label(lv.name))}</td><td class="mono">${lv.minDaysPerYear}</td><td>${lv.paid ? "Yes" : "No"}</td></tr>`
      ).join("") + "</tbody></table></div>";
    }

    grid.innerHTML = html || '<p style="color:var(--text-subtle)">No detailed payroll data (T4 stub).</p>';
  }

  // ─── Code generator ──────────────────────────────────────────────────
  function syntaxHL(code) {
    // Escape HTML first
    let s = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    // Comments (must come before strings to avoid double-processing)
    s = s.replace(/(\/\/[^\n]*)/g, '<span class="cg-cmt">$1</span>');
    // Strings
    s = s.replace(/"([^"\\]|\\.)*"/g, (m) => `<span class="cg-str">${m}</span>`);
    // Keywords
    s = s.replace(/\b(import|export|from|const|let|var|function|return|if|else|async|await|new|typeof|true|false|null|undefined)\b/g,
      '<span class="cg-kw">$1</span>');
    // Numbers
    s = s.replace(/\b(\d[\d_]*)\b/g, '<span class="cg-num">$1</span>');
    // Function calls
    s = s.replace(/([a-zA-Z_$][\w$]*)(?=\s*\()/g, '<span class="cg-fn">$1</span>');
    return s;
  }

  function lineNumbers(code) {
    const n = code.split("\n").length;
    return Array.from({ length: n }, (_, i) => i + 1).join("\n");
  }

  const CODE_SNIPPETS = {
    full: (iso, c) => `import { createRegium } from "@regium/core";
import ${iso.toLowerCase()} from "@regium/data/${iso.toLowerCase()}";

const regium = createRegium({ plugins: [${iso.toLowerCase()}] });

// Country profile
const config = regium.getCountryConfig("${iso}");
console.log(config.name);        // "${c?.name || iso}"
console.log(config.currency);    // { code: "${c?.currency?.code || "USD"}", symbol: "${c?.currency?.symbol || "$"}" }

// Employee fields
const empFields = regium.getEmployeeFields("${iso}");
console.log(empFields.map(f => f.id));

// Company fields
const coFields = regium.getCompanyFields("${iso}");
console.log(coFields.map(f => f.id));

// Payroll rules
const payroll = regium.getPayrollRules("${iso}");
console.log(payroll.defaultFrequency);

// Tax rules
const tax = regium.getTaxRules("${iso}");
console.log(tax.authority); // "${c?.primaryTaxAuthority || "Tax Authority"}"`,

    validate: (iso, c) => `import { createRegium } from "@regium/core";
import ${iso.toLowerCase()} from "@regium/data/${iso.toLowerCase()}";

const regium = createRegium({ plugins: [${iso.toLowerCase()}] });

// Get all fields that have validators
const fields = [
  ...regium.getCompanyFields("${iso}"),
  ...regium.getEmployeeFields("${iso}"),
].filter(f => (f.validatorIds || []).length > 0);

// Validate a field
const result = regium.validate({
  country: "${iso}",
  field: fields[0]?.id ?? "NationalID",
  value: fields[0]?.example ?? "example",
});

console.log(result.ok);          // true / false
console.log(result.normalized);  // canonical form
console.log(result.errors);      // [] if valid`,

    employee: (iso) => `import { createRegium } from "@regium/core";
import ${iso.toLowerCase()} from "@regium/data/${iso.toLowerCase()}";

// Option 1: Full SDK
const regium = createRegium({ plugins: [${iso.toLowerCase()}] });
const fields = regium.getEmployeeFields("${iso}");
fields.forEach(f => console.log(f.id, f.category));

// Option 2: Granular subpath — ~1 KB only
import { data as empFields } from "@regium/data/${iso.toLowerCase()}/employee";
console.log(empFields);`,

    company: (iso) => `import { createRegium } from "@regium/core";
import ${iso.toLowerCase()} from "@regium/data/${iso.toLowerCase()}";

// Option 1: Full SDK
const regium = createRegium({ plugins: [${iso.toLowerCase()}] });
const fields = regium.getCompanyFields("${iso}");
fields.forEach(f => console.log(f.id, f.issuingAuthority));

// Option 2: Granular subpath — ~1 KB only
import { data as coFields } from "@regium/data/${iso.toLowerCase()}/company";
console.log(coFields);`,

    payroll: (iso) => `import { createRegium } from "@regium/core";
import { computePayroll } from "@regium/core/payroll";
import ${iso.toLowerCase()} from "@regium/data/${iso.toLowerCase()}";

const regium = createRegium({ plugins: [${iso.toLowerCase()}] });

const result = computePayroll({
  annualGross: 1200000,
  rules: regium.getPayrollRules("${iso}"),
  taxRules: regium.getTaxRules("${iso}"),
});

console.log("Monthly gross:  ", result.monthlyGross);
console.log("Monthly net:    ", result.netMonthly);
console.log("Annual tax:     ", result.taxAnnual);
console.log("Employer cost:  ", result.totalEmployerCost);
console.log("Deductions:     ", result.deductions);`,

    tax: (iso) => `import { createRegium } from "@regium/core";
import { computeTax } from "@regium/core/tax";
import ${iso.toLowerCase()} from "@regium/data/${iso.toLowerCase()}";

const regium = createRegium({ plugins: [${iso.toLowerCase()}] });
const taxRules = regium.getTaxRules("${iso}");

const result = computeTax({
  income: 1200000,
  rules: taxRules,
  regimeId: taxRules.defaultRegimeId,
});

console.log("Taxable income:", result.taxableIncome);
console.log("Total tax:     ", result.totalTax);
console.log("Effective rate:", result.effectiveRate + "%");
console.log("Breakdown:     ", result.breakdown);`,

    banking: (iso) => `import { createRegium } from "@regium/core";
import { createBanking } from "@regium/core/banking";
import ${iso.toLowerCase()} from "@regium/data/${iso.toLowerCase()}";

const regium = createRegium({ plugins: [${iso.toLowerCase()}] });
const rules = regium.getBankingRules("${iso}");

console.log("Primary format:", rules.primaryFormat);
console.log("Real-time:     ", rules.realTimeScheme);

const bank = createBanking(rules);
const check = bank.validateAccountLength("123456789012");
console.log(check.ok);

// Validate IBAN
import { iban } from "@regium/core/validators/global";
iban.validate("DE89 3704 0044 0532 0130 00");`,

    react: (iso) => `import { createRegium } from "@regium/core";
import ${iso.toLowerCase()} from "@regium/data/${iso.toLowerCase()}";
import { RegiumProvider, useRegiumForm } from "@regium/react";

const regium = createRegium({ plugins: [${iso.toLowerCase()}] });

export function App() {
  return (
    <RegiumProvider regium={regium}>
      <EmployeeForm country="${iso}" />
    </RegiumProvider>
  );
}

function EmployeeForm({ country }: { country: string }) {
  const form = useRegiumForm({ country, audience: "employee" });
  return (
    <form onSubmit={(e) => { e.preventDefault(); form.validate(); }}>
      {form.fields.map((f) => (
        <div key={f.id}>
          <label>{typeof f.label === "string" ? f.label : f.label.en}</label>
          <input
            value={form.values[f.id] ?? ""}
            onChange={(e) => form.setValue(f.id, e.target.value)}
          />
          {form.errors[f.id]?.map((msg, i) => (
            <span key={i} style={{ color: "red" }}>{msg}</span>
          ))}
        </div>
      ))}
      <button type="submit">Validate</button>
    </form>
  );
}`,
  };

  let currentSnippet = "full";

  function renderCodePanel(iso) {
    const c = getCountry(iso);
    const fn = CODE_SNIPPETS[currentSnippet];
    if (!fn) return;
    const code = fn(iso, c);
    const outputEl = document.getElementById("code-gen-output");
    const linesEl = document.getElementById("code-gen-lines");
    const installEl = document.getElementById("code-gen-install");
    if (outputEl) outputEl.innerHTML = syntaxHL(code);
    if (linesEl) linesEl.textContent = lineNumbers(code);
    if (installEl) installEl.textContent = "npm install @regium/core @regium/data" + (currentSnippet === "react" ? " @regium/react react" : "");
  }

  document.querySelectorAll(".code-gen__opt").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".code-gen__opt").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentSnippet = btn.dataset.snippet;
      renderCodePanel(select.value);
    });
  });

  document.querySelector(".code-gen__copy")?.addEventListener("click", () => {
    const code = document.getElementById("code-gen-output")?.textContent;
    if (code) {
      navigator.clipboard.writeText(code.trim()).then(() => {
        const btn = document.querySelector(".code-gen__copy");
        btn.textContent = "✓ Copied";
        setTimeout(() => { btn.textContent = "Copy"; }, 1500);
      });
    }
  });

  // ─── Country change ──────────────────────────────────────────────────
  function onCountryChange(iso) {
    const c = getCountry(iso);
    if (!c) return;
    document.getElementById("exp-info").innerHTML =
      `<strong>${esc(c.name)}</strong> · ${c.iso2} · ${c.currency.code} (${c.currency.symbol}) · ${esc(c.primaryTaxAuthority)} · Tier: <strong>${c.tier}</strong>`;
    renderOverview(c);
    renderFields(c.companyFields, "company-table");
    renderFields(c.employeeFields, "employee-table");
    renderValidate(c);
    renderPayroll(c);
    renderCodePanel(iso);
  }

  // ─── Init ────────────────────────────────────────────────────────────
  const defaultIso = sorted.find((c) => c.iso2 === "IN") ? "IN" : sorted[0].iso2;
  select.value = defaultIso;
  onCountryChange(defaultIso);
  select.addEventListener("change", (e) => onCountryChange(e.target.value));

})();
