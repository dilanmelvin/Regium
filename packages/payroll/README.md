# @regium/payroll

Gross-to-net payroll engine with country-specific deduction and contribution rules.

Part of the [Regium](../../README.md) ecosystem — global workforce compliance infrastructure for developers.

## Install

```bash
npm install @regium/payroll
```

## Usage

```ts
import { calculatePayroll } from "@regium/payroll";

const payslip = calculatePayroll({
  country: "IN",
  gross: 100000,
  period: "monthly",
  employee: { regime: "new" },
});

console.log(payslip.net); // net salary after deductions
```

## Features

- Gross-to-net calculation with full breakdown
- Country-specific statutory deductions (PF, ESI, NI, SS, CPP…)
- Support for multiple tax regimes per country
- Extensible via country packs

## License

[Apache-2.0](../../LICENSE)
