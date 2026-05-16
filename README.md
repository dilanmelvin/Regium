<div align="center">

```
███████████   ██████████   █████████  █████ █████  █████ ██████   ██████
▒▒███▒▒▒▒▒███ ▒▒███▒▒▒▒▒█  ███▒▒▒▒▒███▒▒███ ▒▒███  ▒▒███ ▒▒██████ ██████
 ▒███    ▒███  ▒███  █ ▒  ███     ▒▒▒  ▒███  ▒███   ▒███  ▒███▒█████▒███
 ▒██████████   ▒██████   ▒███          ▒███  ▒███   ▒███  ▒███▒▒███ ▒███
 ▒███▒▒▒▒▒███  ▒███▒▒█   ▒███    █████ ▒███  ▒███   ▒███  ▒███ ▒▒▒  ▒███
 ▒███    ▒███  ▒███ ▒   █▒▒███  ▒▒███  ▒███  ▒███   ▒███  ▒███      ▒███
 █████   █████ ██████████ ▒▒█████████  █████ ▒▒████████   █████     █████
▒▒▒▒▒   ▒▒▒▒▒ ▒▒▒▒▒▒▒▒▒▒   ▒▒▒▒▒▒▒▒▒  ▒▒▒▒▒   ▒▒▒▒▒▒▒▒   ▒▒▒▒▒     ▒▒▒▒▒
```

### Global Workforce Compliance Infrastructure for Developers

**One TypeScript SDK for tax IDs, payroll rules, banking formats, labor law, and immigration metadata across every country in the world.**

