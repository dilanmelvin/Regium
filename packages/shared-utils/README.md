# @regium/utils

Date, currency, mask, and checksum utilities shared across Regium packages.

Part of the [Regium](../../README.md) ecosystem — global workforce compliance infrastructure for developers.

## Install

```bash
npm install @regium/utils
```

## Usage

```ts
import { formatCurrency, maskPAN, luhnCheck } from "@regium/utils";

formatCurrency(50000, "INR"); // "₹50,000.00"
maskPAN("4111111111111111");  // "4111 **** **** 1111"
luhnCheck("4111111111111111"); // true
```

## Utilities

- **Date** — fiscal year helpers, working-day calculations
- **Currency** — locale-aware formatting
- **Mask** — PII redaction for PAN, IBAN, SSN
- **Checksum** — Luhn, MOD-97, Verhoeff algorithms

## License

[Apache-2.0](../../LICENSE)
