# Project Structure

A complete map of the Regium monorepo — what lives where and why.

---

## Root directory

```
D:\Regium\
│
├── README.md                  Project overview, install, quick start, full docs
├── LICENSE                    Apache-2.0 (GitHub auto-detects)
├── CONTRIBUTING.md            How to contribute (GitHub auto-detects)
├── CODE_OF_CONDUCT.md         Contributor Covenant (GitHub auto-detects)
├── SECURITY.md                Vulnerability reporting (GitHub auto-detects)
│
├── package.json               Root workspace config + scripts
├── pnpm-workspace.yaml        Workspace package list
├── pnpm-lock.yaml             Lockfile (committed)
├── turbo.json                 Turborepo build pipeline
├── biome.json                 Linter + formatter config
├── tsconfig.base.json         Root TypeScript config
├── .npmrc                     pnpm settings (no tokens)
├── .gitignore                 Git exclusions
│
├── docs/                      All guides and documentation
├── packages/                  All npm packages (23 publishable)
├── apps/                      Non-published applications
├── scripts/                   Automation scripts
├── tools/                     Shared configs
├── .github/                   CI/CD workflows
└── .changeset/                Version management
```

---

## `docs/` — Documentation

All human-readable guides. Lowercase kebab-case filenames.

```
docs/
├── getting-started.md         60-second tour of the repo
├── running.md                 Setup on macOS, Linux, Windows
├── examples.md                10 copy-paste recipes
├── publishing.md              Deploy to npm, pnpm, yarn, bun, JSR, CDN
├── go-live.md                 Step-by-step first publish guide
├── implementation-plan.md     Full 26-section architecture & roadmap
└── project-structure.md       ← this file
```

---

## `packages/` — npm packages

Every publishable package. Each is self-contained with its own `package.json`, `tsconfig.json`, `tsup.config.ts`, and `src/` directory.

### Foundation layer

| Directory | npm name | Purpose |
|-----------|----------|---------|
| `shared-types/` | `@regium/types` | Zod schemas + TypeScript types for every domain |
| `shared-utils/` | `@regium/utils` | Date, currency, mask, checksum primitives |
| `localization/` | `@regium/localization` | i18n, locale formatting, ICU interpolation |

### Core

| Directory | npm name | Purpose |
|-----------|----------|---------|
| `core/` | `@regium/core` | Registry, resolver, plugin host, `createRegium()`, global validators |

### Domain engines

| Directory | npm name | Purpose |
|-----------|----------|---------|
| `validators/` | `@regium/validators` | Composable validators (PAN, IBAN, CPF, NRIC, SSN…) |
| `forms/` | `@regium/forms` | Schema-driven form engine |
| `payroll/` | `@regium/payroll` | Gross→net payroll calculation engine |
| `tax/` | `@regium/tax` | Progressive slab/regime tax engine |
| `labor/` | `@regium/labor` | Leave accrual, working hours, termination |
| `banking/` | `@regium/banking` | IBAN/SWIFT/IFSC/BSB/routing helpers |

### Country data

| Directory | npm name | Purpose |
|-----------|----------|---------|
| `country-data/` | `@regium/country-data` | Base metadata for all 218 countries (T4 stubs) |
| `countries/` | `@regium/countries` | Master registry (base + 10 T1 overrides) |

### T1 country packs (full payroll, tax, labor, banking, immigration)

| Directory | npm name | Country |
|-----------|----------|---------|
| `country-india/` | `@regium/country-in` | 🇮🇳 India |
| `country-us/` | `@regium/country-us` | 🇺🇸 United States |
| `country-uk/` | `@regium/country-uk` | 🇬🇧 United Kingdom |
| `country-germany/` | `@regium/country-de` | 🇩🇪 Germany |
| `country-france/` | `@regium/country-fr` | 🇫🇷 France |
| `country-singapore/` | `@regium/country-sg` | 🇸🇬 Singapore |
| `country-uae/` | `@regium/country-ae` | 🇦🇪 UAE |
| `country-brazil/` | `@regium/country-br` | 🇧🇷 Brazil |
| `country-australia/` | `@regium/country-au` | 🇦🇺 Australia |
| `country-canada/` | `@regium/country-ca` | 🇨🇦 Canada |

### Framework adapters

