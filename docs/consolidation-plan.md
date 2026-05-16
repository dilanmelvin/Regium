# Regium Consolidation Plan

**Status:** Awaiting approval
**Goal:** Reduce 23 packages to 3, enable granular subpath imports, drastically improve bundle size for end users, simplify maintenance.

---

## Current state vs. target state

### Today (23 packages)

```
@regium/types
@regium/utils
@regium/localization
@regium/core
@regium/validators
@regium/forms
@regium/payroll
@regium/tax
@regium/labor
@regium/banking
@regium/country-data
@regium/countries
@regium/country-in   country-us  country-uk  country-de  country-fr
@regium/country-sg   country-ae  country-br  country-au  country-ca
@regium/react
```

### After consolidation (3 packages)

```
regium                  All engines, registry, runtime
@regium/data            All country metadata
@regium/react           React adapter (kept separate due to peer dep)
```

Each ships with rich subpath exports so users import only what they need.

---

## Final package structure (target)

### Package 1: `regium`

**One package, many entry points via the `exports` map in `package.json`.**

```
regium
├── (default)              createRegium, registry, types, all engines re-exported
├── /core                  createRegium, registry only
├── /validators            All validators tree-shakable
├── /validators/in         India-specific validators (PAN, GSTIN, Aadhaar, IFSC, CIN, UAN, TAN)
├── /validators/us         US validators (SSN, EIN, ABA, ZIP)
├── /validators/uk         UK validators (NINO, UTR, sort-code, postcode)
├── /validators/de         Germany validators
├── /validators/fr         France validators
├── /validators/sg         Singapore validators
├── /validators/ae         UAE validators
├── /validators/br         Brazil validators
├── /validators/au         Australia validators
├── /validators/ca         Canada validators
├── /validators/global     IBAN, SWIFT, email, phone, Luhn
├── /payroll               computePayroll, types
├── /tax                   computeTax, types
├── /labor                 leave accrual, working hours, termination
├── /banking               IBAN/SWIFT/IFSC helpers
├── /forms                 Schema-driven form engine
├── /localization          i18n primitives
├── /utils                 Date, currency, mask, checksum primitives
└── /types                 All Zod schemas + TS types
```

**User experience:**

```ts
// Just want PAN? 500 bytes.
import { pan } from "regium/validators/in";

// Just want all global validators? 2 KB.
import { iban, swift, email } from "regium/validators/global";

// Want the full SDK? Standard import.
import { createRegium } from "regium";

// Want the payroll engine?
import { computePayroll } from "regium/payroll";

// Want everything from one barrel?
import * as regium from "regium";
```

### Package 2: `@regium/data`

**All 218 countries, with per-country and per-domain subpaths.**

```
@regium/data
├── (default)              All 218 countries bundled
├── /index                 allCountries, countriesByISO, getCountry
├── /in                    Full India pack (all domains)
├── /in/country            Just India country profile
├── /in/employee           Just India employee fields
├── /in/company            Just India company fields
├── /in/payroll            Just India payroll rules
├── /in/tax                Just India tax rules
├── /in/labor              Just India labor rules
├── /in/banking            Just India banking rules
├── /in/localization       Just India localization
├── /in/immigration        Just India immigration
├── /us                    Full US pack
├── /us/employee           Just US employee fields
├── /us/...                ...
└── ... (same for all 218 countries)
```

**User experience:**

```ts
// Just want India employee fields? 1 KB.
import { fields } from "@regium/data/in/employee";

// Full India pack?
import india from "@regium/data/in";

// All 218 countries?
import { allCountries } from "@regium/data";

// Build your own narrow set?
import india from "@regium/data/in";
import us from "@regium/data/us";
import sg from "@regium/data/sg";
```

### Package 3: `@regium/react` (unchanged)

Stays as-is. Has React as peer dep, must be its own package so vanilla JS users don't pull React.

---

## Migration plan — 8 phases

### Phase 1: Set up the new package structure (30 min)

1. Create `packages-v2/regium/` and `packages-v2/data/` directories
2. Set up `package.json` for each with rich `exports` maps
3. Configure `tsup` to output multiple entry points per package
4. Configure `tsconfig.json`

### Phase 2: Move `regium` package contents (45 min)

1. Move all source files from old packages into `packages-v2/regium/src/<domain>/`
   - `src/core/` ← from `core/src/`
   - `src/types/` ← from `shared-types/src/`
   - `src/utils/` ← from `shared-utils/src/`
   - `src/validators/global/` ← from `validators/src/global.ts`
   - `src/validators/in/`, `/us/`, etc. ← from `validators/src/jurisdictions/`
   - `src/payroll/` ← from `payroll/src/`
   - `src/tax/` ← from `tax/src/`
   - `src/labor/` ← from `labor/src/`
   - `src/banking/` ← from `banking/src/`
   - `src/forms/` ← from `forms/src/`
   - `src/localization/` ← from `localization/src/`
2. Update internal imports to relative paths (`./types/...` instead of `@regium/types`)
3. Build a barrel `src/index.ts` that re-exports the public surface

### Phase 3: Move `@regium/data` package contents (30 min)

