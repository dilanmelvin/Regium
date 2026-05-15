# @regium/banking

IBAN, SWIFT, IFSC, BSB, and routing number validation engine.

Part of the [Regium](../../README.md) ecosystem — global workforce compliance infrastructure for developers.

## Install

```bash
npm install @regium/banking
```

## Usage

```ts
import { validateIFSC, validateIBAN, validateBSB } from "@regium/banking";

validateIFSC("SBIN0001234"); // { valid: true, bank: "State Bank of India" }
validateIBAN("GB29NWBK60161331926819"); // { valid: true }
validateBSB("062-000"); // { valid: true, bank: "Commonwealth Bank" }
```

## Supported Formats

- **IBAN** — 80+ countries with MOD-97 check
- **SWIFT/BIC** — 8 or 11 character codes
- **IFSC** — India
- **BSB** — Australia
- **Routing Number** — US (ABA), Canada (transit)

## License

[Apache-2.0](../../LICENSE)
