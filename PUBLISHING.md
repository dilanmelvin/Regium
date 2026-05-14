# Publishing Regium

How to release Regium to **every JavaScript package registry** so anyone can install it with their favourite tool — `npm`, `pnpm`, `yarn`, `bun`, `deno`, JSR, GitHub Packages, or via CDN (jsDelivr, esm.sh).

---

## Table of contents

1. [What gets published](#what-gets-published)
2. [Prerequisites](#prerequisites)
3. [Step 1 — Choose a scope](#step-1--choose-a-scope-on-npm)
4. [Step 2 — Generate an npm token](#step-2--generate-an-npm-access-token)
5. [Step 3 — Add the token to GitHub](#step-3--add-the-token-to-github)
6. [Step 4 — First release (automated)](#step-4--first-release-automated-recommended)
7. [Manual release fallback](#manual-release-fallback)
8. [Subsequent releases](#subsequent-releases)
9. [Distribution channels](#distribution-channels)
   - [npm](#npm)
   - [pnpm](#pnpm)
   - [yarn](#yarn)
   - [bun](#bun)
   - [GitHub Packages](#github-packages)
   - [JSR](#jsr-jsrio--for-deno-and-modern-runtimes)
   - [Deno](#deno)
   - [CDN: jsDelivr / unpkg / esm.sh](#cdn-jsdelivr--unpkg--esmsh)
10. [Verify a published package](#verify-a-published-package)
11. [Troubleshooting](#troubleshooting)

---

## What gets published

Every package whose `package.json` has `"private": false` is published. In Regium that's everything in `packages/` (22 packages):

```
@regium/core              @regium/types         @regium/utils
@regium/localization      @regium/validators    @regium/forms
@regium/banking           @regium/tax           @regium/payroll
@regium/labor             @regium/countries     @regium/react
@regium/country-in        @regium/country-us    @regium/country-uk
@regium/country-de        @regium/country-fr    @regium/country-sg
@regium/country-ae        @regium/country-br    @regium/country-au
@regium/country-ca
```

The two apps (`@regium/playground`, `@regium/docs`) are marked `"private": true` and stay local.

---

## Prerequisites

You need:

- An **npm.com account** ([signup](https://www.npmjs.com/signup))
- An **npm organization** matching the scope (`regium`)
- A **GitHub repository** for the project
- Local **Node ≥ 18.17** and **pnpm ≥ 9** (see [`RUNNING.md`](./RUNNING.md))

---

## Step 1 — Choose a scope on npm

Sign in to <https://www.npmjs.com/> → click your avatar → **Add Organization**:

- **Org name:** `regium`
- **Visibility:** Public (free)

> ⚠️ If `regium` is taken, pick another scope (e.g. your handle), and rename the packages:
>
> ```bash
> # quick rename across the repo
> npx replace-in-files-cli --string "@regium/" --replacement "@your-scope/" "package*.json" "**/*.{ts,tsx,md,json}"
> ```

---

## Step 2 — Generate an npm access token

1. <https://www.npmjs.com/> → avatar → **Access Tokens** → **Generate New Token** → **Granular Access Token**.
2. Settings:
   - **Name:** `regium-ci`
   - **Expiration:** 365 days
   - **Permissions:** Read and write
   - **Packages and scopes:** select `@regium`
3. Click **Generate Token**. **Copy it now** — npm only shows it once.

---

## Step 3 — Add the token to GitHub

In your GitHub repo:

**Settings → Secrets and variables → Actions → New repository secret**

- **Name:** `NPM_TOKEN`
- **Value:** the token from step 2

The release workflow (`.github/workflows/release.yml`) reads it automatically.

> **Optional but recommended:** also enable 2FA on npm (`npm profile enable-2fa auth-and-writes`) and use an **automation token** instead of a publish token, so CI can publish without prompting.

---

## Step 4 — First release (automated, recommended)

The repo is wired with **Changesets** + **GitHub Actions**. The flow:

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "feat: initial Regium implementation"
git branch -M main
git remote add origin https://github.com/<you>/regium.git
git push -u origin main
```

What happens next:

1. The push triggers `release.yml`.
2. Because `.changeset/initial.md` already exists, GitHub Actions opens a PR titled **"chore: release"** that bumps every package version and updates changelogs.
3. **Review and merge that PR.**
4. The merge re-runs the workflow, which now **publishes every package to npm with provenance**.
5. Verify on npm:
   - <https://www.npmjs.com/package/@regium/core>
   - <https://www.npmjs.com/package/@regium/country-in>
   - …

---

## Manual release fallback

If you'd rather publish from your laptop (no CI), you need to be logged in:

```bash
npm login        # username, password, OTP from your authenticator
npm whoami       # verify
```

Then:

```bash
pnpm install
pnpm build
pnpm changeset version            # bumps versions based on .changeset/*.md
git add .
git commit -m "chore: release"
pnpm release                       # turbo run build && changeset publish
```

`pnpm release` skips packages whose version is already on the registry, so it's safe to re-run if it stops mid-way.

---

## Subsequent releases

For every change after the first release:

```bash
git checkout -b feat/add-country-jp

# ... make changes ...

pnpm changeset                     # interactive: pick packages + severity
git add .
git commit -m "feat: add Japan country pack"
git push -u origin feat/add-country-jp
```

Open a PR. When it merges to `main`, the GitHub Actions workflow opens / updates the **Version PR** automatically. Merging the Version PR triggers the actual npm publish.

---

## Distribution channels

After a successful npm release, your packages are automatically reachable from every major JavaScript ecosystem.

### npm

The default. No configuration needed.

```bash
npm install @regium/core @regium/country-in
npm install @regium/core @regium/country-in --save-exact
```

### pnpm

Reads from npm by default.

```bash
pnpm add @regium/core @regium/country-in
pnpm add @regium/core @regium/country-in --save-exact
```

### yarn

Reads from npm by default. Works for both Yarn 1 (Classic) and Yarn 2/3/4 (Berry).

```bash
yarn add @regium/core @regium/country-in
```

For Yarn Berry with PnP, ensure your `.yarnrc.yml` has:

```yaml
nodeLinker: node-modules    # or pnp
```

### bun

Reads from npm.

```bash
bun add @regium/core @regium/country-in
```

### GitHub Packages

Useful for **private mirrors** or **enterprise distribution**.

#### Publishing

Add a workflow `.github/workflows/publish-gh.yml`:

```yaml
name: Publish to GitHub Packages
on:
  workflow_dispatch:
permissions:
  contents: read
  packages: write
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
          registry-url: https://npm.pkg.github.com
          scope: '@regium'
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: pnpm -r publish --no-git-checks
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

#### Consuming

In the consumer project, add a `.npmrc`:

```ini
@regium:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Then:

```bash
npm install @regium/core
```

### JSR (jsr.io — for Deno and modern runtimes)

JSR is the modern registry by the Deno team that supports TypeScript natively.

#### Publishing

For each public package add a `jsr.json` next to `package.json`:

```json
{
  "name": "@regium/core",
  "version": "0.1.0",
  "exports": "./src/index.ts",
  "publish": {
    "include": ["src/**/*.ts", "README.md", "LICENSE"]
  }
}
```

Then run:

```bash
# install the JSR CLI
npm install -g @jsr/cli

# log in
deno publish --token=<your-jsr-token>     # or
npx jsr publish
```

#### Consuming

```bash
# Deno
deno add @regium/core

# Node + npm/pnpm/yarn (JSR provides an npm shim)
npx jsr add @regium/core
```

```ts
import { createRegium } from "@regium/core";
```

### Deno

Deno can install **directly from JSR** (preferred), npm via the `npm:` specifier, or any HTTPS URL.

```ts
// JSR (recommended)
import { createRegium } from "jsr:@regium/core@^0.1";

// npm specifier
import { createRegium } from "npm:@regium/core@^0.1";

// CDN (esm.sh)
import { createRegium } from "https://esm.sh/@regium/core@0.1";
```

### CDN: jsDelivr / unpkg / esm.sh

Once published to npm, every package is **automatically mirrored** to all major CDNs. No extra steps needed.

#### jsDelivr

```html
<script type="module">
  import { createRegium } from "https://cdn.jsdelivr.net/npm/@regium/core@0.1/+esm";
  import india from "https://cdn.jsdelivr.net/npm/@regium/country-in@0.1/+esm";
  const r = createRegium({ plugins: [india] });
</script>
```

#### unpkg

```html
<script type="module">
  import { createRegium } from "https://unpkg.com/@regium/core@0.1/dist/index.js";
</script>
```

#### esm.sh

```ts
import { createRegium } from "https://esm.sh/@regium/core@0.1";
```

---

## Verify a published package

After releasing, smoke-test from a clean directory:

```bash
mkdir /tmp/regium-test && cd /tmp/regium-test
npm init -y
npm install @regium/core @regium/country-in
node -e "const { createRegium } = require('@regium/core'); const india = require('@regium/country-in').default; const r = createRegium({ plugins: [india] }); console.log(r.getCountryConfig('IN').name);"
# → "India"
```

Or with ESM:

```bash
node --input-type=module -e "import('@regium/core').then(async ({ createRegium }) => { const india = (await import('@regium/country-in')).default; const r = createRegium({ plugins: [india] }); console.log(r.getCountryConfig('IN').name); });"
```

---

## Troubleshooting

### `402 Payment Required` when publishing

The package name is taken or scope is set to private. Either:

- Add `"publishConfig": { "access": "public" }` (already done in this repo), **or**
- Run `npm publish --access public` for a manual publish.

### `ENEEDAUTH` / `401 Unauthorized`

Your `NPM_TOKEN` is missing, expired, or scoped wrong. Regenerate the token (Step 2) and re-add it as a GitHub secret (Step 3).

### `ERR_PNPM_FROZEN_LOCKFILE_WITH_OUTDATED_LOCKFILE`

Run `pnpm install` locally and commit the updated `pnpm-lock.yaml`.

### Provenance error

Make sure the workflow has `id-token: write` permission (already set in `release.yml`) and the runner is GitHub-hosted.

### Publishing fails halfway through

Changesets publishes packages one at a time. If it stops mid-way, just re-run `pnpm release` — already-published packages are skipped automatically.

### Wrong package name showed up on npm

You probably renamed in only some files. Search-and-replace one more time:

```bash
grep -r "@regium/" --include="package.json" .
```

Every result should match your chosen scope.

### Removing a published version

```bash
npm unpublish @regium/<pkg>@<version>      # within 72 hours of publish
npm deprecate @regium/<pkg>@<version> "use 0.1.x instead"   # afterwards
```

> ⚠️ npm only allows full unpublish within 72 hours of release. After that, deprecate instead.

---

## Want to publish to even more places?

Once on npm, the ecosystem mirrors automatically:

| Channel | URL pattern |
| ------- | ----------- |
| npm     | `https://registry.npmjs.org/@regium/core` |
| jsDelivr | `https://cdn.jsdelivr.net/npm/@regium/core` |
| unpkg   | `https://unpkg.com/@regium/core` |
| esm.sh  | `https://esm.sh/@regium/core` |
| skypack | `https://cdn.skypack.dev/@regium/core` |
| Deno via npm | `npm:@regium/core` |

You don't have to do anything for these — they sync from npm automatically.

---

You're done. Push to `main`, merge the release PR, and your packages are live worldwide.
