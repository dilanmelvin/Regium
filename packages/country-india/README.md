# @regium/country-in

India country pack — Tier 1 full data including tax slabs, PF/ESI rules, PAN/Aadhaar validation, and banking (IFSC).

Part of the [Regium](../../README.md) ecosystem — global workforce compliance infrastructure for developers.

## Install

```bash
npm install @regium/country-in
```

## Usage

```ts
import { createRegium } from "@regium/core";
import { countryIN } from "@regium/country-in";

const regium = createRegium({
  countries: [countryIN],
});

// Access India-specific payroll, tax, validators, and banking
```

## Includes

- Income tax slabs (old & new regime)
- PF, ESI, PT statutory deductions
- PAN, Aadhaar, GSTIN validators
- IFSC bank code directory
- Leave and labor rules

## License

[Apache-2.0](../../LICENSE)
