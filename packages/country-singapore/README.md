# @regium/country-sg

Singapore country pack — Tier 1 full data including IRAS tax brackets, CPF contributions, and NRIC validation.

Part of the [Regium](../../README.md) ecosystem — global workforce compliance infrastructure for developers.

## Install

```bash
npm install @regium/country-sg
```

## Usage

```ts
import { createRegium } from "@regium/core";
import { countrySG } from "@regium/country-sg";

const regium = createRegium({
  countries: [countrySG],
});

// Access Singapore-specific payroll, tax, validators, and banking
```

## Includes

- IRAS progressive tax brackets (resident & non-resident)
- CPF contribution rates (employee + employer)
- NRIC/FIN validator with checksum
- Bank code and SWIFT validation
- Employment Act leave and termination rules

## License

[Apache-2.0](../../LICENSE)