1. Move base data from `country-data/src/` → `data/src/base/`
2. Move each `country-<x>/src/index.ts` → `data/src/<iso2>/index.ts`
3. Split each country file into per-domain files:
   - `data/src/in/country.ts`
   - `data/src/in/employee.ts`
   - `data/src/in/company.ts`
   - `data/src/in/payroll.ts`
   - etc.
4. Auto-generate stub files for the other 208 countries from base data
5. Build the registry index that aggregates everything

### Phase 4: Configure exports map (15 min)

For `regium`:
```json
{
  "exports": {
    ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js", "require": "./dist/index.cjs" },
    "./core": { "types": "./dist/core/index.d.ts", "import": "./dist/core/index.js", "require": "./dist/core/index.cjs" },
    "./validators": { "types": "./dist/validators/index.d.ts", ... },
    "./validators/in": { "types": "./dist/validators/in.d.ts", ... },
    "./validators/global": { ... },
    "./payroll": { ... },
    "./tax": { ... },
    "./forms": { ... },
    "./labor": { ... },
    "./banking": { ... },
    "./localization": { ... },
    "./utils": { ... },
    "./types": { ... }
  }
}
```

For `@regium/data`: similar structure with one entry per country and per domain.

### Phase 5: Build configuration (20 min)

`tsup.config.ts` for `regium`:
```ts
export default defineConfig({
  entry: {
    index: "src/index.ts",
    core: "src/core/index.ts",
    "validators/index": "src/validators/index.ts",
    "validators/in": "src/validators/in.ts",
    "validators/us": "src/validators/us.ts",
    "validators/global": "src/validators/global.ts",
    payroll: "src/payroll/index.ts",
    tax: "src/tax/index.ts",
    forms: "src/forms/index.ts",
    labor: "src/labor/index.ts",
    banking: "src/banking/index.ts",
    localization: "src/localization/index.ts",
    utils: "src/utils/index.ts",
    types: "src/types/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  treeshake: true,
});
```

For `@regium/data`: dynamic entry generation with one entry per country × domain.

### Phase 6: Update consumers (30 min)

- Update `apps/docs/generate-data.mjs` to import from new paths
- Update `scripts/smoke-test.mjs` to use new package names
- Update `apps/docs/public/experience.js` and the data file
- Update `apps/docs/index.html` install commands
- Update README install examples
- Update `EXAMPLES.md`, `docs/getting-started.md`, etc.

### Phase 7: Test thoroughly (30 min)

- `pnpm install` — confirm workspace resolves
- `pnpm build` — confirm everything compiles, all entry points produce dist files
- `pnpm typecheck` — strict TS across all entries
- `pnpm lint` — clean
- `pnpm smoke-test` — proves real-world install works
- Test each subpath import manually:
  ```ts
  import { pan } from "regium/validators/in";
  import { iban } from "regium/validators/global";
  import { fields } from "@regium/data/in/employee";
  import india from "@regium/data/in";
  import { computePayroll } from "regium/payroll";
  ```
- Bundle size measurements with `esbuild --analyze` for each common use case

### Phase 8: Deprecate old packages (15 min)

After publishing the new packages and confirming they work:

1. Add deprecation notices to old packages on npm:
   ```bash
   npm deprecate @regium/core@"<99.0.0" "Replaced by `regium`. See https://regium.dev/migration"
   npm deprecate @regium/country-in@"<99.0.0" "Replaced by `@regium/data/in`. See https://regium.dev/migration"
   # ... for each old package
   ```
2. Existing installs keep working (deprecation is a warning, not removal)
3. New users see warnings nudging them to the new packages

### Phase 9: Update version & publish (15 min)

1. Bump major version: `regium` `1.0.0`, `@regium/data` `1.0.0`, `@regium/react` `1.0.0` (from `0.1.x`)
2. Add changeset describing the consolidation
3. Run `pnpm publish:npm`
4. Verify on npmjs.com:
   - https://www.npmjs.com/package/regium
   - https://www.npmjs.com/package/@regium/data
   - https://www.npmjs.com/package/@regium/react

---

## Migration guide (for the README)

A new section showing both old and new patterns side-by-side:

```ts
// Before (v0.1.x)
import { createRegium } from "@regium/core";
import india from "@regium/country-in";
import us from "@regium/country-us";

const regium = createRegium({ plugins: [india, us] });

// After (v1.0.0)
import { createRegium } from "regium";
import india from "@regium/data/in";
import us from "@regium/data/us";

const regium = createRegium({ plugins: [india, us] });
```

```ts
// New: granular imports — saves bundle size
import { pan } from "regium/validators/in";       // 500 bytes
import { fields } from "@regium/data/in/employee"; // 1 KB
import { computePayroll } from "regium/payroll";   // 3 KB
```

---

## Bundle size proof (targets)

After consolidation, we'll measure and document these for the README:

