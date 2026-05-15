# Go Live — Make `npm install @regium/core` actually work

Honest, step-by-step guide. Read top to bottom. Skip nothing.

---

## The plain truth

Right now, if you open a new project anywhere on your machine and run:

```bash
npm install @regium/core @regium/country-in
```

it **will fail** with `404 Not Found`. Why? Because:

1. The packages exist only in your `D:\Regium` workspace.
2. They are linked together via pnpm workspace symlinks (`workspace:*`).
3. **Nothing has been published to npm yet.**

To make those install commands work, you have to do exactly **three real-world things**:

1. Create an npm account + organisation (the **scope** `@regium`).
2. Generate an npm access token.
3. Publish the packages — either from your laptop manually, or via GitHub Actions automatically.

Until those three steps are done, the packages don't exist on the public internet. After, they're installable from anywhere with `npm`, `pnpm`, `yarn`, `bun`, `deno`, jsDelivr, esm.sh — instantly and forever.

This document also covers a **local test path** (link / pack / tarball) so you can verify everything works *before* you publish to the world.

---

## Choose your path

| Path | Who it's for | Result |
|------|--------------|--------|
| [A. Local test (link)](#path-a--local-test-with-pnpm-link)            | You, before publishing | `import` works in a sandbox project on your machine |
| [B. Local test (tarball)](#path-b--local-test-with-pnpm-pack)         | You, before publishing | A `.tgz` you can `npm install` from anywhere on your disk |
| [C. Publish to npm](#path-c--publish-to-npm-real-world-installs-work) | Public release         | `npm install @regium/core` works for everyone on Earth |

You can do A → B → C in order. They build on each other.

---

## Prerequisites

Make sure these all work in your terminal:

```bash
node --version          # v18.17+ (v20 LTS recommended)
pnpm --version          # 9.x
git --version
```

Need to install something? See [`RUNNING.md`](./RUNNING.md).

Then, from `D:\Regium`:

```bash
pnpm install
pnpm build
```

The build must say **"25 successful, 25 total"** before you do anything else.

---

## Path A — Local test with `pnpm link`

The fastest way to feel "wait, does my package actually work?" without publishing.

### 1. Build the packages

```bash
cd D:\Regium
pnpm build
```

### 2. Create a fresh sandbox project

```bash
cd D:\
mkdir regium-sandbox
cd regium-sandbox
pnpm init
```

When prompted, accept the defaults. Now you have a tiny `package.json`.

### 3. Link the local Regium packages

```bash
# from D:\regium-sandbox
pnpm link D:\Regium\packages\core
pnpm link D:\Regium\packages\country-india
pnpm link D:\Regium\packages\shared-types
pnpm link D:\Regium\packages\shared-utils
pnpm link D:\Regium\packages\localization
pnpm link D:\Regium\packages\validators
```

> **Why so many?** `pnpm link` doesn't follow the workspace dependency graph the way a normal install does. You have to link every transitive `@regium/*` package the consumer touches.
>
> **Easier alternative:** use Path B (`pnpm pack`) which does follow the graph.

### 4. Write a test file

Create `D:\regium-sandbox\test.mjs`:

```js
import { createRegium } from "@regium/core";
import india from "@regium/country-in";

const regium = createRegium({ plugins: [india] });
console.log("Country:", regium.getCountryConfig("IN").name);
console.log("Validate PAN:", regium.validate({ country: "IN", field: "PAN", value: "ABCPL1234C" }));
```

### 5. Run it

```bash
node test.mjs
```

You should see:

```
Country: India
Validate PAN: { ok: true, errors: [], normalized: 'ABCPL1234C' }
```

✅ The package works locally.

---

## Path B — Local test with `pnpm smoke-test`

This is the fastest, most reliable way to verify everything works **before** publishing. The `smoke-test` script does the full publish-and-install dry run automatically:

1. Packs every public package as a `.tgz` (the same artefact `npm publish` uploads)
2. Creates a clean sandbox project in your temp dir
3. Installs the tarballs there with `npm install`
4. Runs 11 real validations across 218 countries (positive + negative cases)
5. Cleans up

```bash
cd D:\Regium
pnpm smoke-test
```

Expected output ends with:

```
══════════════════════════════════════════════
  ✓ Regium is healthy. Ready to publish to npm.
══════════════════════════════════════════════
```

If this passes, **publishing to npm will also work** — same artefacts, same install path, just hosted publicly instead of on your disk.

Want to inspect the sandbox after the test? Add `--keep`:

```bash
pnpm smoke-test --keep
```

The script prints the temp paths (sandbox + tarballs) so you can poke around manually.

---

## Path C — Publish to npm (real-world installs work)

This is the path that makes `npm install @regium/core` work for the entire world.

### Step 1 — Create an npm account and organisation

1. Go to <https://www.npmjs.com/signup> and create an account (free).
2. Verify your email.
3. Sign in, click your **avatar → Add Organization**.
4. Choose:
   - **Org name:** `regium`
   - **Visibility:** Public (free)
5. Click **Create**.

> ⚠️ If `regium` is taken, pick another scope. Then rename every `@regium/...` to `@your-scope/...` across the repo:
>
> ```bash
> # one-time rename (PowerShell)
> Get-ChildItem -Recurse -Include package.json,*.ts,*.tsx,*.md,*.json | ForEach-Object {
>   (Get-Content $_ -Raw) -replace '@regium/', '@your-scope/' | Set-Content $_
> }
> ```
>
> On macOS / Linux:
>
> ```bash
> grep -rl "@regium/" --include="*.{json,ts,tsx,md}" . | xargs sed -i 's|@regium/|@your-scope/|g'
> ```

### Step 2 — Generate an npm access token

1. Go to <https://www.npmjs.com/> → **avatar → Access Tokens**.
2. Click **Generate New Token → Granular Access Token**.
3. Fill in:
   - **Token name:** `regium-publish`
   - **Expiration:** 365 days
   - **Permissions:** **Read and write**
   - **Packages and scopes:** select your `@regium` org (or your scope)
4. Click **Generate Token**.
5. **Copy it immediately.** npm only shows it once.

### Step 3 — Authenticate locally (one-time)

```bash
npm login
```

It will:

1. Open your browser.
2. Ask for your npm credentials.
3. Ask for the OTP from your authenticator app (if 2FA is on).

Verify:

```bash
npm whoami
# → your npm username
```

### Step 4 — Bump versions with Changesets

Inside `D:\Regium`:

```bash
pnpm changeset version
```

This reads `.changeset/initial.md` (already created) and bumps every package's version from `0.1.0` → the agreed level. Commit the changes:

```bash
git add .
git commit -m "chore: release"
```

> If you skipped Git so far:
>
> ```bash
> cd D:\Regium
> git init
> git add .
> git commit -m "feat: initial Regium implementation"
> ```

### Step 5 — Publish

```bash
pnpm release
```

This runs `turbo run build && changeset publish`. Watch the output — you'll see it publish each package one at a time:

```
🦋  info Publishing "@regium/types" at "0.1.0"
🦋  info Publishing "@regium/utils" at "0.1.0"
🦋  info Publishing "@regium/core" at "0.1.0"
...
🦋  success packages published successfully:
🦋  @regium/types@0.1.0
🦋  @regium/utils@0.1.0
... (× 23)
```

### Step 6 — Verify on npmjs.com

Open these URLs in your browser:

- <https://www.npmjs.com/package/@regium/core>
- <https://www.npmjs.com/package/@regium/country-in>
- <https://www.npmjs.com/package/@regium/countries>

Each should show your version, README, and install command.

### Step 7 — Test from a fresh project

```bash
cd D:\
mkdir regium-real-test
cd regium-real-test
npm init -y
npm install @regium/core @regium/country-in

echo 'import { createRegium } from "@regium/core"; import india from "@regium/country-in"; const r = createRegium({ plugins: [india] }); console.log(r.getCountryConfig("IN").name);' > test.mjs
echo '{"type":"module"}' > package.json   # PowerShell: see note below

node test.mjs
# → India
```

> 🪟 **PowerShell note:** the second `echo` overwrites `package.json`. Instead, edit it manually and add `"type": "module"`. Or use `node --input-type=module -e "..."`.

### Step 8 — All package managers now work

After publishing, **all of these work for anyone on Earth**:

```bash
npm install @regium/core @regium/country-in
pnpm add @regium/core @regium/country-in
yarn add @regium/core @regium/country-in
bun add @regium/core @regium/country-in
```

And via Deno or browser:

```ts
import { createRegium } from "npm:@regium/core";                   // Deno
import { createRegium } from "https://esm.sh/@regium/core";        // browser
```

---

## Step-by-step guide for **using** Regium in a new project

This is what your *users* will do once you've published.

### 1. Create a project

#### Vanilla Node + TypeScript

```bash
mkdir my-payroll-app
cd my-payroll-app
npm init -y
npm install -D typescript tsx @types/node
npx tsc --init
```

Edit `package.json`:

```json
{
  "type": "module"
}
```

#### React + Vite

```bash
npm create vite@latest my-hr-app -- --template react-ts
cd my-hr-app
npm install
```

#### Next.js

```bash
npx create-next-app@latest my-hr-app --typescript
cd my-hr-app
```

### 2. Install Regium

```bash
npm install @regium/core @regium/countries
# or, only what you need:
npm install @regium/core @regium/country-in @regium/country-us
```

For React projects, also:

```bash
npm install @regium/react
```

### 3. Use it

`src/regium.ts`:

```ts
import { createRegium } from "@regium/core";
import { allCountries } from "@regium/countries";

export const regium = createRegium({
  plugins: allCountries,
  effectiveDate: new Date(),
});
```

`src/main.ts`:

```ts
import { regium } from "./regium.js";

console.log(regium.getCountryConfig("IN").currency);
console.log(regium.validate({ country: "US", field: "SSN", value: "123-45-6789" }));
```

Run:

```bash
npx tsx src/main.ts
```

### 4. React example

`src/main.tsx`:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { createRegium } from "@regium/core";
import { allCountries } from "@regium/countries";
import { RegiumProvider } from "@regium/react";
import App from "./App";

const regium = createRegium({ plugins: allCountries });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RegiumProvider regium={regium}>
    <App />
  </RegiumProvider>,
);
```

`src/App.tsx`:

```tsx
import { useRegium } from "@regium/react";

export default function App() {
  const regium = useRegium();
  const result = regium.validate({ country: "IN", field: "PAN", value: "ABCPL1234C" });
  return <pre>{JSON.stringify(result, null, 2)}</pre>;
}
```

```bash
npm run dev
```

Open <http://localhost:5173>. Done.

---

## Updating Regium (subsequent releases)

For every change after the initial release:

```bash
cd D:\Regium

# 1. make code changes
# 2. add a changeset describing them
pnpm changeset
#    → pick affected packages
#    → pick severity (patch / minor / major)
#    → write a one-line summary

# 3. commit
git add .
git commit -m "feat: add Japan country pack"

# 4. version bump
pnpm changeset version
git add .
git commit -m "chore: release"

# 5. publish
pnpm release
```

Or, if you wired up the GitHub Actions workflow (`.github/workflows/release.yml`), just `git push` to `main`. The workflow opens a "chore: release" PR. Merging it triggers the publish automatically.

---

## Common questions

### "Do I have to manually publish each of the 25 packages?"

**No.** `pnpm release` (which runs `changeset publish`) walks the workspace, builds the dependency graph, and publishes every package whose `version` is newer than what's on npm. One command publishes everything.

### "Can I publish only some packages?"

Yes. Use `pnpm publish` with a filter:

```bash
pnpm --filter @regium/core publish --access public
```

But Changesets handles this for you automatically based on which packages changed.

### "What if I make a mistake on the first publish?"

Within **72 hours**, you can unpublish:

```bash
npm unpublish @regium/core@0.1.0
```

After 72 hours, you can only **deprecate** (the version stays but warns):

```bash
npm deprecate @regium/core@0.1.0 "Critical bug, use 0.1.1+"
```

### "Do users need to install all 25 packages?"

**No.** The architecture is intentionally tree-shakable. Most apps only need:

- `@regium/core` — required (registry + resolver)
- `@regium/country-<iso2>` — one or more country packs
- `@regium/react` *(optional)* — only for React apps

The rest (`@regium/types`, `@regium/utils`, `@regium/validators`, etc.) are pulled in automatically as transitive dependencies. The user never installs them directly.

### "How big is the bundle?"

| Package | Minified |
|---------|----------|
| `@regium/core`        | ~3 KB |
| `@regium/country-in`  | ~11 KB |
| `@regium/country-us`  | ~9 KB |
| `@regium/validators`  | ~13 KB (tree-shaken to ~1 KB if you only use one) |

Total for India + US payroll: **~30 KB minified**. Compare to `moment-timezone` at ~600 KB.

### "What about the 218 countries?"

`@regium/country-data` ships every country in one ~50 KB minified package. If a user wants light coverage globally, they install just that. If they want detailed payroll for India + US, they install `@regium/country-in` and `@regium/country-us`. Both can be combined.

---

## Troubleshooting

### `npm ERR! 404 Not Found - GET https://registry.npmjs.org/@regium%2fcore`

The package isn't published yet. Go back to [Path C](#path-c--publish-to-npm-real-world-installs-work).

### `npm ERR! 403 Forbidden - PUT https://registry.npmjs.org/@regium%2fcore`

You don't have publish permission for the `@regium` scope. Either:

- The org doesn't exist yet — go back to [Step 1](#step-1--create-an-npm-account-and-organisation).
- Your token doesn't have write permission — regenerate (Step 2) with **Read and write**.
- You're not a member of the `@regium` org — invite yourself or check membership.

### `npm ERR! 402 Payment Required`

The package is being treated as private. Make sure every `package.json` has:

```json
"publishConfig": { "access": "public" }
```

This is already set in every Regium package. If you renamed scopes, double-check it survived.

### `npm ERR! E401 — Unauthorized`

Your token is expired or wrong. Run:

```bash
npm logout
npm login
```

### `command not found: pnpm` after install

Restart your terminal. If still missing:

```bash
npm install -g pnpm@9
# or use corepack which ships with Node:
corepack enable
corepack prepare pnpm@9 --activate
```

### "After publishing, `npm install @regium/core` returns an old version"

npm and your registry mirror cache aggressively. Run:

```bash
npm cache clean --force
npm install @regium/core@latest
```

### Publish hangs or fails partway

```bash
pnpm release
```

Just re-run it. Already-published packages are skipped automatically.

### "I can't get GitHub Actions to publish for me"

Two prerequisites:

1. Add `NPM_TOKEN` as a **repository secret** at *Settings → Secrets and variables → Actions*.
2. Set `permissions: { contents: write, pull-requests: write, id-token: write }` in the workflow (already set in `.github/workflows/release.yml`).

If still failing, check the Actions log. The most common error is "ENEEDAUTH" — fix is to regenerate the token and update the secret.

---

## Final checklist

Before you publish for the first time, confirm:

- [ ] `pnpm build` says "25 successful"
- [ ] `pnpm lint` says "No fixes applied"
- [ ] `pnpm typecheck` succeeds
- [ ] You ran [Path B (pnpm pack)](#path-b--local-test-with-pnpm-pack) and got `India` printed
- [ ] You created the `@regium` org on npm (or renamed to your scope)
- [ ] `npm whoami` returns your username
- [ ] Your access token has **Read and write** for the `@regium` scope
- [ ] You committed everything to Git

When all checked → run `pnpm release`. You're live.
