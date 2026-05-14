# Regium Implementation Tasks

Tracking checklist for the build. Items are completed in order.

## Phase 0 — Repo Bootstrap

- [x] Implementation plan written
- [x] Task list written
- [x] Root `package.json`, `pnpm-workspace.yaml`, `turbo.json`
- [x] Shared `tsconfig.base.json`, `biome.json`, `.gitignore`, `.npmrc`
- [x] `LICENSE`, `README.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`
- [x] `tools/tsconfig` shared TS configs
- [x] `tools/biome-config` shared lint config

## Phase 1 — Foundations

- [x] `packages/shared-types` — all Zod schemas + TS types
- [x] `packages/shared-utils` — date, locale, currency primitives
- [x] `packages/localization` — formatters, i18n
- [x] `packages/core` — registry, resolver, plugin host, `createRegium`

## Phase 2 — Engines

- [x] `packages/validators` — global + composable validators
- [x] `packages/banking` — IBAN/SWIFT/IFSC/BSB/routing
- [x] `packages/tax` — slab/regime engine
- [x] `packages/payroll` — gross→net engine
- [x] `packages/labor` — leave & working-hours engine
- [x] `packages/forms` — schema-driven form engine

## Phase 3 — Country Registry & T1 Country Packs

- [x] `packages/countries` — master registry & loader
- [x] `country-india` (IN)
- [x] `country-us` (US)
- [x] `country-uk` (UK / GB)
- [x] `country-germany` (DE)
- [x] `country-france` (FR)
- [x] `country-singapore` (SG)
- [x] `country-uae` (AE)
- [x] `country-brazil` (BR)
- [x] `country-australia` (AU)
- [x] `country-canada` (CA)

## Phase 4 — Framework Adapters

- [x] `packages/react` — `useRegiumForm`, headless components

## Phase 5 — Apps

- [x] `apps/playground` — Vite + React, clean white UI
- [x] `apps/docs` — basic documentation site (Markdown-driven)

## Phase 6 — DX & Release

- [x] `.changeset/config.json` + initial changeset
- [x] `.github/workflows/ci.yml`
- [x] `.github/workflows/release.yml`
- [x] `PUBLISHING.md` — npm credential & release guide
- [x] `EXAMPLES.md` — copy-paste recipes

