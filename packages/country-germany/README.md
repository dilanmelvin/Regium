# @regium/country-de

Germany country pack — Tier 1 full data including Lohnsteuer brackets, social insurance, and IBAN/BLZ validation.

Part of the [Regium](../../README.md) ecosystem — global workforce compliance infrastructure for developers.

## Install

```bash
npm install @regium/country-de
```

## Usage

```ts
import { createRegium } from "@regium/core";
import { countryDE } from "@regium/country-de";

const regium = createRegium({
  countries: [countryDE],
});

// Access Germany-specific payroll, tax, validators, and banking
```

## Includes

- Lohnsteuer (income tax) brackets and Solidaritätszuschlag
- Social insurance (health, pension, unemployment, care)
- Steuer-ID and Sozialversicherungsnummer validators
- IBAN validation with BLZ lookup
- Urlaubsanspruch (leave entitlement) rules

## License

[Apache-2.0](../../LICENSE)
