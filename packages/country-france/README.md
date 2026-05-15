# @regium/country-fr

France country pack — Tier 1 full data including impôt sur le revenu, cotisations sociales, and IBAN/BIC validation.

Part of the [Regium](../../README.md) ecosystem — global workforce compliance infrastructure for developers.

## Install

```bash
npm install @regium/country-fr
```

## Usage

```ts
import { createRegium } from "@regium/core";
import { countryFR } from "@regium/country-fr";

const regium = createRegium({
  countries: [countryFR],
});

// Access France-specific payroll, tax, validators, and banking
```

## Includes

- Impôt sur le revenu (income tax) tranches
- Cotisations sociales (CSG, CRDS, retraite)
- NIR (numéro de sécurité sociale) validator
- IBAN/BIC validation
- Code du travail leave and labor rules

## License

[Apache-2.0](../../LICENSE)
