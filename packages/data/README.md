# @regium/data

> Country metadata for the [Regium](https://github.com/dilanmelvin/Regium) ecosystem.

**218 countries and territories** — every UN member state, observers, partially recognised states, and 21 major territories. 10 with full payroll/tax/labor data, 208 with profile + currency + tax authority.

[![npm](https://img.shields.io/npm/v/@regium/data?color=0f172a)](https://www.npmjs.com/package/@regium/data)

## Install

```bash
npm install regium @regium/data
```

## Usage

```ts
import { createRegium } from "regium";
import { allCountries } from "@regium/data";

const regium = createRegium({ plugins: allCountries });
console.log(regium.listCountries().length); // 218
```

## Granular subpath imports

Pay only for the data you actually use:

```ts
// Full India pack (all 9 domains)
import india from "@regium/data/in";

// Just India employee fields
import { data as employeeFields } from "@regium/data/in/employee";

// Just India payroll rules
import { data as payrollRules } from "@regium/data/in/payroll";

// Just India tax rules
import { data as taxRules } from "@regium/data/in/tax";
```

## Available subpaths

For each detailed country (`in`, `us`, `uk`, `de`, `fr`, `sg`, `ae`, `br`, `au`, `ca`):

| Subpath | Contents |
|---------|----------|
| `@regium/data/<iso>` | Full country pack (all domains) |
| `@regium/data/<iso>/country` | ISO codes, currency, timezones, languages |
| `@regium/data/<iso>/company` | Corporate compliance fields (VAT, EIN, CIN, etc.) |
| `@regium/data/<iso>/employee` | Employee compliance fields (national IDs, etc.) |
| `@regium/data/<iso>/payroll` | Payroll components, frequencies, contributions |
| `@regium/data/<iso>/tax` | Tax slabs, regimes, surcharges |
| `@regium/data/<iso>/labor` | Leave policies, working hours, termination |
| `@regium/data/<iso>/banking` | IBAN, SWIFT, IFSC, BSB config |
| `@regium/data/<iso>/localization` | Locales, formats, address layout |
| `@regium/data/<iso>/immigration` | Visa categories, work permits |

The remaining 208 countries are accessible via `allCountries` and `getCountry(iso)`.

## License

[Apache-2.0](../../LICENSE)
