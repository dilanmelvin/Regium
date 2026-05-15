<div align="center">

# ██████╗ ███████╗ ██████╗ ██╗██╗   ██╗███╗   ███╗
# ██╔══██╗██╔════╝██╔════╝ ██║██║   ██║████╗ ████║
# ██████╔╝█████╗  ██║  ███╗██║██║   ██║██╔████╔██║
# ██╔══██╗██╔══╝  ██║   ██║██║██║   ██║██║╚██╔╝██║
# ██║  ██║███████╗╚██████╔╝██║╚██████╔╝██║ ╚═╝ ██║
# ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝ ╚═════╝ ╚═╝     ╚═╝

### Global workforce compliance infrastructure for developers

**One TypeScript SDK for tax IDs, payroll, banking, labor law, and immigration metadata across every country in the world.**

[![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6.svg)](https://www.typescriptlang.org/)
[![pnpm workspaces](https://img.shields.io/badge/pnpm-workspaces-f69220.svg)](https://pnpm.io/)
[![Built with Turborepo](https://img.shields.io/badge/built%20with-Turborepo-EF4444.svg)](https://turbo.build/)

[Quick start](#quick-start) · [Why Regium](#why-regium) · [Packages](#packages) · [Run the playground](#run-the-playground-locally) · [Publish to npm](./PUBLISHING.md)

</div>

---

## What is Regium?

Regium is the **compliance layer of the internet for workforce systems**. The way Stripe abstracts payments and Prisma abstracts databases, Regium abstracts global workforce compliance.

It gives you a single, typed, deterministic API to look up:

- 🌍 **Country metadata** — ISO codes, currency, timezones, languages, legal system, tax authority
- 🏢 **Company compliance** — VAT, GST, EIN, CIN, CNPJ, UEN, ABN, SIREN, and more
- 👤 **Employee compliance** — National IDs (PAN, SSN, NINO, NRIC, Aadhaar, CPF, Emirates ID, SIN…)
- 💰 **Payroll & tax** — Slabs, regimes, deductions, contributions, statutory benefits
- 🏦 **Banking** — IBAN (mod-97), SWIFT/BIC, IFSC, BSB, ABA routing — validated and formatted
- 📋 **Dynamic forms** — Auto-generate localized forms from country metadata
- ✅ **Composable validators** — Regex, checksum, async, fully tree-shakable
- 📅 **Versioned legal metadata** — Reproduce historical payroll runs with `effectiveDate`

It's **framework-agnostic at the core** with **first-class adapters** for React (and Vue/Angular on the roadmap). It runs anywhere JavaScript runs: Node, Bun, Deno, Cloudflare Workers, Vercel Edge, browsers.

## Why Regium?

If you build any of the following, you've felt the pain:

- HRMS / HRIS platforms expanding to a new market
- Payroll engines (global or local)
- ERP suites going multi-country
- EOR (Employer of Record) and contractor management SaaS
- Fintech and banking integrations validating account / tax IDs
- Government tech and compliance vendors

**Without Regium**, every country is a fork: bespoke regex per ID, hardcoded slabs, scattered i18n strings, and rules that go stale the moment a Finance Bill is passed.

**With Regium**, every country is **data**: typed, versioned, source-cited, audited, and shipped as an independent npm package you can pin, swap, or override.

```ts
import { createRegium } from "@regium/core";
import india from "@regium/country-in";
import us from "@regium/country-us";

const regium = createRegium({ plugins: [india, us] });

regium.getCountryConfig("IN").currency;            // → { code: "INR", symbol: "₹", … }
regium.validate({ country: "IN", field: "PAN", value: "ABCPL1234C" });
//   → { ok: true, normalized: "ABCPL1234C" }
regium.getEmployeeFields("US");                     // → ComplianceField[] for US
```

## Comparable to

| Project       | What we borrowed                                        |
| ------------- | ------------------------------------------------------- |
| **Stripe**    | Versioned APIs, country packs, enterprise reliability   |
| **Prisma**    | Schema-driven, codegen, DX-first                        |
| **TanStack**  | Framework-agnostic core + adapters                      |
| **Zod**       | Composable schemas, type inference, tiny core           |

## Quick start

> **Tip:** install only the country packs you need — they're tree-shakable and ~5–11 KB each minified.

### npm

```bash
npm install @regium/core @regium/country-in
```

### pnpm

```bash
pnpm add @regium/core @regium/country-in
```

### yarn

```bash
yarn add @regium/core @regium/country-in
```

### bun

```bash
bun add @regium/core @regium/country-in
```

### Use it

```ts
import { createRegium } from "@regium/core";
import india from "@regium/country-in";

const regium = createRegium({ plugins: [india] });

// Country lookup
regium.getCountryConfig("IN");

// Validate a tax ID
regium.validate({ country: "IN", field: "PAN", value: "ABCPL1234C" });

// Generate localized employee fields
regium.getEmployeeFields("IN");

// Compute payroll
import { computePayroll } from "@regium/payroll";
computePayroll({
  annualGross: 1500000,
  rules: regium.getPayrollRules("IN"),
  taxRules: regium.getTaxRules("IN"),
});
```

Want everything bundled? `@regium/countries` re-exports all built-in packs:

```ts
import { createRegium } from "@regium/core";
import { allCountries } from "@regium/countries";

const regium = createRegium({ plugins: allCountries });
```

## Packages

| Package                     | Description                                  | Size (min) |
| --------------------------- | -------------------------------------------- | ---------- |
| `@regium/core`              | Registry, resolver, plugin host              | ~3 KB      |
| `@regium/types`             | Shared Zod schemas + TypeScript types        | shared     |
| `@regium/utils`             | Date, locale, currency, mask, checksum       | ~2 KB      |
| `@regium/validators`        | Composable validators (regex, checksum)      | ~13 KB     |
| `@regium/forms`             | Schema-driven form engine                    | ~2 KB      |
| `@regium/payroll`           | Gross→net payroll engine                     | ~2 KB      |
| `@regium/tax`               | Slab/regime tax engine                       | ~2 KB      |
| `@regium/labor`             | Leave + working-hours engine                 | ~1 KB      |
| `@regium/banking`           | IBAN, SWIFT, IFSC, BSB, routing              | ~1 KB      |
| `@regium/localization`      | i18n primitives                              | ~1 KB      |
| `@regium/countries`         | Master registry of every built-in pack       | ~1 KB      |
| `@regium/country-<iso2>`    | One package per country (10 shipped, more soon) | 7–11 KB |
| `@regium/react`             | React adapter (provider, hooks)              | ~2 KB      |

### Country packs shipped today

Regium ships **218 countries and territories** out of the box — every UN member state, plus observers (Vatican, Palestine), partially recognised states (Kosovo, Taiwan), and 21 major territories (Hong Kong, Macau, Puerto Rico, Jersey, Cayman Islands, …).

Each country has a base **T4** pack with country profile, currency, primary tax authority, and the right metadata structure. **10 countries ship at T1** with full payroll, tax, labor, banking, immigration data and jurisdictional validators:

| Code | Country | Package | Tier |
| ---- | ------- | ------- | ---- |
| 🇮🇳 IN | India          | `@regium/country-in` | **T1** ★ |
| 🇺🇸 US | United States  | `@regium/country-us` | **T1** ★ |
| 🇬🇧 GB | United Kingdom | `@regium/country-uk` | **T1** ★ |
| 🇩🇪 DE | Germany        | `@regium/country-de` | **T1** ★ |
| 🇫🇷 FR | France         | `@regium/country-fr` | **T1** ★ |
| 🇸🇬 SG | Singapore      | `@regium/country-sg` | **T1** ★ |
| 🇦🇪 AE | UAE            | `@regium/country-ae` | **T1** ★ |
| 🇧🇷 BR | Brazil         | `@regium/country-br` | **T1** ★ |
| 🇦🇺 AU | Australia      | `@regium/country-au` | **T1** ★ |
| 🇨🇦 CA | Canada         | `@regium/country-ca` | **T1** ★ |
| …    | 208 more       | bundled in `@regium/country-data` | T4 |

The roadmap promotes T4 → T3 → T2 → T1 progressively as we author detailed payroll and tax rules for each jurisdiction. See [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md) for the onboarding workflow.

## Validators

Out of the box, Regium ships validators for:

- **Tax IDs** — PAN · TAN · GSTIN (with check digit) · EIN · UTR · USt-IdNr · TVA · TRN · BN
- **National IDs** — Aadhaar (Verhoeff) · SSN · NINO · NRIC/FIN · CPF · CNPJ · CURP · Emirates ID · SIN
- **Banking** — IBAN (ISO 13616 mod-97) · SWIFT (ISO 9362) · IFSC · BSB · ABA routing · sort code · transit
- **Corporate** — CIN · SIREN · SIRET · CNPJ · UEN · ABN · ACN
- **Postal** — ZIP · UK postcode · PLZ · code postal · CEP · Canadian postal · SG postal
- **Generic** — E.164 phone · RFC 5322 email · Luhn (mod-10) · Verhoeff · ISO 7064

All validators are pure, deterministic, side-effect-free, and individually tree-shakable.

```ts
import { iban, pan, cnpj } from "@regium/validators";

iban.validate("DE89 3704 0044 0532 0130 00"); // mod-97 verified
pan.validate("ABCPL1234C");                    // regex
cnpj.validate("11.222.333/0001-81");           // dual check digit
```

## React integration

```tsx
import { createRegium } from "@regium/core";
import { allCountries } from "@regium/countries";
import { RegiumProvider, useRegiumForm, useValidate } from "@regium/react";

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
        <label key={f.id}>
          {typeof f.label === "string" ? f.label : f.label.en}
          <input
            value={form.values[f.id] ?? ""}
            onChange={(e) => form.setValue(f.id, e.target.value)}
          />
          {form.errors[f.id]?.map((msg) => <span>{msg}</span>)}
        </label>
      ))}
      <button type="submit">Validate</button>
    </form>
  );
}
```

## Run the playground locally

The repo includes a clean white-UI playground that lets you try every feature interactively.

> **Prerequisites:** Node.js ≥ 18.17 and pnpm ≥ 9 (works on macOS, Linux, Windows). Full per-OS setup in [`RUNNING.md`](./RUNNING.md).

```bash
git clone https://github.com/<your-org>/regium.git
cd regium
pnpm install
pnpm build
pnpm playground            # → http://localhost:5173
```

The playground gives you:

- A **country dropdown** that drives every section
- **Overview** — currency, languages, tax authority, leave policies
- **Validators** — try any compliance ID interactively
- **Form** — auto-generated employee/company forms with live validation
- **Payroll** — gross→net simulator with deductions and employer cost

## Documentation

| Document | Purpose |
| -------- | ------- |
| [`RUNNING.md`](./RUNNING.md)              | Run / develop the project on macOS, Linux, Windows |
| [`GETTING_STARTED.md`](./GETTING_STARTED.md) | A 60-second tour of the repo                    |
| [`EXAMPLES.md`](./EXAMPLES.md)            | 10 copy-paste recipes                              |
| [`PUBLISHING.md`](./PUBLISHING.md)        | Publish to npm / pnpm / yarn / bun / GitHub / JSR |
| [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md) | Full architecture & roadmap            |
| [`CONTRIBUTING.md`](./CONTRIBUTING.md)    | Add a country, validator, or adapter               |
| [`SECURITY.md`](./SECURITY.md)            | Reporting vulnerabilities                          |

## How it works

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Your application                                 │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────────────┐
│      Adapters (React / Vue / Angular / framework-agnostic)           │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────────────┐
│  Engines  forms · validators · payroll · tax · labor · banking · i18n│
└──────────────────────────────┬──────────────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────────────┐
│              Core registry · resolver · plugin host                  │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────────────┐
│       Country packs (one per ISO-3166 jurisdiction, 250+)            │
└─────────────────────────────────────────────────────────────────────┘
```

Every metadata document — country, payroll, tax, labor — is wrapped in a versioned envelope:

```ts
{
  id: "tax-rules.in.v2025",
  jurisdiction: "IN",
  version: "2025.04.0",
  effectiveFrom: "2025-04-01",
  source: [{ title: "Income Tax Act, 1961 — Finance Act 2025", url: "https://incometax.gov.in/", … }],
  data: { /* the actual rules */ }
}
```

Pass `effectiveDate` to `createRegium()` to **time-travel** — your March 2024 payroll always uses March 2024 rules, even on a 2026 install.

## Production ready

- 🔒 **Apache-2.0 licensed** — patent grant, enterprise friendly
- 🧪 **Strict TypeScript** — `strict: true`, no `any`, exhaustive unions
- 📦 **Tree-shakable** — `sideEffects: false`, ESM + CJS dual builds
- 🌐 **Universal runtime** — Node, Bun, Deno, edge, browser
- 📅 **Versioned everything** — semver + calendar tag + per-rule effective dates
- 🛠 **CI/CD wired** — GitHub Actions for lint, typecheck, build, test, npm publish
- 📚 **Source-cited** — every metadata change must cite a primary government source

## Use cases

- HRMS & HRIS — onboarding flows that adapt per country
- Global payroll — one engine, country-specific rules
- EOR / contractor SaaS — per-jurisdiction validation and forms
- Banking & fintech — validate any IBAN, IFSC, routing number worldwide
- Government tech & gov-cloud — auditable, source-cited compliance metadata
- ERP — bolt onto invoicing, expense, time tracking modules

## Contributing

We welcome country pack contributions, validator improvements, and adapter ports. See [`CONTRIBUTING.md`](./CONTRIBUTING.md) and the [country onboarding workflow](./CONTRIBUTING.md#adding-a-country-pack).

## Keywords

`workforce compliance` · `global payroll` · `tax id validator` · `iban validator` · `swift validator` · `pan validator` · `gstin validator` · `aadhaar validator` · `cpf validator` · `cnpj validator` · `nric validator` · `emirates id` · `ssn validator` · `nino validator` · `sin validator` · `hrms sdk` · `hris sdk` · `eor sdk` · `payroll engine` · `tax engine` · `country metadata` · `iso 3166` · `iso 13616` · `iso 9362` · `multi-country payroll` · `localization` · `i18n` · `compliance metadata` · `dynamic forms` · `react payroll` · `typescript`

## License

[Apache-2.0](./LICENSE) © Regium Contributors
