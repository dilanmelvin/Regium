# @regium/country-au

Australia country pack — Tier 1 full data including ATO tax brackets, superannuation, and TFN/BSB validation.

Part of the [Regium](../../README.md) ecosystem — global workforce compliance infrastructure for developers.

## Install

```bash
npm install @regium/country-au
```

## Usage

```ts
import { createRegium } from "@regium/core";
import { countryAU } from "@regium/country-au";

const regium = createRegium({
  countries: [countryAU],
});

// Access Australia-specific payroll, tax, validators, and banking
```

## Includes

- ATO income tax brackets and PAYG withholding
- Superannuation guarantee (SG) rates
- TFN (Tax File Number) validator with checksum
- BSB and account number validation
- NES (National Employment Standards) leave rules

## License

[Apache-2.0](../../LICENSE)
