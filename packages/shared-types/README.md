# @regium/types

Shared Zod schemas and TypeScript types used across the Regium ecosystem.

Part of the [Regium](../../README.md) ecosystem — global workforce compliance infrastructure for developers.

## Install

```bash
npm install @regium/types
```

## Usage

```ts
import { type CountryCode, type CurrencyCode } from "@regium/types";
import { employeeSchema } from "@regium/types/schemas";

const parsed = employeeSchema.parse(rawData);
```

## Contents

- Zod schemas for payroll, tax, banking, and employee data
- TypeScript type exports for all domain models
- Shared enums and constants (country codes, currency codes)

## License

[Apache-2.0](../../LICENSE)