[![npm](https://img.shields.io/npm/v/regium?label=regium&color=0f172a)](https://www.npmjs.com/package/regium)
[![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6.svg)](https://www.typescriptlang.org/)
[![Countries](https://img.shields.io/badge/countries-218-success.svg)](#country-coverage)

[Install](#install) · [Quick start](#quick-start) · [Subpath imports](#granular-imports-tree-shake-friendly) · [How it works](#how-it-works) · [Docs](./docs/)

</div>

---

## What is Regium?

Regium is the **compliance layer of the internet for workforce systems**. The way Stripe abstracts payments and Prisma abstracts databases, Regium abstracts global workforce compliance.

It gives you a single, typed, deterministic JavaScript/TypeScript API to:

1. **Look up country metadata** — ISO codes, currencies, timezones, languages, legal systems, tax authorities for **218 jurisdictions**.
2. **Validate compliance IDs** — PAN, Aadhaar, SSN, NINO, NRIC, CPF, CNPJ, IBAN, SWIFT, Emirates ID, SIN, ABN, SIREN, and dozens more — with real checksum algorithms.
3. **Compute payroll** — gross-to-net calculations using country-specific salary components, statutory contributions, and progressive tax slabs.
4. **Generate dynamic forms** — auto-build localized employee/company onboarding forms from metadata.
5. **Query labor rules** — statutory leave, notice periods, working hours, minimum wage.
6. **Validate banking details** — IBAN (ISO 13616 mod-97), SWIFT/BIC (ISO 9362), IFSC, BSB, ABA routing.
7. **Time-travel** — pass an `effectiveDate` and get the rules valid on that date — historical payroll runs reproduce forever.

---

## Install

Just **2 packages**, with rich subpath exports inside.

```bash
# All-in setup (most common)
npm install regium @regium/data

# pnpm
pnpm add regium @regium/data

# yarn
yarn add regium @regium/data

# bun
bun add regium @regium/data
```

For React apps, also:

```bash
npm install @regium/react
```

---

## Quick start

```ts
import { createRegium } from "regium";
import { allCountries } from "@regium/data";

const regium = createRegium({ plugins: allCountries });

// Country lookup — instant
regium.getCountryConfig("IN");
//   → { name: "India", currency: { code: "INR", symbol: "₹" }, ... }

// Validate a tax ID with real checksum
regium.validate({ country: "IN", field: "PAN", value: "ABCPL1234C" });
//   → { ok: true, normalized: "ABCPL1234C" }

// Get compliance fields for any country
regium.getEmployeeFields("US");

// Compute payroll
import { computePayroll } from "regium/payroll";
computePayroll({
  annualGross: 1500000,
  rules: regium.getPayrollRules("IN"),
  taxRules: regium.getTaxRules("IN"),
});
```

---

## Granular imports (tree-shake friendly)

The 2-package design uses **subpath exports** so you import only what you need. Bundle costs scale with usage.

### Just one validator

```ts
import { pan } from "regium/validators/in";
pan.validate("ABCPL1234C");
// Bundle cost: ~500 bytes
```

### Just one country's employee fields

```ts
import { fields } from "@regium/data/in/employee";
// Bundle cost: ~1 KB
```

### Just the payroll engine

```ts
import { computePayroll } from "regium/payroll";
// Bundle cost: ~3 KB
```

### Just IBAN validation

```ts
import { iban } from "regium/validators/global";
iban.validate("DE89370400440532013000");
// Bundle cost: ~1 KB
```

### All available subpaths

| Subpath | Contents | Use when |
|---------|---------|----------|
| `regium` | Full SDK barrel | You want everything |
| `regium/core` | createRegium, registry only | You want just the runtime |
| `regium/validators` | All validators | You want all jurisdictions |
| `regium/validators/global` | IBAN, SWIFT, email, phone | Universal validators |
| `regium/validators/<iso>` | Country-specific (in, us, uk, de, fr, sg, ae, br, au, ca) | Just one country's validators |
| `regium/payroll` | Gross→net engine | Payroll calculations |
| `regium/tax` | Slab/regime engine | Tax calculations |
| `regium/labor` | Leave, working hours, termination | Labor rules |
| `regium/banking` | IBAN/SWIFT/IFSC/BSB | Banking validation |
| `regium/forms` | Schema-driven form engine | Generate forms |
| `regium/localization` | i18n, formatting | Locale handling |
| `regium/utils` | Date, currency, mask, checksum | Utility primitives |
| `regium/types` | Zod schemas + TS types | Type definitions |
| `@regium/data` | All 218 countries bundled | Want everything |
| `@regium/data/<iso>` | One country, all domains | One country, all data |
| `@regium/data/<iso>/<domain>` | One country, one domain | Most granular |

Where `<iso>` ∈ `in, us, uk, de, fr, sg, ae, br, au, ca` and `<domain>` ∈ `country, company, employee, payroll, tax, labor, banking, localization, immigration`.

### Bundle size comparison

| Use case | Bundle | Compared to monolithic SDK |
|----------|--------|---------------------------|
| Validate one Indian PAN | **0.5 KB** | 50× smaller |
| Validate one IBAN | **1 KB** | 21× smaller |
| Get only India employee fields | **1 KB** | 19× smaller |
| Compute India payroll | **8 KB** | 4× smaller |
| Full app, all 218 countries | **60 KB** | baseline |

---

## React integration

```tsx
import { createRegium } from "regium";
import { allCountries } from "@regium/data";
import { RegiumProvider, useRegiumForm } from "@regium/react";

const regium = createRegium({ plugins: allCountries });

function App() {
  return (
    <RegiumProvider regium={regium}>
      <EmployeeForm country="IN" />
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
          <input value={form.values[f.id] ?? ""}
            onChange={(e) => form.setValue(f.id, e.target.value)} />
        </div>
      ))}
      <button type="submit">Validate</button>
    </form>
  );
}
```

---

## Validators

Production-grade validators with real checksum algorithms:

| Validator | Country | Algorithm |
|-----------|---------|-----------|
| PAN | India | Regex |
| Aadhaar | India | Verhoeff checksum |
| GSTIN | India | GSTN check digit |
| IFSC | India | Regex |
| SSN | US | Format + exclusion rules |
| EIN | US | Format |
| ABA Routing | US | Weighted mod-10 |
| NINO | UK | Regex with prefix exclusions |
| Steuer-ID | Germany | 11-digit with check |
| SIREN, SIRET | France | Luhn |
| NRIC/FIN | Singapore | Weighted checksum |
| Emirates ID | UAE | Format |
| CPF, CNPJ | Brazil | Dual check digit |
| TFN, ABN | Australia | Weighted checksums |
| SIN | Canada | Luhn |
| **IBAN** | Global | ISO 13616 mod-97 |
| **SWIFT/BIC** | Global | ISO 9362 |
| E.164 Phone, Email | Global | Format |

---

## Country coverage

**218 countries and territories** — every UN member state, observers, partially recognised states, and 21 major territories.

10 countries ship with **full payroll, tax, labor, banking, immigration data**:

🇮🇳 India · 🇺🇸 United States · 🇬🇧 United Kingdom · 🇩🇪 Germany · 🇫🇷 France · 🇸🇬 Singapore · 🇦🇪 UAE · 🇧🇷 Brazil · 🇦🇺 Australia · 🇨🇦 Canada

The other 208 ship with **country profile, currency, ISO codes, tax authority, and base structure** — ready for community contributions to elevate them to full coverage.

---

## How it works

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Your application                                 │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
        ┌───────▼────────┐         ┌─────────▼──────────┐
        │ @regium/react  │         │   @regium/data     │
        │ (optional)     │         │   218 countries    │
        └───────┬────────┘         └─────────┬──────────┘
                │                             │
                └──────────────┬──────────────┘
                               │
                       ┌───────▼────────┐
                       │     regium     │
                       │  All engines   │
                       └────────────────┘
```

Every metadata document is wrapped in a versioned envelope:

```ts
{
  id: "tax-rules.in.v2025",
  jurisdiction: "IN",
  version: "2025.04.0",
  effectiveFrom: "2025-04-01",
  source: [{ title: "Income Tax Act, 1961", url: "...", primary: true }],
  data: { /* the actual rules */ }
}
```

Pass `effectiveDate` to `createRegium()` to time-travel — your March 2024 payroll always uses March 2024 rules.

---

## Production characteristics

| Property | Detail |
|----------|--------|
| **Packages** | 3 (regium, @regium/data, @regium/react) |
| **Bundle size** | 0.5 KB (one validator) → 60 KB (full app) |
| **Runtime** | Node 18+, Bun, Deno, Cloudflare Workers, Vercel Edge, browsers |
| **Side effects** | None. Every function is pure |
| **Tree-shaking** | Full. Subpath imports = pay only for what you use |
| **TypeScript** | Strict mode, full IntelliSense |
| **Dual format** | ESM + CJS + .d.ts in every entry point |
| **Zero runtime deps** | Just Zod (build-time only) |
| **Determinism** | Same inputs → same outputs |

---

## Use cases

| Industry | What Regium does for you |
|----------|--------------------------|
| **HRMS / HRIS** | Country-aware onboarding forms, ID validation, statutory leave tracking |
| **Global payroll** | One engine, country-specific rules — slabs, contributions, deductions |
| **EOR / Contractor SaaS** | Per-jurisdiction validation, work authorization, termination rules |
| **Fintech & banking** | Validate IBAN, SWIFT, IFSC, BSB, routing numbers worldwide |
| **ERP suites** | Multi-country invoicing, expense, time tracking with local rules |
| **Government tech** | Auditable, source-cited compliance metadata with version history |

---

## Documentation

| Document | Description |
|----------|-------------|
| [Getting started](./docs/getting-started.md) | 60-second tour |
| [Running](./docs/running.md) | Setup on macOS, Linux, Windows |
| [Examples](./docs/examples.md) | Copy-paste recipes |
| [Publishing](./docs/publishing.md) | Deploy to npm, pnpm, yarn, bun, JSR, CDN |
| [Project structure](./docs/project-structure.md) | What lives where and why |
| [Implementation plan](./docs/implementation-plan.md) | Full architecture & roadmap |
| [Contributing](./CONTRIBUTING.md) | Add a country, validator, adapter |
| [Security](./SECURITY.md) | Vulnerability reporting |

---

## Contributing

We welcome contributions — especially new country packs and validator improvements.

```bash
git clone https://github.com/dilanmelvin/Regium.git
cd Regium
pnpm install
pnpm build
pnpm smoke-test
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide.

---

## License

[Apache-2.0](./LICENSE) © Regium Contributors

---

## Keywords

`workforce-compliance` · `global-payroll` · `tax-id-validator` · `iban-validator` · `pan-validator` · `gstin-validator` · `aadhaar-validator` · `cpf-validator` · `cnpj-validator` · `nric-validator` · `emirates-id` · `ssn-validator` · `nino-validator` · `sin-validator` · `hrms-sdk` · `eor-sdk` · `payroll-engine` · `tax-engine` · `country-metadata` · `iso-3166` · `iso-13616` · `iso-9362` · `multi-country-payroll` · `localization` · `dynamic-forms` · `react-payroll` · `typescript` · `open-source`