| Directory | npm name | Purpose |
|-----------|----------|---------|
| `react/` | `@regium/react` | RegiumProvider, useRegiumForm, useValidate |

### Package internal structure (each package follows this pattern)

```
packages/<name>/
├── package.json               Name, version, exports, deps, scripts
├── tsconfig.json              Extends tools/tsconfig/lib.json
├── tsup.config.ts             Build config (ESM + CJS + DTS)
├── src/
│   ├── index.ts               Public entry point
│   └── ...                    Implementation files
└── dist/                      Build output (gitignored)
    ├── index.js               ESM bundle
    ├── index.cjs              CJS bundle
    ├── index.d.ts             Type declarations
    └── index.js.map           Source map
```

---

## `apps/` — Applications (not published to npm)

```
apps/
├── playground/                Live sandbox (Vite + React)
│   ├── package.json           private: true
│   ├── index.html             Entry HTML
│   ├── vite.config.ts         Vite config
│   ├── tsconfig.json
│   ├── public/
│   │   └── favicon.svg
│   └── src/
│       ├── main.tsx           React entry, creates Regium instance
│       ├── App.tsx            Country picker + tab navigation
│       ├── styles.css         Clean white UI styles
│       └── views/
│           ├── CountryOverview.tsx
│           ├── ValidatorPlayground.tsx
│           ├── ComplianceForm.tsx
│           └── PayrollSimulator.tsx
│
└── docs/                      Static documentation site
    ├── package.json           private: true
    └── index.html             Single-page reference docs
```

---

## `scripts/` — Automation

```
scripts/
├── smoke-test.mjs             End-to-end verification orchestrator
│                              (packs → installs in sandbox → validates 218 countries)
└── publish.mjs                Secure npm publish helper
                               (reads NPM_TOKEN from env, never writes to repo)
```

---

## `tools/` — Shared configs

```
tools/
└── tsconfig/
    ├── package.json           Workspace-internal, not published
    ├── base.json              Base compiler options (strict, ES2022, bundler)
    ├── lib.json               For library packages (noEmit: true)
    └── react.json             For React packages (adds DOM lib + JSX)
```

---

## `.github/` — CI/CD

```
.github/
└── workflows/
    ├── ci.yml                 Runs on every PR: install, lint, typecheck, build, test
    └── release.yml            Runs on push to main: Changesets version PR + npm publish
```

---

## `.changeset/` — Version management

```
.changeset/
├── config.json                Changesets config (public access, base branch: main)
├── README.md                  How to add a changeset
└── initial.md                 The first changeset (bumps all packages to 0.1.0)
```

---

## Design rules

| Rule | Rationale |
|------|-----------|
| **Root stays minimal** | Only files GitHub auto-detects + workspace configs. No guide clutter. |
| **`docs/` for all guides** | One place to find everything. Lowercase kebab-case. Easy to link. |
| **`packages/` is self-contained** | Each package can be understood, built, and published independently. |
| **`apps/` is private** | Applications are never published to npm. They consume packages. |
| **`scripts/` is automation** | Not published. Used by maintainers for testing and releasing. |
| **`tools/` is shared config** | Consumed via `extends` in tsconfig. Never published. |
| **No `src/` at root** | The root is a workspace orchestrator, not a package. |
| **No `dist/` committed** | All build outputs are gitignored. Reproducible from source. |
| **No tokens in repo** | `.npmrc` has only pnpm settings. Tokens live in `$env:NPM_TOKEN` per session. |

---

## Dependency graph

```
@regium/types (foundation — no deps)
    ↓
@regium/utils (depends on types)
    ↓
@regium/localization (depends on types + utils)
@regium/validators (depends on types + utils)
    ↓
@regium/core (depends on types + utils + localization)
@regium/forms (depends on types + utils)
@regium/tax (depends on types + utils)
@regium/payroll (depends on types + utils + tax)
@regium/labor (depends on types + utils)
@regium/banking (depends on types + utils + validators)
    ↓
@regium/country-data (depends on types)
@regium/country-<iso2> (depends on types + validators)
    ↓
@regium/countries (depends on country-data + all T1 packs)
    ↓
@regium/react (depends on core + types + forms)
```

Turborepo builds this graph in parallel where possible. A change to `@regium/types` rebuilds everything downstream. A change to `@regium/country-in` only rebuilds `countries` and `playground`.
