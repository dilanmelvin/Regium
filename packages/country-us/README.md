# @regium/country-us

United States country pack — Tier 1 full data including federal/state tax brackets, SSN validation, and routing numbers.

Part of the [Regium](../../README.md) ecosystem — global workforce compliance infrastructure for developers.

## Install

```bash
npm install @regium/country-us
```

## Usage

```ts
import { createRegium } from "@regium/core";
import { countryUS } from "@regium/country-us";

const regium = createRegium({
  countries: [countryUS],
});

// Access US-specific payroll, tax, validators, and banking
```

## Includes

- Federal income tax brackets
- FICA (Social Security + Medicare) rules
- SSN and EIN validators
- ABA routing number validation
- FMLA and at-will labor rules

## License

[Apache-2.0](../../LICENSE)
