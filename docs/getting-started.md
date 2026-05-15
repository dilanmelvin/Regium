# Getting Started with Regium

A fast, clean walk-through of the Regium monorepo and how to use it.

---

## 1. The 60-second tour

```bash
pnpm install         # one-time setup
pnpm build           # build all 24 packages
pnpm playground      # open the live UI at http://localhost:5173
pnpm test            # run all tests
pnpm lint            # check code style with Biome
```

That's it. Every step works on a fresh clone.

---

## 2. What's in here?

```
apps/
  playground/     Live UI sandbox (clean white React app)
  docs/           Static documentation site

packages/
  shared-types/   All Zod schemas + TS types
  shared-utils/   Date, locale, currency, mask, checksum primitives
  localization/   i18n helpers
  core/           Registry, resolver, plugin host (createRegium)
  validators/     Composable validators (PAN, IBAN, CPF, NRIC, …)
  banking/        IBAN/SWIFT/IFSC/BSB/routing helpers
  tax/            Slab/regime tax engine
  payroll/        Gross→net engine
  labor/          Leave + working-hours engine
  forms/          Schema-driven form engine
  countries/      Master registry that bundles all country packs
  country-india, country-us, country-uk, country-germany,
  country-france, country-singapore, country-uae, country-brazil,
  country-australia, country-canada      (10 T1 countries)
  react/          React adapter (RegiumProvider, useRegiumForm, useValidate)

tools/
  tsconfig/       Shared TypeScript configs
```

---

## 3. The simplest possible usage

```ts
import { createRegium } from "@regium/core";
import india from "@regium/country-in";

const regium = createRegium({ plugins: [india] });

regium.getCountryConfig("IN").currency;
// → { code: "INR", symbol: "₹", decimals: 2, name: "Indian Rupee" }

regium.validate({ country: "IN", field: "PAN", value: "ABCPL1234C" });
// → { ok: true, errors: [], normalized: "ABCPL1234C" }
```

Or load every bundled country in one line:

```ts
import { allCountries } from "@regium/countries";
const regium = createRegium({ plugins: allCountries });
```

---

## 4. The playground

`pnpm playground` boots a Vite + React app that lets you:

- **Overview** — see country profile, currency, languages, tax authority, leave policies.
- **Validators** — try every compliance ID interactively.
- **Form** — auto-generated employee/company forms with live validation.
- **Payroll** — gross→net simulator using real country rules.

The UI is intentionally clean and white — semantic, accessible, and easy to embed in your own product.

---

## 5. Adding a new country

1. Copy `packages/country-india` to `packages/country-<iso2>`.
2. Update `package.json` (`name`, `description`).
3. Edit `src/index.ts` — replace the metadata for each domain (country, payroll, tax, labor, banking, etc.).
4. Cite your sources in every envelope's `source[]` array.
5. Add the package as a dependency of `@regium/countries` and re-export it.
6. Run `pnpm build` — it should pass.
7. Add a changeset: `pnpm changeset`.

The schemas in `@regium/types` enforce the shape at build time. If the build fails, the error message tells you exactly what's missing.

---

## 6. Releasing to npm

See [PUBLISHING.md](./PUBLISHING.md) for the full guide.

Short version:

```bash
# one-time:
#   1. create npm org
#   2. add NPM_TOKEN to GitHub Secrets
git push origin main         # triggers release workflow
# merge the auto-opened "chore: release" PR → packages publish to npm
```

After publishing, anyone can:

```bash
npm install @regium/core @regium/country-in
```

---

## 7. Useful commands

```bash
pnpm --filter @regium/core build       # build one package
pnpm --filter @regium/core test        # test one package
pnpm --filter @regium/playground dev   # run only the playground
pnpm changeset                          # add a changeset
pnpm changeset version                  # bump versions
pnpm release                            # build + publish
pnpm clean                              # remove all dist + node_modules
```

---

## 8. Troubleshooting

| Symptom                                        | Fix                                                              |
| ---------------------------------------------- | ---------------------------------------------------------------- |
| `pnpm: command not found`                      | `npm install -g pnpm@9`                                          |
| Build fails on a country pack you just added   | Run with `--verbose` to see the Zod error; fields likely mistyped |
| Playground shows blank page                    | Ensure all packages are built first (`pnpm build`)               |
| Lint errors after editing                      | Run `pnpm lint:fix` — Biome auto-fixes formatting + imports      |

---

You're ready. Open `pnpm playground` and explore.
