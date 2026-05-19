# regium

> The compliance layer of the internet for workforce systems.

**One TypeScript SDK for tax IDs, payroll, banking, labor law, and immigration metadata across 218 countries.**

[![npm](https://img.shields.io/npm/v/regium?color=0f172a)](https://www.npmjs.com/package/@regium/core)
[![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](../../LICENSE)

## Install

```bash
npm install @regium/core @regium/data
```

For React apps, also install `@regium/react`.

## Quick start

```ts
import { createRegium } from "@regium/core";
import { allCountries } from "@regium/data";

const regium = createRegium({ plugins: allCountries });

regium.getCountryConfig("IN");
regium.validate({ country: "IN", field: "PAN", value: "ABCPL1234C" });
```

## Granular imports (tree-shake friendly)

```ts
// Just one validator — 500 bytes
import { pan } from "regium/validators/in";

// Just IBAN — 1 KB
import { iban } from "regium/validators/global";

// Just payroll engine — 3 KB
import { computePayroll } from "regium/payroll";

// Just tax engine
import { computeTax } from "regium/tax";

// Just forms
import { buildFormFromFields } from "regium/forms";
```

## Available subpaths

| Subpath | Description |
|---------|-------------|
| `regium` | Full SDK barrel |
| `regium/core` | Registry, `createRegium` |
| `regium/validators` | All validators |
| `regium/validators/global` | IBAN, SWIFT, email, phone |
| `regium/validators/<iso>` | Country-specific (in, us, uk, de, fr, sg, ae, br, au, ca) |
| `regium/payroll` | Gross→net engine |
| `regium/tax` | Slab/regime tax engine |
| `regium/labor` | Leave, working hours, termination |
| `regium/banking` | IBAN/SWIFT/IFSC/BSB validators |
| `regium/forms` | Schema-driven form engine |
| `regium/localization` | i18n primitives |
| `regium/utils` | Date, currency, mask, checksum |
| `regium/types` | Zod schemas + TS types |

## Documentation

[github.com/dilanmelvin/Regium](https://github.com/dilanmelvin/Regium)

## License

[Apache-2.0](../../LICENSE)
