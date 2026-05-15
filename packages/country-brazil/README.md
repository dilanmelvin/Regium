# @regium/country-br

Brazil country pack — Tier 1 full data including IRRF tax tables, INSS/FGTS contributions, and CPF/CNPJ validation.

Part of the [Regium](../../README.md) ecosystem — global workforce compliance infrastructure for developers.

## Install

```bash
npm install @regium/country-br
```

## Usage

```ts
import { createRegium } from "@regium/core";
import { countryBR } from "@regium/country-br";

const regium = createRegium({
  countries: [countryBR],
});

// Access Brazil-specific payroll, tax, validators, and banking
```

## Includes

- IRRF (income tax) progressive table
- INSS and FGTS contribution rules
- CPF and CNPJ validators with checksum
- Bank code (COMPE) and IBAN validation
- CLT labor rules (férias, 13º salário, rescisão)

## License

[Apache-2.0](../../LICENSE)
