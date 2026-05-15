# @regium/validators

Composable validators for international identifiers — PAN, IBAN, CPF, NRIC, SSN, and more.

Part of the [Regium](../../README.md) ecosystem — global workforce compliance infrastructure for developers.

## Install

```bash
npm install @regium/validators
```

## Usage

```ts
import { validateIBAN, validatePAN, validateCPF } from "@regium/validators";

validateIBAN("DE89370400440532013000"); // { valid: true }
validatePAN("ABCDE1234F");              // { valid: true }
validateCPF("123.456.789-09");          // { valid: false, error: "..." }
```

## Supported Validators

PAN · IBAN · CPF · CNPJ · NRIC · SSN · TFN · SIN · NIF · BSN · and more per country pack.

## License

[Apache-2.0](../../LICENSE)
