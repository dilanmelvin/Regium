# @regium/country-ca

Canada country pack — Tier 1 full data including federal/provincial tax brackets, CPP/EI, and SIN validation.

Part of the [Regium](../../README.md) ecosystem — global workforce compliance infrastructure for developers.

## Install

```bash
npm install @regium/country-ca
```

## Usage

```ts
import { createRegium } from "@regium/core";
import { countryCA } from "@regium/country-ca";

const regium = createRegium({
  countries: [countryCA],
});

// Access Canada-specific payroll, tax, validators, and banking
```

## Includes

- Federal and provincial/territorial income tax brackets
- CPP/QPP and EI contribution rules
- SIN (Social Insurance Number) validator with Luhn check
- Transit/institution number and routing validation
- ESA leave and termination rules

## License

[Apache-2.0](../../LICENSE)