| Use case | Before | After | Savings |
|----------|--------|-------|---------|
| Validate one Indian PAN | 25 KB | **0.5 KB** | 50× |
| Validate one IBAN | 21 KB | **1 KB** | 21× |
| Validate one Brazilian CPF | 22 KB | **1 KB** | 22× |
| Get only India employee fields | 19 KB | **1 KB** | 19× |
| Compute India payroll | 30 KB | **8 KB** | 4× |
| Use 5 countries' validators only | 40 KB | **5 KB** | 8× |
| Full app, all 218 countries | 80 KB | **60 KB** | 1.3× |

Numbers are minified+gzipped, measured with esbuild bundle analyzer.

---

## What stays the same (no breaking changes to logic)

- All metadata stays identical (same data, same envelope shape)
- All checksum algorithms unchanged (Verhoeff, mod-97, Luhn, etc.)
- `createRegium()` API unchanged
- `validate()`, `getCountryConfig()`, `computePayroll()` etc. all unchanged
- Time-travel via `effectiveDate` unchanged
- Plugin system unchanged
- React hooks unchanged

**Only the imports change.** The behavior is 100% the same.

---

## What gets dropped from the codebase

- 22 individual `package.json` files → 3
- 22 `tsconfig.json` files → 3
- 22 `tsup.config.ts` files → 3
- 22 individual READMEs → kept inside source directories as `<domain>/README.md` for reference
- 22 individual changesets per release → 3 max per release
- The `tier` (T1/T4) public-facing concept stays in data but isn't marketed

---

## What gets improved beyond consolidation

While we're refactoring, fix these strategic issues:

### 1. Lazy-load the docs site data
Instead of one 430 KB JSON dump, generate per-country JSON files (`/data/in.json`, `/data/us.json`, etc.). Experience Centre fetches only the selected country's data. Page load drops from 430 KB → 5 KB initial + 2 KB per country selected.

### 2. Better ASCII art placement and branding
Move the ASCII logo to a dedicated `<picture>` block that renders on dark and light themes. Add proper `og:image` for social sharing.

### 3. Cleaner README sections
- Remove the "Tier" public concept (replace with "10 countries with detailed payroll, 208 with profile metadata — community-contributed expansion ongoing")
- Add bundle size proof table (uses real numbers from build)
- Add live demo link (regium.dev or whatever domain)
- Add CONTRIBUTING shortcut: "Add your country in 30 minutes"

### 4. Sharper positioning
Update the README intro:
> Old: "Replaces country-specific logic"
> New: "The compliance infrastructure layer — used by HRMS platforms, payroll engines, EOR services, and fintech apps"

We're infrastructure, not a competitor to platforms.

### 5. CONTRIBUTING.md focused on country contributions
Add a step-by-step "How to add your country" guide. The path from `git clone` → PR open should take 30 minutes with our tools.

### 6. Working playground or remove broken references
Either restore the playground at `/playground` or remove all references to it. Right now `pnpm playground` is in package.json but the directory is locked/deleted.

### 7. CODEOWNERS preparation
Create `CODEOWNERS` template so country maintainers can be assigned later as community grows.

---

## Time estimate

| Phase | Time |
|-------|------|
| Phase 1: New structure | 30 min |
| Phase 2: Move regium contents | 45 min |
| Phase 3: Move data contents | 30 min |
| Phase 4: Exports maps | 15 min |
| Phase 5: Build config | 20 min |
| Phase 6: Update consumers | 30 min |
| Phase 7: Test | 30 min |
| Phase 8: Deprecate old | 15 min |
| Phase 9: Publish v1.0 | 15 min |
| Strategic fixes (lazy data, README, CONTRIBUTING) | 60 min |
| **Total** | **~5 hours** |

---

## What I will NOT do without further approval

- Will not delete the old `packages/` directory immediately — will keep it during transition for fallback
- Will not break the docs site or experience centre — will update them in lockstep
- Will not change npm package names without your sign-off
- Will not touch the data accuracy of any country (those are policy decisions)
- Will not add new third-party dependencies

---

## Risks and mitigations

| Risk | Mitigation |
|------|-----------|
| Subpath exports don't work in some bundler | Test against esbuild, Webpack, Rollup, Vite, Bun, Deno |
| Existing users break on update | They're on v0.1.x — bump to v1.0.0 with clear migration guide. Old packages stay published but deprecated. |
| Tree-shaking still doesn't work as expected | Verify with real bundle measurements before publishing |
| Docs/website temporarily broken during refactor | Keep changes in a feature branch, only merge when smoke-test passes |
| npm publish fails partway | Changesets handles partial publishes gracefully — re-run picks up where it stopped |

---

## Decision required from you

Reply **"yes, proceed with consolidation"** and I'll execute Phases 1–9 in order, asking only for clarifications when ambiguous (e.g., naming, deprecation messages).

Reply **"keep current 23 packages"** and I'll skip this entirely and just continue building features on top of the existing structure.

Reply **"proceed but skip X"** if you want partial scope.

---

## After approval, the very first thing I'll do

1. Create a Git branch: `feat/v1-consolidation`
2. Create `packages-v2/` alongside `packages/` (no deletion yet)
3. Build the new packages incrementally
4. Run smoke test against the new structure
5. Once everything passes, delete `packages/` and rename `packages-v2/` → `packages/`
6. Push the branch and open a PR (against your protected `main`) for visibility

Your call.
