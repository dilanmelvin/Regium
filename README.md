<div align="center">

# Regium

### Global Workforce Compliance Infrastructure for Developers

**One TypeScript SDK for tax IDs, payroll rules, banking formats, labor law, immigration metadata, and dynamic compliance forms — covering every country in the world.**

[![npm](https://img.shields.io/npm/v/@regium/core?label=%40regium%2Fcore&color=0f172a)](https://www.npmjs.com/package/@regium/core)
[![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6.svg)](https://www.typescriptlang.org/)
[![Countries](https://img.shields.io/badge/countries-218-success.svg)](#country-coverage)

[Install](#install) · [Quick start](#quick-start) · [Who is this for](#who-is-this-for) · [How it works](#how-it-works) · [Country coverage](#country-coverage) · [Docs](./docs/)

</div>

---

## What is Regium?

Regium is an **open-source compliance layer** that sits between your application and the complexity of global workforce regulations. Think of it as:

- **Stripe** — but for workforce compliance instead of payments
- **Prisma** — but for country metadata instead of databases
- **Zod** — but for tax IDs, payroll rules, and banking formats instead of generic schemas

It gives you a single, typed, deterministic JavaScript/TypeScript API to:

1. **Look up country metadata** — ISO codes, currencies, timezones, languages, legal systems, tax authorities for 218 jurisdictions.
2. **Validate compliance IDs** — PAN, Aadhaar, SSN, NINO, NRIC, CPF, CNPJ, IBAN, SWIFT, Emirates ID, SIN, ABN, SIREN, and dozens more — with real checksum algorithms (mod-97, Verhoeff, Luhn, dual check digits).
3. **Compute payroll** — gross-to-net calculations using country-specific salary components, statutory contributions (EPF, CPP, NI, INSS, CPF-SG, Super), and progressive tax slabs.
4. **Generate dynamic forms** — auto-build localized employee/company onboarding forms from metadata, with field-level validation wired in.
5. **Query labor rules** — statutory leave, notice periods, working hours, minimum wage, termination rules.
6. **Validate banking details** — IBAN (ISO 13616 mod-97), SWIFT/BIC (ISO 9362), IFSC, BSB, ABA routing, sort codes, transit numbers.
7. **Time-travel** — pass an `effectiveDate` and get the rules that were legally valid on that date, so historical payroll runs remain reproducible even years later.

Everything is **metadata-driven** (data, not code), **versioned** (with effective dates), **source-cited** (every rule links to a government gazette or statute), and **tree-shakable** (import only the countries you need).

---

## Install

Regium is published to npm. Install with any JavaScript package manager:

```bash
# npm
npm install @regium/core @regium/country-in

# pnpm
pnpm add @regium/core @regium/country-in

# yarn
yarn add @regium/core @regium/country-in

# bun
bun add @regium/core @regium/country-in
```

Want every country at once? Install the bundle:

```bash
npm install @regium/core @regium/countries
```

This gives you all 218 countries (10 with full payroll/tax data, 208 with country profile + currency + authority metadata).

---

## Quick start

```ts
import { createRegium } from "@regium/core";
import india from "@regium/country-in";
import us from "@regium/country-us";

// Create a Regium instance with the countries you need.
const regium = createRegium({ plugins: [india, us] });

// 1. Country lookup
const config = regium.getCountryConfig("IN");
console.log(config.name);           // "India"
console.log(config.currency);       // { code: "INR", symbol: "₹", decimals: 2 }
console.log(config.primaryTaxAuthority); // "Income Tax Department (CBDT)"

// 2. Validate a tax ID
const result = regium.validate({ country: "IN", field: "PAN", value: "ABCPL1234C" });
console.log(result.ok);             // true
console.log(result.normalized);     // "ABCPL1234C"

// 3. Validate an IBAN (works for any country)
regium.validate({ country: "DE", field: "IBAN", value: "DE89370400440532013000" });
// → { ok: true, normalized: "DE89370400440532013000" }

// 4. Get employee compliance fields
const fields = regium.getEmployeeFields("IN");
// → [{ id: "Aadhaar", category: "national-id", ... }, { id: "PAN", ... }, ...]

// 5. Get payroll rules
const payroll = regium.getPayrollRules("IN");
// → { frequencies: ["monthly"], contributions: [...], components: [...] }

// 6. Get tax rules
const tax = regium.getTaxRules("US");
// → { regimes: [{ id: "single", slabs: [...] }, { id: "married-jointly", ... }] }

// 7. List all loaded countries
regium.listCountries();
// → ["IN", "US"]
```

### Load all 218 countries

```ts
import { createRegium } from "@regium/core";
import { allCountries } from "@regium/countries";

const regium = createRegium({ plugins: allCountries });
console.log(regium.listCountries().length); // 218
regium.getCountryConfig("VA"); // Vatican City
regium.getCountryConfig("TV"); // Tuvalu
regium.getCountryConfig("HK"); // Hong Kong
```

### Compute payroll (gross → net)

```ts
import { computePayroll } from "@regium/payroll";

const result = computePayroll({
  annualGross: 1500000,                    // ₹15 lakh
  rules: regium.getPayrollRules("IN"),     // India payroll rules
  taxRules: regium.getTaxRules("IN"),      // India tax slabs
});

console.log(result.netMonthly);            // net take-home per month
console.log(result.taxAnnual);             // total annual tax
console.log(result.deductions);            // EPF, ESI, tax breakdown
console.log(result.employerContributions); // employer-side EPF, ESI
console.log(result.totalEmployerCost);     // total CTC
```

### React integration

```tsx
import { createRegium } from "@regium/core";
import { allCountries } from "@regium/countries";
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
          <input
            value={form.values[f.id] ?? ""}
            onChange={(e) => form.setValue(f.id, e.target.value)}
          />
          {form.errors[f.id]?.map((msg, i) => <span key={i} style={{color:"red"}}>{msg}</span>)}
        </div>
      ))}
      <button type="submit">Validate</button>
    </form>
  );
}
```

---

## Who is this for?

Regium is built for **developers and engineering teams** working on:

| Industry | Use case |
|----------|----------|
| **HRMS / HRIS** | Employee onboarding forms that adapt per country, ID validation, statutory leave tracking |
| **Global payroll** | One engine with country-specific rules — slabs, contributions, deductions, 13th month |
| **EOR (Employer of Record)** | Per-jurisdiction validation, work authorization metadata, termination rules |
| **Contractor management SaaS** | Validate tax IDs (PAN, EIN, VAT) before paying out |
| **Fintech & banking** | Validate IBAN, SWIFT, IFSC, BSB, routing numbers worldwide |
| **ERP suites** | Multi-country invoicing, expense management, time tracking with local rules |
| **Government tech** | Auditable, source-cited compliance metadata with version history |
| **Immigration platforms** | Visa categories, work permit types, dependent rules per country |

If your product touches **employees, contractors, payroll, tax, or banking** in more than one country, Regium saves you from building and maintaining country-specific logic yourself.

---

## How it works

### Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Your application                                 │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────────────┐
│      Adapters: @regium/react (Vue, Angular on roadmap)               │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────────────┐
│  Engines: forms · validators · payroll · tax · labor · banking · i18n│
└──────────────────────────────┬──────────────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────────────┐
│              @regium/core — registry · resolver · plugin host         │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────────────┐
│       Country packs (218 jurisdictions, one per ISO-3166 code)       │
└─────────────────────────────────────────────────────────────────────┘
```

### Key design decisions

| Decision | Why |
|----------|-----|
| **Metadata over code** | Country rules live as typed data objects, not branching `if/else` logic. This makes them auditable, diff-able, and version-controllable. |
| **Versioned with effective dates** | Every rule carries `effectiveFrom` / `effectiveTo`. Pass `effectiveDate` to `createRegium()` to time-travel — your March 2024 payroll always uses March 2024 rules. |
| **Source-cited** | Every metadata envelope includes `source[]` with government URLs and fetch dates. No rule exists without a citation. |
| **Tree-shakable** | Each country is a separate npm package. Import only what you need. Bundle size for one country: 7–12 KB minified. |
| **Framework-agnostic core** | `@regium/core` has zero framework dependencies. Adapters (`@regium/react`) are optional. |
| **Plugin system** | Register custom country packs, validators, or payroll providers without forking. |
| **Strict TypeScript** | `strict: true`, no `any`, branded types for IDs, exhaustive unions. Full IntelliSense. |
| **Dual ESM + CJS** | Every package ships both `import` and `require` entry points. Works in Node, Bun, Deno, browsers, edge runtimes. |

### The metadata envelope

Every piece of data in Regium is wrapped in a versioned envelope:

```ts
{
  id: "tax-rules.in.v2025",
  domain: "tax",
  jurisdiction: "IN",
  version: "2025.04.0",
  effectiveFrom: "2025-04-01",
  effectiveTo: undefined,           // still active
  deprecated: false,
  source: [{
    title: "Income Tax Act, 1961 — Finance Act 2025",
    url: "https://incometax.gov.in/",
    fetchedAt: "2025-04-01",
    primary: true
  }],
  data: { /* the actual tax slabs, regimes, cess, surcharges */ }
}
```

This means:
- You can **audit** when a rule was introduced and by whom.
- You can **reproduce** any historical calculation by passing the right `effectiveDate`.
- You can **deprecate** rules gracefully with `supersededBy` pointers.
- You can **diff** metadata changes in Git like any other code review.

---

## Packages

| Package | What it does | Size |
|---------|-------------|------|
| `@regium/core` | Registry, resolver, plugin host, `createRegium()` | ~8 KB |
| `@regium/types` | Zod schemas + TypeScript types for every domain | shared |
| `@regium/utils` | Date, currency, mask, checksum primitives | ~2 KB |
| `@regium/validators` | Composable validators (PAN, IBAN, CPF, NRIC, SSN…) | ~18 KB |
| `@regium/forms` | Schema-driven form engine | ~2 KB |
| `@regium/payroll` | Gross→net payroll engine | ~3 KB |
| `@regium/tax` | Progressive slab/regime tax engine | ~2 KB |
| `@regium/labor` | Leave accrual, working hours, termination | ~1 KB |
| `@regium/banking` | IBAN/SWIFT/IFSC/BSB/routing helpers | ~1 KB |
| `@regium/localization` | i18n, locale formatting | ~1 KB |
| `@regium/country-data` | Base metadata for all 218 countries | ~50 KB |
| `@regium/countries` | Master registry (base + 10 detailed overrides) | ~1 KB |
| `@regium/country-<iso2>` | Detailed pack per T1 country (IN, US, UK, DE, FR, SG, AE, BR, AU, CA) | 8–12 KB each |
| `@regium/react` | React adapter (RegiumProvider, useRegiumForm, useValidate) | ~2 KB |

### What users typically install

| Scenario | Install command |
|----------|----------------|
| Single country (India) | `npm install @regium/core @regium/country-in` |
| Two countries (US + UK) | `npm install @regium/core @regium/country-us @regium/country-uk` |
| All 218 countries | `npm install @regium/core @regium/countries` |
| React app with all countries | `npm install @regium/core @regium/countries @regium/react` |
| Payroll calculations | `npm install @regium/core @regium/country-in @regium/payroll` |

Transitive dependencies (`@regium/types`, `@regium/utils`, `@regium/validators`, etc.) are pulled in automatically — users never install them directly.

---

## Validators

Regium ships production-grade validators with real checksum algorithms:

| Validator | Country | Algorithm |
|-----------|---------|-----------|
| PAN | India | Regex (AAAAA9999A) |
| Aadhaar | India | Verhoeff checksum (12 digits) |
| GSTIN | India | GSTN check-digit algorithm |
| IFSC | India | Regex (AAAA0XXXXXX) |
| CIN | India | Regex (21 chars) |
| SSN | US | Format + exclusion rules |
| EIN | US | Format (XX-XXXXXXX) |
| ABA Routing | US | Weighted mod-10 checksum |
| NINO | UK | Regex with prefix exclusions |
| UTR | UK | 10-digit format |
| Steuer-ID | Germany | 11-digit with check logic |
| USt-IdNr | Germany | DE + 9 digits |
| SIREN | France | Luhn (9 digits) |
| SIRET | France | Luhn (14 digits) |
| TVA | France | FR + 2 chars + SIREN |
| NRIC/FIN | Singapore | Weighted checksum with prefix tables |
| UEN | Singapore | Multi-format regex |
| Emirates ID | UAE | 784-YYYY-NNNNNNN-N format |
| CPF | Brazil | Dual check-digit (mod-11) |
| CNPJ | Brazil | Dual check-digit (mod-11) |
| TFN | Australia | Weighted checksum (8 or 9 digits) |
| ABN | Australia | Weighted mod-89 checksum |
| BSB | Australia | 6-digit format |
| SIN | Canada | Luhn (9 digits) |
| IBAN | Global | ISO 13616 mod-97 |
| SWIFT/BIC | Global | ISO 9362 format |
| E.164 Phone | Global | International format |
| Email | Global | RFC 5322 subset |

All validators are:
- **Pure functions** — no side effects, no network calls
- **Deterministic** — same input always gives same output
- **Individually importable** — tree-shake to ~1 KB per validator
- **Composable** — chain regex → checksum → custom logic

```ts
import { iban, pan, cpf, nric } from "@regium/validators";

iban.validate("DE89370400440532013000");  // mod-97 verified
pan.validate("ABCPL1234C");               // regex
cpf.validate("39053344705");              // dual check digit
nric.validate("S1234567D");               // weighted checksum
```

---

## Country coverage

Regium ships **218 countries and territories** — every UN member state, observers (Vatican, Palestine), partially recognised states (Kosovo, Taiwan), and 21 major territories.

### Tier system

| Tier | What's included | Countries |
|------|----------------|-----------|
| **T1** ★ | Full payroll, tax slabs, labor rules, banking, immigration, validators, forms | IN, US, GB, DE, FR, SG, AE, BR, AU, CA (10) |
| **T4** | Country profile, currency, ISO codes, timezone, tax authority, base structure | All remaining 208 |

T4 countries are progressively promoted to T3 → T2 → T1 as detailed rules are authored and source-cited.

### T1 countries (full data)

| Flag | Code | Country | Package |
|------|------|---------|---------|
| 🇮🇳 | IN | India | `@regium/country-in` |
| 🇺🇸 | US | United States | `@regium/country-us` |
| 🇬🇧 | GB | United Kingdom | `@regium/country-uk` |
| 🇩🇪 | DE | Germany | `@regium/country-de` |
| 🇫🇷 | FR | France | `@regium/country-fr` |
| 🇸🇬 | SG | Singapore | `@regium/country-sg` |
| 🇦🇪 | AE | United Arab Emirates | `@regium/country-ae` |
| 🇧🇷 | BR | Brazil | `@regium/country-br` |
| 🇦🇺 | AU | Australia | `@regium/country-au` |
| 🇨🇦 | CA | Canada | `@regium/country-ca` |

### Territories included

Hong Kong, Macau, Puerto Rico, Guam, Jersey, Guernsey, Isle of Man, Cayman Islands, Bermuda, British Virgin Islands, Curaçao, Aruba, Greenland, Faroe Islands, Gibraltar, Réunion, French Polynesia, New Caledonia, Martinique, Guadeloupe, US Virgin Islands.

---

## The playground

The repo includes a live interactive playground (Vite + React) with a clean white UI:

```bash
git clone https://github.com/<your-org>/regium.git
cd regium
pnpm install
pnpm build
pnpm playground        # → http://localhost:5173
```

Features:
- **Country dropdown** with all 218 countries — search by name, ISO code, or currency
- **Overview tab** — country profile, currency, tax authority, leave policies
- **Validators tab** — try any compliance ID interactively with live validation
- **Form tab** — auto-generated employee/company forms with field-level errors
- **Payroll tab** — gross→net simulator with deductions and employer cost breakdown

---

## How it was developed

### Tech stack

| Layer | Technology |
|-------|-----------|
| Language | TypeScript (strict mode) |
| Runtime | Node.js ≥ 18.17 (also works in Bun, Deno, browsers, edge) |
| Package manager | pnpm 9 (workspaces) |
| Monorepo orchestrator | Turborepo |
| Bundler | tsup (esbuild under the hood) |
| Schema validation | Zod |
| Linter / formatter | Biome |
| Testing | Vitest |
| Release management | Changesets |
| CI/CD | GitHub Actions |
| Playground | Vite + React 18 |

### Repository structure

```
regium/
├── packages/
│   ├── core/                  Registry, resolver, plugin host
│   ├── shared-types/          Zod schemas + TS types
│   ├── shared-utils/          Date, currency, mask, checksum
│   ├── validators/            All composable validators
│   ├── forms/                 Schema-driven form engine
│   ├── payroll/               Gross→net engine
│   ├── tax/                   Slab/regime engine
│   ├── labor/                 Leave + working hours
│   ├── banking/               IBAN/SWIFT/IFSC/BSB
│   ├── localization/          i18n primitives
│   ├── country-data/          Base metadata for 218 countries
│   ├── countries/             Master registry
│   ├── country-india/         T1: India (full)
│   ├── country-us/            T1: United States (full)
│   ├── country-uk/            T1: United Kingdom (full)
│   ├── country-germany/       T1: Germany (full)
│   ├── country-france/        T1: France (full)
│   ├── country-singapore/     T1: Singapore (full)
│   ├── country-uae/           T1: UAE (full)
│   ├── country-brazil/        T1: Brazil (full)
│   ├── country-australia/     T1: Australia (full)
│   ├── country-canada/        T1: Canada (full)
│   └── react/                 React adapter
├── apps/
│   ├── playground/            Live sandbox (Vite + React)
│   └── docs/                  Static documentation site
├── tools/
│   └── tsconfig/              Shared TypeScript configs
├── scripts/
│   ├── smoke-test.mjs         End-to-end verification
│   └── publish.mjs            Secure npm publish helper
├── docs/                      Guides and documentation
│   ├── getting-started.md
│   ├── examples.md
│   ├── running.md
│   ├── publishing.md
│   ├── go-live.md
│   └── implementation-plan.md
├── .github/workflows/         CI + release automation
├── .changeset/                Version management
├── README.md                  ← you are here
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
└── LICENSE                    Apache-2.0
```

### Build pipeline

```
pnpm install     → installs all 25 workspace packages
pnpm build       → Turborepo builds in dependency order (parallel where possible)
pnpm lint        → Biome checks formatting + lint rules
pnpm typecheck   → tsc --noEmit across all packages
pnpm smoke-test  → packs, installs in sandbox, validates 218 countries
pnpm playground  → boots the interactive UI at localhost:5173
pnpm publish:npm → builds + tests + publishes to npm
```

---

## Plugin system

Regium is extensible. You can register custom country packs, validators, or providers without forking:

```ts
import { createRegium } from "@regium/core";
import india from "@regium/country-in";

const regium = createRegium({
  plugins: [
    india,
    {
      name: "@acme/regium-private",
      version: "1.0.0",
      setup(host) {
        // Register a custom validator
        host.registerValidator({
          id: "acme.employee-badge",
          description: "Acme Corp badge ID",
          jurisdiction: "global",
          kind: "regex",
          validate(value) {
            const ok = /^ACME-\d{6}$/.test(value.trim());
            return ok
              ? { ok: true, errors: [], normalized: value.trim() }
              : { ok: false, errors: [{ code: "E_FORMAT", message: "Invalid badge" }] };
          },
        });

        // Register a private country pack
        host.registerCountryPack(myPrivateCountryPack);
      },
    },
  ],
});
```

---

## Time-travel (effective dates)

Laws change. Tax slabs update every budget. Minimum wages rise quarterly. Regium handles this with **effective dates** on every metadata item:

```ts
// Get rules valid TODAY
const regium = createRegium({ plugins: [india] });

// Get rules valid on a SPECIFIC DATE (e.g., for a historical payroll run)
const regiumMar2024 = createRegium({
  plugins: [india],
  effectiveDate: "2024-03-15",
});

// The tax slabs returned will be the ones legally valid on March 15, 2024
regiumMar2024.getTaxRules("IN");
```

This means:
- Your **March 2024 payroll** always uses March 2024 rules, even if you run it in 2026.
- **Auditors** can reproduce any historical calculation exactly.
- **Migrations** between rule versions are explicit and traceable.

---

## Production characteristics

| Property | Detail |
|----------|--------|
| **Bundle size** | 7–12 KB per country (minified). ~30 KB for a typical 2-country setup. |
| **Runtime** | Works in Node 18+, Bun, Deno, Cloudflare Workers, Vercel Edge, browsers. |
| **Side effects** | None. Every function is pure. `sideEffects: false` in every package.json. |
| **Tree-shaking** | Full. Import one validator → get ~1 KB, not the whole 18 KB bundle. |
| **TypeScript** | Strict mode. Full IntelliSense. Branded types for IDs. |
| **Dual format** | ESM (`import`) + CJS (`require`) + `.d.ts` declarations in every package. |
| **Zero dependencies** | Core has no third-party runtime deps (Zod is a build-time schema tool). |
| **Deterministic** | Same inputs → same outputs. No randomness, no network calls, no side effects. |

---

## Documentation

| Document | Description |
|----------|-------------|
| [Getting started](./docs/getting-started.md) | 60-second tour of the repo |
| [Running](./docs/running.md) | Setup on macOS, Linux, Windows |
| [Examples](./docs/examples.md) | 10 copy-paste recipes |
| [Publishing](./docs/publishing.md) | Deploy to npm, pnpm, yarn, bun, JSR, CDN |
| [Go live](./docs/go-live.md) | Step-by-step first publish guide |
| [Project structure](./docs/project-structure.md) | What lives where and why |
| [Implementation plan](./docs/implementation-plan.md) | Full architecture, roadmap, 26 sections |
| [Contributing](./CONTRIBUTING.md) | Add a country, validator, or adapter |
| [Security](./SECURITY.md) | Vulnerability reporting |

---

## Contributing

We welcome contributions — especially new country packs, validator improvements, and framework adapters. See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide.

Quick version:

```bash
git clone https://github.com/<your-org>/regium.git
cd regium
pnpm install
pnpm build
pnpm smoke-test    # verify everything works
# make your changes...
pnpm changeset     # describe the change
git commit && git push
```

---

## Roadmap

- **Phase 1** (done) — Core, validators, forms, payroll, tax, labor, banking, 10 T1 countries, 218 total, React adapter, playground
- **Phase 2** — Promote 40 more countries to T2/T1, Vue adapter, Angular adapter
- **Phase 3** — Hosted API (optional SaaS), marketplace for private country packs
- **Phase 4** — Government partnerships for authoritative data feeds, multilingual docs
- **Phase 5** — Foundation governance, ISO-level metadata interchange standard

See [Implementation plan](./docs/implementation-plan.md) for the full 26-section architecture document.

---

## License

[Apache-2.0](./LICENSE) — permissive, patent grant, enterprise-friendly.

---

## Keywords

`workforce compliance` · `global payroll` · `tax id validator` · `iban validator` · `swift validator` · `pan validator` · `gstin validator` · `aadhaar validator` · `cpf validator` · `cnpj validator` · `nric validator` · `emirates id` · `ssn validator` · `nino validator` · `sin validator` · `hrms sdk` · `hris sdk` · `eor sdk` · `payroll engine` · `tax engine` · `country metadata` · `iso 3166` · `iso 13616` · `iso 9362` · `multi-country payroll` · `localization` · `i18n` · `compliance metadata` · `dynamic forms` · `react payroll` · `typescript` · `workforce management` · `employer of record` · `contractor management` · `banking validation` · `ifsc validator` · `bsb validator` · `aba routing` · `sort code`
