# Contributing to Regium

Thanks for helping build the global workforce compliance layer. This guide explains how to add a country, validator, or adapter.

## Prerequisites

- Node.js ≥ 18.17
- pnpm ≥ 9
- A primary government source for any metadata you contribute

## Setup

```bash
git clone https://github.com/<your-fork>/regium.git
cd regium
pnpm install
pnpm build
pnpm test
```

## Workflow

1. Create a branch: `git checkout -b feat/country-xy`
2. Make your changes (see recipes below).
3. Add a changeset: `pnpm changeset` — pick affected packages and severity.
4. Run checks: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`.
5. Open a PR with a clear description and source citations.

## Adding a Country Pack

1. Copy an existing country pack as a template (`packages/country-in` is the canonical reference).
2. Rename to `packages/country-<iso2-lower>`.
3. Update `package.json` (`name`, `description`).
4. Fill in the data files under `src/data/`:
   - `country.ts` — ISO codes, currency, timezones, languages
   - `company-fields.ts` — corporate IDs (VAT, EIN, CIN, etc.)
   - `employee-fields.ts` — national IDs, tax IDs, work permits
   - `payroll-rules.ts` — frequencies, components, contributions
   - `tax-rules.ts` — slabs, regimes
   - `labor-rules.ts` — working hours, leave, termination
   - `banking-rules.ts` — IBAN/SWIFT/IFSC config
   - `localization.ts` — locale formatting
   - `validators.ts` — bind validators to fields
   - `immigration.ts` — visa categories
   - `leave-rules.ts` — leave types & accrual
5. Cite primary government sources in each file's metadata envelope.
6. Add tests in `tests/`.
7. Register the pack in `packages/countries/src/index.ts`.

## Adding a Validator

Add to `packages/validators/src/<jurisdiction>/<id>.ts`:

```ts
import { regex } from "../primitives";
import type { Validator } from "@regium/types";

export const myId: Validator = regex({
  id: "xy.my-id",
  description: "My ID format",
  jurisdiction: "XY",
  pattern: /^[A-Z]{3}\d{6}$/,
});
```

## Code Style

- Biome handles formatting and linting (`pnpm lint`, `pnpm format`).
- TypeScript: strict mode, no `any`.
- Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`).

## Source Citations

Every metadata change must include at least one **primary government source** (statute, gazette, official authority website). Wikipedia and tax-advisory blogs are not acceptable as primary sources.

## Code of Conduct

By participating, you agree to abide by the [Contributor Covenant](./CODE_OF_CONDUCT.md).
