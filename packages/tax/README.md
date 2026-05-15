# @regium/tax

Slab-based and regime-aware tax calculation engine.

Part of the [Regium](../../README.md) ecosystem — global workforce compliance infrastructure for developers.

## Install

```bash
npm install @regium/tax
```

## Usage

```ts
import { calculateTax } from "@regium/tax";

const result = calculateTax({
  country: "IN",
  income: 1200000,
  regime: "new",
  fiscalYear: "2024-25",
});

console.log(result.totalTax); // computed tax liability
```

## Features

- Multi-slab progressive tax computation
- Support for old/new regimes (India), PAYE (UK), brackets (US)
- Surcharge and cess calculations
- Fiscal-year-aware rate tables

## License

[Apache-2.0](../../LICENSE)
