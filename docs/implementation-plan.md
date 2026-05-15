# Regium — Implementation Plan

> **Tagline:** Global workforce compliance infrastructure for developers.
>
> **Mission:** Build a world-class, enterprise-grade, open-source TypeScript monorepo that provides a fully metadata-driven global workforce compliance infrastructure for HRMS, Payroll, ERP, SaaS, and Workforce Management platforms — covering **every country and territory in the world**.

---

## Table of Contents

1. [Vision & Positioning](#1-vision--positioning)
2. [Architectural Principles](#2-architectural-principles)
3. [High-Level Architecture](#3-high-level-architecture)
4. [Monorepo Structure](#4-monorepo-structure)
5. [Dependency Graph & Package Boundaries](#5-dependency-graph--package-boundaries)
6. [Metadata Architecture](#6-metadata-architecture)
7. [Country Schema Architecture](#7-country-schema-architecture)
8. [Validation Engine Design](#8-validation-engine-design)
9. [Form Engine Design](#9-form-engine-design)
10. [Plugin System Design](#10-plugin-system-design)
11. [TypeScript Architecture](#11-typescript-architecture)
12. [Build Pipeline](#12-build-pipeline)
13. [Testing Architecture](#13-testing-architecture)
14. [Release Architecture](#14-release-architecture)
15. [Documentation Architecture](#15-documentation-architecture)
16. [CI/CD Architecture](#16-cicd-architecture)
17. [Versioning Strategy](#17-versioning-strategy)
18. [Data Maintenance Strategy](#18-data-maintenance-strategy)
19. [Country Onboarding Strategy](#19-country-onboarding-strategy)
20. [Contribution Guidelines](#20-contribution-guidelines)
21. [Scalability Strategy](#21-scalability-strategy)
22. [Enterprise Adoption Strategy](#22-enterprise-adoption-strategy)
23. [Open-Source Governance](#23-open-source-governance)
24. [Long-Term Roadmap](#24-long-term-roadmap)
25. [Phase-by-Phase Execution Plan](#25-phase-by-phase-execution-plan)
26. [Country Coverage Matrix](#26-country-coverage-matrix)

---

## 1. Vision & Positioning

Regium is the **compliance layer of the internet for workforce systems**. Just as Stripe abstracts payments and Prisma abstracts databases, Regium abstracts global workforce compliance: tax IDs, statutory contributions, payroll rules, labor laws, banking formats, immigration metadata, and dynamic localized forms.

**Comparable inspirations:**

| Project    | What we borrow                                       |
| ---------- | ---------------------------------------------------- |
| Prisma     | Schema-driven, codegen, DX-first ergonomics          |
| Stripe SDK | Versioned APIs, country packs, enterprise reliability |
| TanStack   | Framework-agnostic core + framework adapters         |
| Next.js    | Plugin ecosystem, monorepo polish                    |
| Zod        | Composable schemas, type inference, tiny core        |

**Primary consumers:**

- HRMS / HRIS platforms
- Payroll engines (global and local)
- ERP suites
- Workforce / contractor management SaaS
- EOR (Employer of Record) platforms
- Fintech & banking integrations
- Government tech & compliance vendors

**Core value propositions:**

1. **One API, every country.** `getCountryConfig("IN")` returns a fully-typed, versioned, validated metadata bundle.
2. **Metadata-first.** Every rule (tax, ID format, payroll cadence) is data, not code — auditable, diff-able, version-controlled.
3. **Framework-agnostic core, with first-class adapters** for React, Vue, Angular, and server runtimes.
4. **Versioned legal metadata** with `effectiveFrom` / `effectiveTo` so historical payroll runs remain reproducible.
5. **Plugin system** for private country packs, custom validators, proprietary payroll providers.

---

## 2. Architectural Principles

1. **Metadata over code.** Country rules live as JSON/TS data, not branching logic.
2. **Composable, tree-shakable packages.** Consumers pay only for the countries they import.
3. **Strict TypeScript.** `strict: true`, no `any`, exhaustive unions, branded types for IDs.
4. **Schema-first.** Every metadata file is validated by a Zod schema at build time.
5. **Versioned everything.** All metadata items carry `version`, `effectiveFrom`, `effectiveTo`, `deprecated`, `supersededBy`.
6. **Deterministic builds.** Same inputs → same outputs. Reproducible payroll history.
7. **Open by default, extensible by design.** Public registry + private plugin packs.
8. **Localization-native.** ICU MessageFormat, BCP-47 locales, RTL support, Unicode-safe.
9. **Zero runtime surprises.** All side-effect-free, pure functions in core.
10. **Backward compatibility.** Breaking changes require a major bump and migration codemod.

---

## 3. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Consumer Applications                         │
│   HRMS · Payroll · ERP · EOR · Banking · Government · SaaS          │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────────────┐
│                     Framework Adapters                               │
│        @regium/react   @regium/vue   @regium/angular                 │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────────────┐
│                       Domain Engines                                 │
│  forms · validators · payroll · tax · labor · banking · localization │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────────────┐
│                          Core Runtime                                │
│   @regium/core   (registry · resolver · plugin host · versioning)    │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────────────┐
│                         Country Packs                                │
│   country-india · country-us · country-uk · …  (250+ jurisdictions)  │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────────────┐
│                  Shared Foundations                                  │
│      shared-types · shared-utils · schemas · codegen tools           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. Monorepo Structure

```
regium/
├── apps/
│   ├── docs/                  # Nextra/Astro documentation site
│   ├── playground/            # Live sandbox (StackBlitz-style)
│   └── api/                   # Hosted REST/GraphQL gateway (optional SaaS)
│
├── packages/
│   ├── core/                  # @regium/core — registry, resolver, plugin host
│   ├── countries/             # @regium/countries — country index + loader
│   ├── validators/            # @regium/validators — regex, checksum, async
│   ├── forms/                 # @regium/forms — schema-driven form engine
│   ├── payroll/               # @regium/payroll — payroll calculation engine
│   ├── tax/                   # @regium/tax — tax rule engine
│   ├── labor/                 # @regium/labor — labor law engine
│   ├── banking/               # @regium/banking — IBAN/SWIFT/routing
│   ├── localization/          # @regium/localization — i18n, formatting
│   │
│   ├── country-india/         # @regium/country-in
│   ├── country-us/            # @regium/country-us
│   ├── country-uk/            # @regium/country-uk
│   ├── country-germany/       # @regium/country-de
│   ├── country-france/        # @regium/country-fr
│   ├── country-brazil/        # @regium/country-br
│   ├── country-japan/         # @regium/country-jp
│   ├── country-singapore/     # @regium/country-sg
│   ├── country-australia/     # @regium/country-au
│   ├── country-canada/        # @regium/country-ca
│   │   … (one package per ISO-3166 jurisdiction, ~250 total)
│   │
│   ├── react/                 # @regium/react
│   ├── vue/                   # @regium/vue
│   ├── angular/               # @regium/angular
│   │
│   ├── shared-types/          # @regium/types
│   └── shared-utils/          # @regium/utils
│
├── tools/
│   ├── codegen/               # Country pack scaffolder + JSON→TS generator
│   ├── schema-validator/      # CI metadata validator
│   ├── eslint-config/         # @regium/eslint-config
│   ├── tsconfig/              # @regium/tsconfig (base, lib, app)
│   └── biome-config/          # Shared Biome config
│
├── .changeset/
├── .github/workflows/
├── .kiro/
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── biome.json
├── tsconfig.base.json
└── README.md
```

### Naming Convention

- npm scope: `@regium/*`
- Country packs: `@regium/country-<iso2-lower>` (e.g. `@regium/country-in`)
- Territory packs: `@regium/territory-<code>` (e.g. `@regium/territory-hk`)



---

## 5. Dependency Graph & Package Boundaries

```
shared-types ──┬──► core ──┬──► countries ──┬──► country-* (250+)
               │           │                │
               ├──► utils  ├──► validators  ├──► payroll
               │           │                ├──► tax
               │           │                ├──► labor
               │           │                ├──► banking
               │           │                └──► localization
               │           │
               │           └──► forms
               │
               └──► (consumed by every package)

forms + validators + countries ──► react / vue / angular adapters
```

**Boundary rules (enforced by ESLint + Turborepo):**

| From               | May import                                  | Must NOT import         |
| ------------------ | ------------------------------------------- | ----------------------- |
| `shared-types`     | nothing                                     | anything                |
| `shared-utils`     | `shared-types`                              | core, countries, domain |
| `core`             | shared-*                                    | country packs, adapters |
| domain engines     | core, shared-*                              | adapters, country packs |
| country packs      | core, shared-*                              | other country packs     |
| framework adapters | core, domain engines, shared-*              | other adapters          |
| apps               | anything public                             | internal `/src` paths   |

Enforced via `eslint-plugin-boundaries` + a custom Turborepo `pipeline` that fails on illegal cross-package imports.

---

## 6. Metadata Architecture

Every metadata document is:

1. **A JSON file** authored by humans / pulled from authoritative sources.
2. **Validated** at build time against a Zod schema in `@regium/types`.
3. **Compiled** into a typed, frozen TypeScript export.
4. **Versioned** with effective dates.
5. **Indexed** in a global registry keyed by ISO code + domain + version.

### Universal Metadata Envelope

Every metadata item — country, validator, rule, document type — wraps its payload in this envelope:

```ts
interface MetadataEnvelope<T> {
  id: string;                        // stable slug, e.g. "in.tax.pan"
  domain: MetadataDomain;            // "country" | "tax" | "payroll" | …
  jurisdiction: JurisdictionCode;    // ISO2 / ISO3 / territory code
  version: string;                   // semver, e.g. "2025.04.0"
  effectiveFrom: ISODate;            // YYYY-MM-DD
  effectiveTo?: ISODate;             // exclusive end
  deprecated?: boolean;
  supersededBy?: string;             // id of replacement
  source: SourceCitation[];          // gov URLs, gazettes, statute refs
  authoredBy: string;                // GitHub handle / org
  reviewedBy?: string[];
  lastReviewedAt: ISODate;
  data: T;                           // the actual payload
}
```

### Metadata Domains

```
country · company · employee · payroll · tax · social-security ·
labor · banking · immigration · localization · validation · documents ·
contributions · leave · termination · employment-types · work-auth ·
benefits · pension · payroll-frequency
```

---

## 7. Country Schema Architecture

Every country package ships a fixed file layout, validated by `@regium/types`:

```
packages/country-<iso2>/
├── src/
│   ├── data/
│   │   ├── country.json
│   │   ├── company-fields.json
│   │   ├── employee-fields.json
│   │   ├── payroll-rules.json
│   │   ├── tax-rules.json
│   │   ├── labor-rules.json
│   │   ├── banking-rules.json
│   │   ├── localization.json
│   │   ├── validators.json
│   │   ├── immigration.json
│   │   └── leave-rules.json
│   ├── generated/             # auto-generated TS from JSON
│   │   └── index.ts
│   └── index.ts               # public entry, re-exports + register()
├── tests/
├── package.json
└── tsconfig.json
```

### 7.1 `country.json`

```jsonc
{
  "id": "country.in.v2025.04",
  "name": "India",
  "officialName": "Republic of India",
  "iso2": "IN",
  "iso3": "IND",
  "isoNumeric": "356",
  "phoneCode": "+91",
  "currency": { "code": "INR", "symbol": "₹", "decimals": 2 },
  "timezones": ["Asia/Kolkata"],
  "officialLanguages": ["hi", "en"],
  "payrollRegion": "APAC",
  "legalSystem": "common-law",
  "weekStart": "MON",
  "dateFormat": "DD/MM/YYYY",
  "numberFormat": { "decimal": ".", "thousands": "," },
  "primaryTaxAuthority": "Income Tax Department (CBDT)"
}
```

### 7.2 `company-fields.json`

Array of compliance ID definitions (PAN, TAN, GSTIN, CIN, EPFO, ESIC, PT, etc.) — each with regex, checksum strategy, label, helper text in multiple locales.

### 7.3 `employee-fields.json`

Array of employee identity fields (Aadhaar, PAN, UAN, ESIC, Passport, Driving License, etc.) with sensitivity flag, masking rules, and validators.

### 7.4 `payroll-rules.json`

Salary structure components, frequencies, gratuity, bonus act, leave encashment, overtime, statutory deductions.

### 7.5 `tax-rules.json`

Slabs, regimes (old/new), surcharge, cess, TDS, professional tax by state, advance tax schedule.

### 7.6 `labor-rules.json`

Working hours, weekly off, overtime caps, minimum wage by state, notice periods, termination rules, maternity/paternity leave, ESIC, PF, gratuity act.

### 7.7 `banking-rules.json`

IFSC format, account number length per bank, UPI, NEFT/RTGS/IMPS, virtual accounts.

### 7.8 `localization.json`

Locales, currency formatting, number formatting, date/time, address format, name order, gender options.

### 7.9 `validators.json`

References validator IDs from `@regium/validators` and binds them to fields.

### 7.10 `immigration.json`

Visa categories, work permit classes, dependent rules, FRRO/FRO, OCI/PIO, employment-pass equivalents.

### 7.11 `leave-rules.json`

Casual, sick, earned, maternity, paternity, public holidays, sabbatical, study leave, bereavement.



---

## 8. Validation Engine Design

### Goals

- Pure, deterministic, framework-agnostic.
- Composable: regex → checksum → async lookup.
- Localized error messages.
- Tree-shakable: only validators you import are bundled.

### Validator Contract

```ts
interface Validator<TInput = string, TContext = unknown> {
  id: string;                                    // "in.pan"
  description: string;
  jurisdiction: JurisdictionCode | "global";
  kind: "regex" | "checksum" | "async" | "composite" | "custom";
  validate(value: TInput, ctx?: TContext): ValidationResult;
  parse?(value: TInput): TInput;                 // canonicalize
  format?(value: TInput): string;                // pretty-print
  normalize?(value: TInput): TInput;             // strip spaces, casing
  mask?(value: TInput): string;                  // for display
}

interface ValidationResult {
  ok: boolean;
  errors: ValidationError[];
  warnings?: ValidationWarning[];
  normalized?: string;
}
```

### Built-in Categories

| Category         | Examples                                              |
| ---------------- | ----------------------------------------------------- |
| Tax IDs          | PAN, TAN, GSTIN, EIN, UTR, VAT (EU), CPF, RFC, NIP    |
| National IDs     | Aadhaar, SSN, SIN, NINO, NRIC, Emirates ID, CURP      |
| Banking          | IBAN (mod-97), SWIFT/BIC, IFSC, BSB, routing (ABA)    |
| Corporate        | CIN, SIREN/SIRET, CNPJ, UEN, ABN, CR Number          |
| Documents        | Passport (per country), driving license, visa numbers |
| Phone / Email    | E.164, RFC 5322 + DNS-aware async                     |
| Address / Postal | Postal code per country, address line rules           |

### Composition

```ts
const pan = compose(
  regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/),
  checksum.panFifthChar(),
  context.entityTypeMatches(),
);
```

### Async Validators

Optional plugin layer (e.g. GSTIN portal lookup, IBAN Bank lookup) gated behind `@regium/validators/async` to keep core sync and bundle-light.

---

## 9. Form Engine Design

### Goals

- Generate **dynamic forms** from country metadata.
- Output is a **framework-neutral schema**; adapters render it.
- Built-in support for conditional fields, dependent options, masking, async validation, i18n.

### Form Schema (simplified)

```ts
interface FormSchema {
  id: string;
  jurisdiction: JurisdictionCode;
  audience: "company" | "employee" | "payroll" | "custom";
  locale: BCP47;
  sections: FormSection[];
  version: string;
}

interface FormField {
  id: string;
  type: "text" | "number" | "date" | "select" | "multiselect"
      | "id" | "iban" | "phone" | "email" | "file" | "custom";
  label: LocalizedString;
  helpText?: LocalizedString;
  validatorIds: string[];        // resolved from @regium/validators
  required: boolean;
  sensitive?: boolean;           // PII / masking
  visibleIf?: ExpressionNode;    // small expression DSL
  dependsOn?: string[];
  options?: OptionSource;        // static or async
  masking?: MaskingRule;
}
```

### Rendering Adapters

- `@regium/react`     → Hooks (`useRegiumForm`) + headless components.
- `@regium/vue`       → Composables + headless components.
- `@regium/angular`   → Reactive Forms integration + directives.

### API

```ts
import { generateEmployeeForm } from "@regium/forms";

const schema = generateEmployeeForm({
  country: "DE",
  locale: "de-DE",
  variant: "full-time",
});
```

---

## 10. Plugin System Design

### Plugin Surface

```ts
interface RegiumPlugin {
  name: string;
  version: string;
  setup(host: PluginHost): void | Promise<void>;
}

interface PluginHost {
  registerCountryPack(pack: CountryPack): void;
  registerValidator(v: Validator): void;
  registerFormAdapter(a: FormAdapter): void;
  registerPayrollProvider(p: PayrollProvider): void;
  registerTaxEngine(e: TaxEngine): void;
  registerBankingProvider(b: BankingProvider): void;
  hooks: HookEmitter;             // beforeValidate, afterCompute, …
}
```

### Plugin Lifecycle

`discover → load → validate (zod) → register → freeze`

### Public APIs

```ts
import { createRegium } from "@regium/core";
import india from "@regium/country-in";
import myPrivatePack from "@acme/regium-country-xx";

const regium = createRegium({
  plugins: [india, myPrivatePack],
  effectiveDate: "2025-04-01",
});

regium.getCountryConfig("IN");
regium.getEmployeeFields("US");
regium.getCompanyFields("SG");
regium.getPayrollRules("AE");
regium.generateEmployeeForm("DE");
regium.validate({ country: "BR", field: "CPF", value: "..." });
```

---

## 11. TypeScript Architecture

### Compiler Settings

`tsconfig.base.json`:

```jsonc
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

### Type Patterns

- **Branded types** for IDs: `type PAN = Brand<string, "PAN">`.
- **Discriminated unions** for validators, fields, errors.
- **Const assertions** on metadata to preserve literal types.
- **Codegen** turns each `country.json` into a typed const so `getCountryConfig("IN")` returns `CountryConfig<"IN">` with literal-narrowed fields.
- **Type tests** via `tsd` and `expect-type` to lock the public API.



---

## 12. Build Pipeline

### Tooling

| Concern          | Tool                          |
| ---------------- | ----------------------------- |
| Package manager  | pnpm (workspaces)             |
| Task runner      | Turborepo                     |
| Bundler          | tsup (esbuild) per package    |
| Type checking    | tsc --noEmit (project refs)   |
| Linting/format   | Biome                         |
| Schema validate  | Zod + custom schema-validator |
| Codegen          | custom CLI (tools/codegen)    |
| Tests            | Vitest                        |
| Release          | Changesets                    |
| CI/CD            | GitHub Actions                |

### Turborepo Pipeline (`turbo.json`)

```jsonc
{
  "tasks": {
    "build":   { "dependsOn": ["^build", "validate-metadata"], "outputs": ["dist/**"] },
    "validate-metadata": { "outputs": [] },
    "typecheck": { "dependsOn": ["^build"] },
    "lint": {},
    "test":  { "dependsOn": ["^build"] },
    "docs":  { "dependsOn": ["^build"] }
  }
}
```

### Build Outputs

Each package emits:

- `dist/index.mjs` (ESM)
- `dist/index.cjs` (CJS)
- `dist/index.d.ts` (types)
- `dist/index.d.cts`
- Side-effect-free `package.json` exports map

### Country Pack Build Steps

1. Validate every JSON file against its Zod schema.
2. Run codegen → `src/generated/index.ts`.
3. tsup bundles `src/index.ts`.
4. Emit declaration files.
5. Verify tree-shaking with `@arethetypeswrong/cli` and `publint`.

---

## 13. Testing Architecture

### Test Layers

1. **Unit tests** — every validator, formatter, parser. Vitest.
2. **Schema tests** — every JSON file passes its Zod schema.
3. **Snapshot tests** — generated TS for each country pack.
4. **Property-based tests** — fast-check for IBAN, IDs, formatters.
5. **Type tests** — `tsd` + `expect-type` for the public API.
6. **Integration tests** — `createRegium()` end-to-end across packs.
7. **Adapter tests** — Testing Library (React/Vue), Karma/Jest (Angular).
8. **E2E** — Playwright on `apps/playground` and `apps/docs`.
9. **Compatibility tests** — Node 18/20/22, browsers, edge runtimes.
10. **Regression corpus** — real-world ID samples (synthetic, never PII).

### Coverage Targets

- Core: ≥ 95%
- Validators: 100% on regex/checksum branches
- Country packs: ≥ 90%
- Adapters: ≥ 85%

---

## 14. Release Architecture

### Changesets Flow

1. PR includes a `.changeset/*.md` describing impact (patch/minor/major) per package.
2. Bot comments on PRs without changesets.
3. On merge to `main`, the **Version Packages** PR is opened/updated.
4. Merging the Version PR triggers publish to npm with provenance.
5. GitHub Releases are auto-generated with grouped notes.

### Independent Versioning

Each package versions independently. Country packs use a **calendar-aware semver** scheme:

```
MAJOR.MINOR.PATCH-YYYY.MM
e.g. 1.4.0-2025.04
```

The suffix conveys "metadata snapshot for April 2025" while semver still governs API compatibility.

### Provenance & Supply Chain

- npm `--provenance` flag.
- `pnpm audit` in CI.
- Sigstore signing for tarballs.
- Frozen lockfile, Renovate for dependency updates with grouped PRs.

---

## 15. Documentation Architecture

`apps/docs` (Nextra or Astro Starlight) contains:

- **Getting started** — install, first call, first form.
- **Concepts** — metadata, versioning, plugins, forms.
- **Country reference** — auto-generated pages from each country pack.
- **Validator catalog** — searchable, with live playground.
- **Recipes** — payroll calc, EOR setup, multi-country onboarding.
- **API reference** — TypeDoc, generated per package.
- **Migration guides** — per major version, per country breaking change.
- **Changelog** — fed by Changesets.
- **Compliance ledger** — per-country audit trail of metadata changes.

Live playground: `apps/playground` powered by StackBlitz WebContainers or Sandpack.

---

## 16. CI/CD Architecture

### Workflows (`.github/workflows/`)

| Workflow              | Trigger              | Purpose                                            |
| --------------------- | -------------------- | -------------------------------------------------- |
| `ci.yml`              | PR / push            | install, lint, typecheck, test, build, validate    |
| `metadata-validate.yml` | PR touching `data/**` | strict Zod validation, source citation check     |
| `release.yml`         | push to `main`       | Changesets version PR + publish on merge           |
| `docs-deploy.yml`     | push to `main`       | build & deploy docs to Vercel/Cloudflare           |
| `nightly.yml`         | cron                 | full matrix, fuzz tests, dependency drift          |
| `country-coverage.yml` | weekly               | report missing fields per country, open issues    |
| `security.yml`        | PR / cron            | CodeQL, npm audit, OSV scan, secret scan           |

### Build Matrix

Node 18 / 20 / 22 × Linux / macOS / Windows × pnpm 9.

### Required Checks for Merge

`lint`, `typecheck`, `test`, `build`, `metadata-validate`, `changeset-present`.



---

## 17. Versioning Strategy

### Three Versioning Axes

1. **Package semver** — API contract (breaking, feature, fix).
2. **Metadata snapshot** — `YYYY.MM` calendar tag.
3. **Effective dates** — per-rule `effectiveFrom` / `effectiveTo` for legal accuracy.

### Why three?

A consumer running payroll for **March 2024** must get **March 2024 rules**, even if the package was installed in 2026. The resolver picks rules where `effectiveFrom ≤ payrollDate < effectiveTo`.

```ts
const regium = createRegium({ effectiveDate: "2024-03-15" });
regium.getTaxRules("IN"); // returns rules valid on 2024-03-15
```

### Deprecation Policy

- Minimum 6 months between `deprecated: true` and removal.
- Codemods shipped via `@regium/migrate` for every major.
- Deprecation warnings logged once per process, suppressible.

---

## 18. Data Maintenance Strategy

### Sources (per country)

- Government gazettes / official statutes.
- National tax / labor / immigration authorities.
- Reserve banks / central banks (for banking codes).
- ISO registries (3166, 4217, 9362, 13616).
- Reputable secondary sources (Big-4 advisories) only as cross-reference.

Every `MetadataEnvelope.source[]` must include at least one **primary** government URL, a fetched-at date, and an archived snapshot (Wayback or internal mirror).

### Update Cadence

| Domain                | Cadence            |
| --------------------- | ------------------ |
| Tax slabs             | Annually + budget  |
| Minimum wage          | Quarterly          |
| Social security caps  | Annually           |
| Banking codes         | Monthly            |
| Public holidays       | Annually           |
| Visa categories       | As changed         |

### Country Stewards

Each country has 1–3 **stewards** (CODEOWNERS) responsible for reviewing PRs and signing off metadata changes. Stewards may be community members, partner firms, or staff.

### Change Detection

- Scheduled scrapers monitor known authority URLs and open auto-PRs with diffs for stewards to review (never auto-merged).
- A monthly **Compliance Drift Report** lists countries with stale metadata.

---

## 19. Country Onboarding Strategy

### Onboarding Tiers

| Tier   | Coverage                                                       | Countries (initial) |
| ------ | -------------------------------------------------------------- | ------------------- |
| **T1** | Full payroll, tax, labor, banking, immigration, forms, tests   | IN, US, UK, DE, FR, BR, JP, SG, AU, CA |
| **T2** | Country, IDs, banking, basic payroll/tax, validators           | top 50 economies    |
| **T3** | Country, IDs, validators, localization                         | remaining UN states |
| **T4** | Country envelope only (stub) + open issue for contribution     | territories, disputed |

### Onboarding Workflow (per country)

1. `pnpm regium scaffold country <iso2>` — generates package skeleton.
2. Fill `country.json` (mandatory fields).
3. Add IDs to `company-fields.json` and `employee-fields.json`.
4. Wire validators in `validators.json`.
5. Cite sources in every envelope.
6. Add fixtures + tests.
7. Steward review → merge → publish.
8. Promote tier (T4 → T3 → T2 → T1) over time.

### Initial Cut-Over

Day 1 ships **all 250 jurisdictions at minimum T4** so `getCountryConfig()` never throws "country not found". Higher tiers land progressively.

---

## 20. Contribution Guidelines

`CONTRIBUTING.md` will require:

- Conventional Commits.
- Signed-off-by (DCO) on every commit.
- Source citation for any metadata change.
- Changeset entry.
- Steward review for country packs.
- Two-reviewer rule for `core`, `validators`, `forms`.

A `CODE_OF_CONDUCT.md` based on the Contributor Covenant 2.1.

A **Contributor Ladder**: triager → committer → maintainer → steward → TSC member.

---

## 21. Scalability Strategy

### Code-level

- Lazy-load country packs by ISO code. `import("@regium/country-in")`.
- Tree-shaking guaranteed by `sideEffects: false`.
- Codegen avoids `eval` / dynamic schemas at runtime.
- All metadata loaded as frozen objects; zero mutation.

### Repo-level

- Turborepo remote cache (Vercel or self-hosted).
- Sparse checkouts encouraged for large contributors.
- Country packs are **independent CI shards** — touching `country-in` doesn't rebuild `country-fr`.

### Data-level

- Per-country packs stay under ~50 KB minified.
- A separate `@regium/registry` static JSON CDN serves diff-indexable manifests for runtime resolution in serverless/edge.

### Runtime

- Edge-friendly (Cloudflare Workers, Vercel Edge, Deno Deploy).
- No Node-only APIs in `core`, `validators`, `forms`, country packs.

---

## 22. Enterprise Adoption Strategy

### Enterprise Deliverables

- **LTS releases** — 18 months of security + metadata patches.
- **SLA-backed support** offered via partner channel.
- **Private country packs** via the plugin system (no fork required).
- **SBOM** (CycloneDX) shipped with every release.
- **SOC 2 / ISO 27001** alignment for the hosted `apps/api` (optional SaaS).
- **Audit log** of metadata changes per country (GitHub-native + signed).
- **Air-gapped install** — tarball mirror + offline docs build.
- **Compliance reports** — exportable per country, per effective date.
- **Custom branding** for embedded forms (white-label adapters).

### Distribution

- Public: npm + JSR.
- Private: GitHub Packages or self-hosted Verdaccio.
- CDN: jsDelivr / unpkg for browser-only consumers.



---

## 23. Open-Source Governance

- **License:** Apache-2.0 (permissive, patent grant, enterprise-friendly).
- **Trademark:** "Regium" word-mark held by the project's foundation/owner with usage policy.
- **Governance model:** Lazy consensus with a Technical Steering Committee (TSC) of 5–7 members.
- **Decision making:** RFCs in a separate `regium/rfcs` repo, numbered, with a 14-day comment window.
- **Country sovereignty:** Stewards have final say on country-pack content within the schema contract.
- **Security policy:** `SECURITY.md` with a 90-day disclosure window and a private advisory channel.
- **Funding:** GitHub Sponsors, Open Collective, optional commercial entity for hosted SaaS.

---

## 24. Long-Term Roadmap

### Year 1 — Foundation

- Monorepo, core, validators, forms, 10 T1 countries, all 250 at T4.
- Public docs, playground, npm release.

### Year 2 — Breadth & Depth

- 50 T1 countries, 100 T2.
- Payroll engine GA.
- Hosted API (optional SaaS) with auth + rate limits.
- React Native and Solid adapters.

### Year 3 — Ecosystem

- Marketplace for private country packs and validators.
- Government partnerships for authoritative data feeds.
- Multilingual docs (10+ locales).
- Compliance ledger as a verifiable, signed feed.

### Year 4–5 — Standard

- Drive ISO/de-facto standards for workforce-compliance metadata interchange.
- University curriculum partnerships.
- Foundation-hosted (Linux Foundation / OpenJS) governance.

---

## 25. Phase-by-Phase Execution Plan

### Phase 0 — Repo Bootstrap (Week 1)

- Initialize pnpm + Turborepo + Biome + tsconfig base.
- Set up Changesets, GitHub Actions (CI skeleton), CODEOWNERS, security policy.
- Create `tools/codegen`, `tools/schema-validator`, shared configs.
- Publish empty placeholder packages to reserve npm names.

### Phase 1 — Type & Schema Foundation (Weeks 2–3)

- `@regium/types` with full Zod schemas for every metadata domain.
- `@regium/utils` with locale, date, currency primitives.
- `@regium/core` registry, resolver, plugin host, effective-date logic.
- Author RFC-001: Metadata Envelope.

### Phase 2 — Validators & Forms (Weeks 4–6)

- `@regium/validators` with global validators (IBAN, SWIFT, E.164, RFC 5322, Luhn, mod-97/11, ISO 7064).
- `@regium/forms` schema + headless engine.
- `@regium/localization` ICU MessageFormat wrapper.
- Adapters: `@regium/react` first, then Vue, then Angular.

### Phase 3 — T1 Country Packs (Weeks 7–14)

Ship 10 flagship packs at full depth: IN, US, UK, DE, FR, BR, JP, SG, AU, CA. Each with payroll, tax, labor, banking, immigration, forms, tests, docs, fixtures, samples.

### Phase 4 — Coverage Sweep (Weeks 15–22)

Generate **all remaining ~240 country/territory packs at T4**. Ensure `getCountryConfig()` never returns null for any ISO-3166 code listed in the requirement. Iterate to T3 where authoritative sources allow.

### Phase 5 — Domain Engines (Weeks 23–28)

- `@regium/payroll` calculation engine (gross→net, employer/employee contributions, statutory deductions, multi-country pay runs).
- `@regium/tax` engine (slab/regime selection, TDS, withholding).
- `@regium/labor` engine (leave accrual, working hours compliance).
- `@regium/banking` engine (multi-format account validation & routing).

### Phase 6 — Apps (Weeks 29–32)

- `apps/docs` GA with TypeDoc, country reference, validator catalog.
- `apps/playground` live sandbox.
- `apps/api` optional hosted REST + GraphQL gateway.

### Phase 7 — Hardening & 1.0 (Weeks 33–36)

- Property-based fuzzing, edge-runtime tests, perf benchmarks.
- Security audit (third party).
- Public 1.0 release with LTS commitment.

### Phase 8 — Ecosystem (Ongoing)

- Marketplace, plugins, partnerships, RFCs, foundation governance.

---

## 26. Country Coverage Matrix

The plan commits to shipping metadata for **every** entry below. Each gets a dedicated `@regium/country-<iso2>` (or `@regium/territory-<code>`) package, even at T4.

### Sovereign States (UN members + observers + partially recognized)

Afghanistan, Albania, Algeria, Andorra, Angola, Antigua and Barbuda, Argentina, Armenia, Australia, Austria, Azerbaijan, Bahamas, Bahrain, Bangladesh, Barbados, Belarus, Belgium, Belize, Benin, Bhutan, Bolivia, Bosnia and Herzegovina, Botswana, Brazil, Brunei, Bulgaria, Burkina Faso, Burundi, Cabo Verde, Cambodia, Cameroon, Canada, Central African Republic, Chad, Chile, China, Colombia, Comoros, Congo, Costa Rica, Côte d'Ivoire, Croatia, Cuba, Cyprus, Czech Republic, Democratic Republic of the Congo, Denmark, Djibouti, Dominica, Dominican Republic, Ecuador, Egypt, El Salvador, Equatorial Guinea, Eritrea, Estonia, Eswatini, Ethiopia, Fiji, Finland, France, Gabon, Gambia, Georgia, Germany, Ghana, Greece, Grenada, Guatemala, Guinea, Guinea-Bissau, Guyana, Haiti, Honduras, Hungary, Iceland, India, Indonesia, Iran, Iraq, Ireland, Israel, Italy, Jamaica, Japan, Jordan, Kazakhstan, Kenya, Kiribati, Kosovo, Kuwait, Kyrgyzstan, Laos, Latvia, Lebanon, Lesotho, Liberia, Libya, Liechtenstein, Lithuania, Luxembourg, Madagascar, Malawi, Malaysia, Maldives, Mali, Malta, Marshall Islands, Mauritania, Mauritius, Mexico, Micronesia, Moldova, Monaco, Mongolia, Montenegro, Morocco, Mozambique, Myanmar, Namibia, Nauru, Nepal, Netherlands, New Zealand, Nicaragua, Niger, Nigeria, North Korea, North Macedonia, Norway, Oman, Pakistan, Palau, Palestine, Panama, Papua New Guinea, Paraguay, Peru, Philippines, Poland, Portugal, Qatar, Romania, Russia, Rwanda, Saint Kitts and Nevis, Saint Lucia, Saint Vincent and the Grenadines, Samoa, San Marino, São Tomé and Príncipe, Saudi Arabia, Senegal, Serbia, Seychelles, Sierra Leone, Singapore, Slovakia, Slovenia, Solomon Islands, Somalia, South Africa, South Korea, South Sudan, Spain, Sri Lanka, Sudan, Suriname, Sweden, Switzerland, Syria, Taiwan, Tajikistan, Tanzania, Thailand, Timor-Leste, Togo, Tonga, Trinidad and Tobago, Tunisia, Turkey, Turkmenistan, Tuvalu, Uganda, Ukraine, United Arab Emirates, United Kingdom, United States, Uruguay, Uzbekistan, Vanuatu, Vatican City, Venezuela, Vietnam, Yemen, Zambia, Zimbabwe.

### Major Territories & Special Jurisdictions

Hong Kong, Macau, Puerto Rico, Guam, Jersey, Guernsey, Isle of Man, Cayman Islands, Bermuda, British Virgin Islands, Curaçao, Aruba, Greenland, Faroe Islands, Gibraltar, Réunion, French Polynesia, New Caledonia, Martinique, Guadeloupe, US Virgin Islands.

---

## Appendix A — Initial `package.json` Shape (root)

```jsonc
{
  "name": "regium",
  "private": true,
  "packageManager": "pnpm@9.0.0",
  "scripts": {
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "biome check .",
    "typecheck": "turbo run typecheck",
    "validate-metadata": "turbo run validate-metadata",
    "release": "changeset publish"
  },
  "devDependencies": {
    "turbo": "^2",
    "tsup": "^8",
    "typescript": "^5.5",
    "vitest": "^2",
    "zod": "^3",
    "@biomejs/biome": "^1",
    "@changesets/cli": "^2"
  }
}
```

## Appendix B — Public API Sketch

```ts
import { createRegium } from "@regium/core";
import india from "@regium/country-in";
import us from "@regium/country-us";

const regium = createRegium({
  plugins: [india, us],
  effectiveDate: new Date(),
  locale: "en-IN",
});

// Country lookups
regium.getCountryConfig("IN");
regium.getEmployeeFields("US");
regium.getCompanyFields("SG");
regium.getPayrollRules("AE");

// Validation
regium.validate({ country: "BR", field: "CPF", value: "390.533.447-05" });
regium.validate({ country: "global", field: "IBAN", value: "DE89..." });

// Form generation
const form = regium.generateEmployeeForm("DE", { variant: "full-time" });
```

## Appendix C — Risk Register (Top 5)

| Risk                                 | Mitigation                                                |
| ------------------------------------ | --------------------------------------------------------- |
| Metadata accuracy across 250+ JDs    | Steward model, primary-source citations, drift reports    |
| Bundle size for global imports       | Per-country packages, tree-shaking, dynamic import        |
| Breaking legal changes mid-quarter   | Effective-date model + LTS branches                       |
| Contributor burnout on long tail     | Tiered coverage, auto-scaffolding, partner sponsorships   |
| Trademark / liability for advice     | Clear "infrastructure, not legal advice" disclaimer       |

---

**End of Implementation Plan.**

This document is the source of truth for the Regium project. Any deviation requires an RFC and TSC approval. Once approved, execution proceeds phase-by-phase as defined in §25.
