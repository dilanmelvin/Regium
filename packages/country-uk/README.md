# @regium/country-uk

United Kingdom country pack — Tier 1 full data including PAYE tax bands, NI contributions, and sort code validation.

Part of the [Regium](../../README.md) ecosystem — global workforce compliance infrastructure for developers.

## Install

```bash
npm install @regium/country-uk
```

## Usage

```ts
import { createRegium } from "@regium/core";
import { countryUK } from "@regium/country-uk";

const regium = createRegium({
  countries: [countryUK],
});

// Access UK-specific payroll, tax, validators, and banking
```

## Includes

- PAYE income tax bands and personal allowance
- National Insurance contribution classes
- NINO (National Insurance Number) validator
- Sort code and account number validation
- Statutory leave and notice period rules

## License

[Apache-2.0](../../LICENSE)
