# @regium/labor

Leave accrual, working hours, and termination calculation engine.

Part of the [Regium](../../README.md) ecosystem — global workforce compliance infrastructure for developers.

## Install

```bash
npm install @regium/labor
```

## Usage

```ts
import { calculateLeaveBalance, calculateTermination } from "@regium/labor";

const balance = calculateLeaveBalance({
  country: "IN",
  joinDate: "2023-01-15",
  asOf: "2024-06-01",
});

console.log(balance.earned); // accrued leave days
```

## Features

- Leave accrual rules per country (earned, casual, sick)
- Working hours and overtime calculations
- Termination/severance pay computation
- Probation and notice period rules

## License

[Apache-2.0](../../LICENSE)
