/**
 * Regium Experience Centre
 * Interactive explorer for 218 countries — company & employee fields,
 * live ID validation, payroll & tax data.
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
    console.error("Failed to load regium-data.json:", err);
    document.getElementById("exp-info").textContent = "Error: Could not load country data. Run `pnpm build` first.";
    return;
  }

  if (!regiumData.countries || regiumData.countries.length === 0) {
    document.getElementById("exp-info").textContent = "No countries found in data file.";
    return;
  }

  // ─── Helpers ─────────────────────────────────────────────────────────
  function getCountry(iso) {
    return regiumData.countries.find(function (c) { return c.iso2 === iso; });
  }

  function resolveLabel(label) {
    if (typeof label === "string") return label;
    if (!label) return "—";
    return label.en || label[Object.keys(label)[0]] || "—";
  }

  function escapeHtml(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  // ─── Render: Overview ────────────────────────────────────────────────
  function renderOverview(country) {
    var grid = document.getElementById("overview-grid");
    var cards = [
      ["Country", country.name],
      ["Official name", country.officialName],
      ["ISO codes", country.iso2 + " · " + country.iso3 + " · " + country.isoNumeric],
      ["Phone code", country.phoneCode],
      ["Currency", country.currency.code + " (" + country.currency.symbol + ")"],
      ["Timezones", country.timezones.join(", ")],
      ["Languages", country.officialLanguages.join(", ")],
      ["Payroll region", country.payrollRegion],
      ["Legal system", country.legalSystem],
      ["Week starts", country.weekStart],
      ["Date format", country.dateFormat],
      ["Tax authority", country.primaryTaxAuthority],
    ];
    grid.innerHTML = cards.map(function (item) {
      return '<div class="exp-card"><div class="exp-card__label">' + escapeHtml(item[0]) + '</div><div class="exp-card__value">' + escapeHtml(item[1]) + '</div></div>';
    }).join("");
  }

  // ─── Render: Fields table ────────────────────────────────────────────
  function renderFieldsTable(fields, containerId) {
    var wrap = document.getElementById(containerId);
    if (!fields || fields.length === 0) {
      wrap.innerHTML = '<p style="padding:20px;color:var(--text-subtle)">No detailed fields defined for this jurisdiction yet (T4 stub). Contribute data to promote this country.</p>';
      return;
    }
    var rows = fields.map(function (f) {
      var label = resolveLabel(f.label);
      var validators = (f.validatorIds || []).join(", ") || "—";
      var reqBadge = f.required ? '<span class="badge badge--required">Required</span>' : '<span class="badge badge--optional">Optional</span>';
      var sensBadge = f.sensitivity === "pii" ? '<span class="badge badge--pii">PII</span>' : (f.sensitivity || "—");
      return '<tr>' +
        '<td class="mono">' + escapeHtml(f.id) + '</td>' +
        '<td>' + escapeHtml(label) + '</td>' +
        '<td>' + escapeHtml(f.category) + '</td>' +
        '<td>' + reqBadge + '</td>' +
        '<td>' + sensBadge + '</td>' +
        '<td class="mono">' + escapeHtml(validators) + '</td>' +
        '<td class="mono">' + escapeHtml(f.example || "—") + '</td>' +
        '</tr>';
    }).join("");

    wrap.innerHTML = '<table class="exp-table"><thead><tr>' +
      '<th>ID</th><th>Label</th><th>Category</th><th>Required</th><th>Sensitivity</th><th>Validators</th><th>Example</th>' +
      '</tr></thead><tbody>' + rows + '</tbody></table>';
  }

  // ─── Render: Validate ────────────────────────────────────────────────
  function renderValidate(country) {
    var allFields = [].concat(country.companyFields || [], country.employeeFields || []);
    var select = document.getElementById("val-field");

    if (allFields.length === 0) {
      select.innerHTML = '<option disabled>No validatable fields for this country</option>';
      document.getElementById("val-value").value = "";
      document.getElementById("val-result").textContent = "This country is at T4 tier — no validators attached yet.";
      document.getElementById("val-result").className = "exp-validate__result";
      return;
    }

    select.innerHTML = allFields.map(function (f) {
      return '<option value="' + escapeHtml(f.id) + '" data-example="' + escapeHtml(f.example || "") + '">' +
        escapeHtml(f.id) + ' — ' + escapeHtml(resolveLabel(f.label)) + '</option>';
    }).join("");

    // Set first example
    var first = allFields[0];
    document.getElementById("val-value").value = first ? (first.example || "") : "";
    document.getElementById("val-result").textContent = "Select a field, enter a value, and click Validate.";
    document.getElementById("val-result").className = "exp-validate__result";
  }

  // ─── Render: Payroll ─────────────────────────────────────────────────
  function renderPayroll(country) {
    var grid = document.getElementById("payroll-grid");
    var p = country.payrollRules || {};
    var t = country.taxRules || {};
    var l = country.laborRules || {};

    var cards = [
      ["Default frequency", p.defaultFrequency || "monthly"],
      ["Currency", p.currency || (country.currency ? country.currency.code : "—")],
      ["Working hours/day", p.workingHoursPerDay || "—"],
      ["Working days/month", p.workingDaysPerMonth || "—"],
      ["Overtime multiplier", p.overtimeMultiplier || "—"],
      ["Tax authority", t.authority || country.primaryTaxAuthority || "—"],
      ["Tax year starts", t.taxYearStart || "01-01"],
      ["Default regime", t.defaultRegimeId || "—"],
      ["Std weekly hours", l.standardWeeklyHours || "—"],
      ["Max weekly hours", l.maxWeeklyHours || "—"],
      ["Min notice (days)", (l.termination && l.termination.minNoticeDays !== undefined) ? l.termination.minNoticeDays : "—"],
      ["Contributions", ((p.contributions || []).length) + " defined"],
    ];

    grid.innerHTML = cards.map(function (item) {
      return '<div class="exp-card"><div class="exp-card__label">' + escapeHtml(item[0]) + '</div><div class="exp-card__value exp-card__value--mono">' + escapeHtml(String(item[1])) + '</div></div>';
    }).join("");
  }

  // ─── Tab switching ───────────────────────────────────────────────────
  var tabs = document.querySelectorAll(".exp-tab");
  var panels = document.querySelectorAll(".exp-panel");

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) { t.classList.remove("active"); });
      panels.forEach(function (p) { p.classList.remove("active"); });
      tab.classList.add("active");
      var panel = document.getElementById("panel-" + tab.getAttribute("data-tab"));
      if (panel) panel.classList.add("active");
    });
  });

  // ─── Validate button ────────────────────────────────────────────────
  document.getElementById("val-btn").addEventListener("click", function () {
    var fieldId = document.getElementById("val-field").value;
    var value = document.getElementById("val-value").value.trim();
    var resultEl = document.getElementById("val-result");

    if (!value) {
      resultEl.textContent = "Please enter a value to validate.";
      resultEl.className = "exp-validate__result";
      return;
    }

    var iso = document.getElementById("exp-country").value;
    var country = getCountry(iso);
    if (!country) return;

    var allFields = [].concat(country.companyFields || [], country.employeeFields || []);
    var field = allFields.find(function (f) { return f.id === fieldId; });

    if (!field || !field.validatorIds || field.validatorIds.length === 0) {
      resultEl.textContent = "✓ No validator attached to \"" + fieldId + "\" — value accepted as-is.\n\nTo add validation, contribute a validator for this field.";
      resultEl.className = "exp-validate__result ok";
      return;
    }

    // Validate using patterns from the data
    var validators = regiumData.validators || {};
    var ok = true;
    var errors = [];
    var normalized = value;

    field.validatorIds.forEach(function (vid) {
      var v = validators[vid];
      if (!v || !v.pattern) return;

      var testValue = v.canonical ? value.replace(/[^A-Za-z0-9]/g, "").toUpperCase() : value.trim();
      normalized = testValue;

      var regex = new RegExp(v.pattern, v.flags || "");
      if (!regex.test(testValue)) {
        ok = false;
        errors.push(vid + ": Format mismatch (expected: " + v.pattern + ")");
      }
    });

    if (ok) {
      resultEl.textContent = "✓ Valid\n\nField: " + fieldId + "\nValue: " + value + "\nNormalized: " + normalized + "\nValidators: " + field.validatorIds.join(", ");
      resultEl.className = "exp-validate__result ok";
    } else {
      resultEl.textContent = "✗ Invalid\n\nField: " + fieldId + "\nValue: " + value + "\n\nErrors:\n" + errors.join("\n");
      resultEl.className = "exp-validate__result error";
    }
  });

  // ─── Field select → auto-fill example ───────────────────────────────
  document.getElementById("val-field").addEventListener("change", function (e) {
    var option = e.target.selectedOptions[0];
    if (option) {
      document.getElementById("val-value").value = option.getAttribute("data-example") || "";
      document.getElementById("val-result").textContent = "Select a field, enter a value, and click Validate.";
      document.getElementById("val-result").className = "exp-validate__result";
    }
  });

  // ─── Country change ──────────────────────────────────────────────────
  function onCountryChange(iso) {
    var country = getCountry(iso);
    if (!country) return;

    // Info bar
    var info = document.getElementById("exp-info");
    info.innerHTML = '<strong>' + escapeHtml(country.name) + '</strong> · ' +
      country.iso2 + ' · ' + country.currency.code + ' (' + country.currency.symbol + ') · ' +
      escapeHtml(country.primaryTaxAuthority) + ' · Tier: <strong>' + country.tier + '</strong>';

    renderOverview(country);
    renderFieldsTable(country.companyFields, "company-table");
    renderFieldsTable(country.employeeFields, "employee-table");
    renderValidate(country);
    renderPayroll(country);
  }

  // ─── Search filter ───────────────────────────────────────────────────
  document.getElementById("exp-search").addEventListener("input", function (e) {
    var q = e.target.value.toLowerCase().trim();
    var options = document.getElementById("exp-country").querySelectorAll("option");
    options.forEach(function (opt) {
      var text = opt.textContent.toLowerCase();
      opt.hidden = q ? !text.includes(q) : false;
    });
  });

  // ─── Init ────────────────────────────────────────────────────────────
  var select = document.getElementById("exp-country");
  var sorted = regiumData.countries.slice().sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });

  select.innerHTML = sorted.map(function (c) {
    var star = c.tier === "T1" ? " ★" : "";
    return '<option value="' + c.iso2 + '">' + escapeHtml(c.name) + ' · ' + c.iso2 + ' · ' + c.currency.code + star + '</option>';
  }).join("");

  // Default to India
  var defaultIso = sorted.find(function (c) { return c.iso2 === "IN"; }) ? "IN" : sorted[0].iso2;
  select.value = defaultIso;
  onCountryChange(defaultIso);

  select.addEventListener("change", function (e) {
    onCountryChange(e.target.value);
  });

  // Show count
  document.getElementById("exp-info").insertAdjacentHTML("beforeend",
    ' · <span style="color:var(--text-subtle)">' + sorted.length + ' countries loaded</span>');

})();
