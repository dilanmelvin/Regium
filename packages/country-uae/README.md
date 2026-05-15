# @regium/country-ae

UAE country pack — Tier 1 full data including WPS payroll, gratuity rules, and IBAN validation.

Part of the [Regium](../../README.md) ecosystem — global workforce compliance infrastructure for developers.

## Install

```bash
npm install @regium/country-ae
```

## Usage

```ts
import { createRegium } from "@regium/core";
import { countryAE } from "@regium/country-ae";

const regium = createRegium({
  countries: [countryAE],
});

// Access UAE-specific payroll, labor, validators, and banking
```

## Includes

- WPS (Wage Protection System) compliance
- End-of-service gratuity calculation
- Emirates ID validator
- IBAN validation (AE format)
- UAE Labour Law leave and termination rules

## License

[Apache-2.0](../../LICENSE)
