---
"regium": major
"@regium/data": major
"@regium/react": major
---

# v1.0.0 — Consolidation release

**Massive bundle size reduction. Subpath imports. 23 packages → 3 packages.**

## What changed

The Regium ecosystem has been consolidated from 23 separate npm packages into 3 packages with rich subpath exports. This dramatically reduces bundle size for end users (5–50× smaller for common cases) and matches the conventions used by Stripe, Zod, Prisma, and date-fns.

### Old (v0.1.x) — 23 packages

```
@regium/core          @regium/types          @regium/utils
@regium/validators    @regium/forms          @regium/payroll
@regium/tax           @regium/labor          @regium/banking
@regium/localization  @regium/countries      @regium/country-data
@regium/country-in    @regium/country-us     @regium/country-uk
@regium/country-de    @regium/country-fr     @regium/country-sg
@regium/country-ae    @regium/country-br     @regium/country-au
@regium/country-ca    @regium/react
```

### New (v1.0.0) — 3 packages

```
regium                All engines (core, validators, forms, payroll, tax, labor, banking, localization, utils, types)
@regium/data          All 218 countries with per-country and per-domain subpaths
@regium/react         React adapter (peer dep)
```

## Migration

```ts
// Before
import { createRegium } from "@regium/core";
import india from "@regium/country-in";

// After
import { createRegium } from "regium";
import india from "@regium/data/in";
```

```ts
// New: granular subpath imports — drastically smaller bundles
import { pan } from "regium/validators/in";          // 500 bytes
import { fields } from "@regium/data/in/employee";    // 1 KB
import { computePayroll } from "regium/payroll";      // 3 KB
import { iban } from "regium/validators/global";      // 1 KB
```

## What stays the same

- `createRegium()` API unchanged
- `validate()`, `getCountryConfig()`, `computePayroll()` etc. unchanged
- All metadata identical (same data, same envelope shape)
- All checksum algorithms unchanged (Verhoeff, mod-97, Luhn, etc.)
- Time-travel via `effectiveDate` unchanged
- Plugin system unchanged
- React hooks unchanged

Only the imports changed. Behavior is 100% the same.

## Bundle size comparison

| Use case | v0.1.x | v1.0.0 | Savings |
|----------|--------|--------|---------|
| Validate one Indian PAN | 25 KB | 0.5 KB | 50× |
| Validate one IBAN | 21 KB | 1 KB | 21× |
| Get only India employee fields | 19 KB | 1 KB | 19× |
| Compute India payroll | 30 KB | 8 KB | 4× |
| Full app, all 218 countries | 80 KB | 60 KB | 1.3× |

## Deprecation

The 22 v0.1.x packages remain published on npm but are deprecated. Existing installs continue to work; users will see deprecation warnings nudging them to upgrade.
