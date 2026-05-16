/**
 * Regium Experience Centre
 * Interactive explorer for 218 countries.
 */
(async () => {
  // ─── Load data ───────────────────────────────────────────────────────
  let regiumData = null;

  try {
    const res = await fetch("/regium-data.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    regiumData = await res.json();
  } catch (err) {
    console.error("Failed to load regium-data.json:", err);
    document.getElementById("exp-info").textContent =
      "Error: Could not load country data. Make sure regium-data.json exists in public/.";
    return;
  }

  if (!regiumData.countries || regiumData.countries.length === 0) {
    document.getElementById("exp-info").textContent = "No countries found in data file.";
    return;
  }

  // ─── Helpers ─────────────────────────────────────────────────────────
  const sorted = regiumData.countries.slice().sort((a, b) => a.name.localeCompare(b.name));

  function getCountry(iso) {
    return sorted.find((c) => c.iso2 === iso);
  }

  function resolveLabel(label) {
    if (typeof label === "string") return label;
    if (!label) return "—";
    return label.en || label[Object.keys(label)[0]] || "—";
  }

  function esc(str) {
    return String(str || "—")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // ─── Populate dropdown ───────────────────────────────────────────────
  const select = document.getElementById("exp-country");

  function populateDropdown(list) {
    select.innerHTML = list
      .map((c) => {
        const star = c.tier === "T1" ? " ★" : "";
        return `<option value="${c.iso2}">${esc(c.name)} · ${c.iso2} · ${c.currency.code}${star}</option>`;
      })
      .join("");
  }

  populateDropdown(sorted);

  // ─── Search ──────────────────────────────────────────────────────────
  const searchInput = document.getElementById("exp-search");

  searchInput.addEventListener("input", () => {
    const q = searchInput.value.toLowerCase().trim();
    if (!q) {
      populateDropdown(sorted);
    } else {
      const filtered = sorted.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.iso2.toLowerCase().includes(q) ||
          c.iso3.toLowerCase().includes(q) ||
          c.currency.code.toLowerCase().includes(q),
      );
      populateDropdown(filtered);
    }
    // Auto-select first match and render
    if (select.options.length > 0) {
      select.selectedIndex = 0;
      onCountryChange(select.value);
    }
  });

  // ─── Render: Overview ────────────────────────────────────────────────
  function renderOverview(country) {
    const grid = document.getElementById("overview-grid");
    const cards = [
      ["Country", country.name],
      ["Official name", country.officialName],
      ["ISO codes", `${country.iso2} · ${country.iso3} · ${country.isoNumeric}`],
      ["Phone code", country.phoneCode],
      ["Currency", `${country.currency.code} (${country.currency.symbol})`],
      ["Timezones", country.timezones.join(", ")],
      ["Languages", country.officialLanguages.join(", ")],
      ["Payroll region", country.payrollRegion],
      ["Legal system", country.legalSystem],
      ["Week starts", country.weekStart],
      ["Date format", country.dateFormat],
      ["Tax authority", country.primaryTaxAuthority],
    ];
    grid.innerHTML = cards
      .map(
        (item) =>
          `<div class="exp-card"><div class="exp-card__label">${esc(item[0])}</div><div class="exp-card__value">${esc(item[1])}</div></div>`,
      )
      .join("");
  }

  // ─── Render: Fields table ────────────────────────────────────────────
  function renderFieldsTable(fields, containerId) {
    const wrap = document.getElementById(containerId);
    if (!fields || fields.length === 0) {
      wrap.innerHTML =
        '<p style="padding:20px;color:var(--text-subtle)">No detailed fields defined for this jurisdiction yet (T4 stub). Contribute data to promote this country.</p>';
      return;
    }
    const rows = fields
      .map((f) => {
        const label = resolveLabel(f.label);
        const validators = (f.validatorIds || []).join(", ") || "—";
        const reqBadge = f.required
          ? '<span class="badge badge--required">Required</span>'
          : '<span class="badge badge--optional">Optional</span>';
        const sensBadge =
          f.sensitivity === "pii"
            ? '<span class="badge badge--pii">PII</span>'
            : esc(f.sensitivity || "—");
        return `<tr><td class="mono">${esc(f.id)}</td><td>${esc(label)}</td><td>${esc(f.category)}</td><td>${reqBadge}</td><td>${sensBadge}</td><td class="mono">${esc(validators)}</td><td class="mono">${esc(f.example || "—")}</td></tr>`;
      })
      .join("");

    wrap.innerHTML = `<table class="exp-table"><thead><tr><th>ID</th><th>Label</th><th>Category</th><th>Required</th><th>Sensitivity</th><th>Validators</th><th>Example</th></tr></thead><tbody>${rows}</tbody></table>`;
  }

  // ─── Render: Validate ────────────────────────────────────────────────
  function renderValidate(country) {
    const allFields = [].concat(country.companyFields || [], country.employeeFields || []);
    const fieldSelect = document.getElementById("val-field");

    if (allFields.length === 0) {
      fieldSelect.innerHTML = "<option disabled>No validatable fields for this country</option>";
      document.getElementById("val-value").value = "";
      document.getElementById("val-result").textContent =
        "This country is at T4 tier — no validators attached yet.";
      document.getElementById("val-result").className = "exp-validate__result";
      return;
    }

    fieldSelect.innerHTML = allFields
      .map(
        (f) =>
          `<option value="${esc(f.id)}" data-example="${esc(f.example || "")}">${esc(f.id)} — ${esc(resolveLabel(f.label))}</option>`,
      )
      .join("");

    const first = allFields[0];
    document.getElementById("val-value").value = first ? first.example || "" : "";
    document.getElementById("val-result").textContent =
      "Select a field, enter a value, and click Validate.";
    document.getElementById("val-result").className = "exp-validate__result";
  }

  // ─── Render: Payroll (detailed) ─────────────────────────────────────
  function renderPayroll(country) {
    const grid = document.getElementById("payroll-grid");
    const p = country.payrollRules || {};
    const t = country.taxRules || {};
    const l = country.laborRules || {};

    let html = "";

    // Summary cards
    const summaryCards = [
      ["Default frequency", p.defaultFrequency || "monthly"],
      ["Currency", p.currency || (country.currency ? country.currency.code : "—")],
      ["Working hours/day", p.workingHoursPerDay || "—"],
      ["Working days/month", p.workingDaysPerMonth || "—"],
      ["Overtime mandatory", p.overtimeMandatory ? "Yes" : "No"],
      ["Overtime multiplier", p.overtimeMultiplier ? `${p.overtimeMultiplier}x` : "—"],
      ["13th month salary", p.thirteenthMonth ? "Yes" : "No"],
      ["Tax authority", t.authority || country.primaryTaxAuthority || "—"],
      ["Tax year starts", t.taxYearStart || "01-01"],
      ["Default tax regime", t.defaultRegimeId || "—"],
      ["Std weekly hours", l.standardWeeklyHours || "—"],
      ["Max weekly hours", l.maxWeeklyHours || "—"],
      ["Weekly off days", l.weeklyOffDays || "—"],
      [
        "Min notice (days)",
        l.termination && l.termination.minNoticeDays !== undefined
          ? l.termination.minNoticeDays
          : "—",
      ],
      ["Severance mandatory", l.termination?.severanceMandatory ? "Yes" : "No"],
    ];

    html += '<h3 class="exp-section-title">Summary</h3>';
    html += '<div class="exp-grid">';
    html += summaryCards
      .map(
        (item) =>
          `<div class="exp-card"><div class="exp-card__label">${esc(item[0])}</div><div class="exp-card__value exp-card__value--mono">${esc(String(item[1]))}</div></div>`,
      )
      .join("");
    html += "</div>";

    // Salary components
    const components = p.components || [];
    if (components.length > 0) {
      html += '<h3 class="exp-section-title">Salary components</h3>';
      html +=
        '<div class="exp-table-wrap"><table class="exp-table"><thead><tr><th>ID</th><th>Name</th><th>Type</th><th>Computation</th><th>Rate</th><th>Taxable</th><th>Mandatory</th></tr></thead><tbody>';
      html += components
        .map(
          (c) =>
            `<tr><td class="mono">${esc(c.id)}</td><td>${esc(resolveLabel(c.name))}</td><td>${esc(c.type)}</td><td>${esc(c.computation)}</td><td class="mono">${c.defaultRate !== undefined ? `${c.defaultRate}%` : "—"}</td><td>${c.taxable ? "Yes" : "No"}</td><td>${c.mandatory ? "Yes" : "No"}</td></tr>`,
        )
        .join("");
      html += "</tbody></table></div>";
    }

    // Contributions
    const contributions = p.contributions || [];
    if (contributions.length > 0) {
      html += '<h3 class="exp-section-title">Statutory contributions</h3>';
      html +=
        '<div class="exp-table-wrap"><table class="exp-table"><thead><tr><th>ID</th><th>Name</th><th>Payer</th><th>Rate</th><th>Ceiling</th><th>Authority</th></tr></thead><tbody>';
      html += contributions
        .map(
          (c) =>
            `<tr><td class="mono">${esc(c.id)}</td><td>${esc(resolveLabel(c.name))}</td><td>${esc(c.payer)}</td><td class="mono">${c.rate}%</td><td class="mono">${c.ceiling ? c.ceiling.toLocaleString() : "—"}</td><td>${esc(c.authority || "—")}</td></tr>`,
        )
        .join("");
      html += "</tbody></table></div>";
    }

    // Tax slabs
    const regimes = t.regimes || [];
    if (regimes.length > 0) {
      html += '<h3 class="exp-section-title">Tax regimes & slabs</h3>';
      regimes.forEach((regime) => {
        html += `<div class="exp-regime-header">${esc(resolveLabel(regime.name))}${
          regime.id === t.defaultRegimeId
            ? ' <span class="badge badge--required">Default</span>'
            : ""
        }</div>`;
        if (regime.standardDeduction) {
          html += `<p class="exp-regime-note">Standard deduction: ${regime.currency} ${regime.standardDeduction.toLocaleString()}</p>`;
        }
        html +=
          '<div class="exp-table-wrap"><table class="exp-table"><thead><tr><th>From</th><th>To</th><th>Rate</th></tr></thead><tbody>';
        html += (regime.slabs || [])
          .map(
            (s) =>
              `<tr><td class="mono">${s.from.toLocaleString()}</td><td class="mono">${s.to ? s.to.toLocaleString() : "∞"}</td><td class="mono">${s.rate}%</td></tr>`,
          )
          .join("");
        html += "</tbody></table></div>";
      });
    }

    // Leave policies
    const leaves = l.leavePolicies || [];
    if (leaves.length > 0) {
      html += '<h3 class="exp-section-title">Leave policies</h3>';
      html +=
        '<div class="exp-table-wrap"><table class="exp-table"><thead><tr><th>Type</th><th>Name</th><th>Min days/year</th><th>Paid</th><th>Carry forward</th></tr></thead><tbody>';
      html += leaves
        .map(
          (lv) =>
            `<tr><td>${esc(lv.type)}</td><td>${esc(resolveLabel(lv.name))}</td><td class="mono">${lv.minDaysPerYear}</td><td>${lv.paid ? "Yes" : "No"}</td><td>${lv.carryForward ? "Yes" : "No"}</td></tr>`,
        )
        .join("");
      html += "</tbody></table></div>";
    }

    // Minimum wage
    if (l.minimumWage) {
      html += '<h3 class="exp-section-title">Minimum wage</h3>';
      html += `<div class="exp-card" style="max-width:300px"><div class="exp-card__label">Statutory minimum</div><div class="exp-card__value exp-card__value--mono">${l.minimumWage.currency} ${l.minimumWage.amount} / ${l.minimumWage.period}</div></div>`;
    }

    grid.innerHTML =
      html ||
      '<p style="color:var(--text-subtle)">No detailed payroll data for this country (T4 stub).</p>';
  }

  // ─── Tab switching ───────────────────────────────────────────────────
  const tabs = document.querySelectorAll(".exp-tab");
  const panels = document.querySelectorAll(".exp-panel");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => {
        t.classList.remove("active");
      });
      panels.forEach((p) => {
        p.classList.remove("active");
      });
      tab.classList.add("active");
      const panel = document.getElementById(`panel-${tab.getAttribute("data-tab")}`);
      if (panel) panel.classList.add("active");
    });
  });

  // ─── Validate button ────────────────────────────────────────────────
  document.getElementById("val-btn").addEventListener("click", () => {
    const fieldId = document.getElementById("val-field").value;
    const value = document.getElementById("val-value").value.trim();
    const resultEl = document.getElementById("val-result");

    if (!value) {
      resultEl.textContent = "Please enter a value to validate.";
      resultEl.className = "exp-validate__result";
      return;
    }

    const iso = select.value;
    const country = getCountry(iso);
    if (!country) return;

    const allFields = [].concat(country.companyFields || [], country.employeeFields || []);
    const field = allFields.find((f) => f.id === fieldId);

    if (!field || !field.validatorIds || field.validatorIds.length === 0) {
      resultEl.textContent = `✓ No validator attached to "${fieldId}" — value accepted as-is.\n\nTo add validation, contribute a validator for this field.`;
      resultEl.className = "exp-validate__result ok";
      return;
    }

    const validators = regiumData.validators || {};
    let ok = true;
    const errors = [];
    let normalized = value;

    field.validatorIds.forEach((vid) => {
      const v = validators[vid];
      if (!v || !v.pattern) return;

      const testValue = v.canonical
        ? value.replace(/[^A-Za-z0-9]/g, "").toUpperCase()
        : value.trim();
      normalized = testValue;

      const regex = new RegExp(v.pattern, v.flags || "");
      if (!regex.test(testValue)) {
        ok = false;
        errors.push(`${vid}: Format mismatch (expected: ${v.pattern})`);
      }
    });

    if (ok) {
      resultEl.textContent = `✓ Valid\n\nField: ${fieldId}\nValue: ${value}\nNormalized: ${normalized}\nValidators: ${field.validatorIds.join(", ")}`;
      resultEl.className = "exp-validate__result ok";
    } else {
      resultEl.textContent = `✗ Invalid\n\nField: ${fieldId}\nValue: ${value}\n\nErrors:\n${errors.join("\n")}`;
      resultEl.className = "exp-validate__result error";
    }
  });

  // Field select → auto-fill example
  document.getElementById("val-field").addEventListener("change", (e) => {
    const option = e.target.selectedOptions[0];
    if (option) {
      document.getElementById("val-value").value = option.getAttribute("data-example") || "";
      document.getElementById("val-result").textContent =
        "Select a field, enter a value, and click Validate.";
      document.getElementById("val-result").className = "exp-validate__result";
    }
  });

  // ─── Country change ──────────────────────────────────────────────────
  function onCountryChange(iso) {
    const country = getCountry(iso);
    if (!country) return;

    const info = document.getElementById("exp-info");
    info.innerHTML = `<strong>${esc(country.name)}</strong> · ${country.iso2} · ${country.currency.code} (${country.currency.symbol}) · ${esc(country.primaryTaxAuthority)} · Tier: <strong>${country.tier}</strong>`;

    renderOverview(country);
    renderFieldsTable(country.companyFields, "company-table");
    renderFieldsTable(country.employeeFields, "employee-table");
    renderValidate(country);
    renderPayroll(country);
  }

  // ─── Init ────────────────────────────────────────────────────────────
  const defaultIso = sorted.find((c) => c.iso2 === "IN") ? "IN" : sorted[0].iso2;
  select.value = defaultIso;
  onCountryChange(defaultIso);

  select.addEventListener("change", (e) => {
    onCountryChange(e.target.value);
  });
})();
