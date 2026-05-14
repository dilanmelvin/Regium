# Publishing Regium to npm

A step-by-step guide for releasing the Regium ecosystem so anyone can `npm install @regium/core` and friends.

---

## Prerequisites

You need:

1. **An npm account** — https://www.npmjs.com/signup
2. **An npm organization called `regium`** (or whatever scope you want to use). On https://www.npmjs.com/, click your avatar → *Add Organization* → name it `regium` (free for public packages).
3. **A GitHub repository** for the project (so CI can publish on your behalf).
4. **Local Node.js ≥ 18.17 and pnpm ≥ 9** installed.

---

## One-time setup

### Step 1 — Create the npm scope

Sign in to https://www.npmjs.com → click your avatar → **Add Organization**.
- **Org name:** `regium`
- **Type:** Public (free) or Paid

Once created, you can publish packages under `@regium/*`.

> If `regium` is already taken on npm, change the scope. Pick a unique name (e.g. `@your-handle`), then in every `package.json` rename `@regium/...` to `@your-handle/...` (use `pnpm dlx renamer` or a global find-replace).

### Step 2 — Generate an npm access token

1. https://www.npmjs.com/ → avatar → **Access Tokens** → **Generate New Token** → **Granular Access Token** (recommended).
2. Settings:
   - **Token name:** `regium-ci`
   - **Expiration:** 365 days
   - **Permissions:** Read and write
   - **Scope:** Select your `@regium` org / packages
3. Copy the token. **You will only see it once.**

### Step 3 — Add the token to GitHub Secrets

In your GitHub repo:
- **Settings → Secrets and variables → Actions → New repository secret**
- **Name:** `NPM_TOKEN`
- **Value:** the token from Step 2

The release workflow (`.github/workflows/release.yml`) already reads this secret.

### Step 4 — Login locally (only needed for manual publish)

```bash
npm login
# Enter your username, password, and 2FA OTP
```

To verify:

```bash
npm whoami
```

---

## First release (automated, recommended)

The repo is wired for **Changesets** + **GitHub Actions**. Workflow:

1. **Push your code** to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: initial Regium implementation"
   git branch -M main
   git remote add origin https://github.com/<you>/regium.git
   git push -u origin main
   ```

2. The first push triggers `release.yml`. Because `.changeset/initial.md` already exists, the action will open a **"chore: release"** Pull Request that bumps versions and updates changelogs.

3. **Review and merge the release PR.** When it merges, the same workflow re-runs and **publishes every package to npm**.

4. Verify on npm:
   - https://www.npmjs.com/package/@regium/core
   - https://www.npmjs.com/package/@regium/country-in

---

## First release (manual, fallback)

If you'd rather publish from your laptop:

```bash
# 1. Install everything
pnpm install

# 2. Build all packages
pnpm build

# 3. Bump versions based on the existing changesets
pnpm changeset version

# 4. Commit the version bumps
git add .
git commit -m "chore: release"

# 5. Publish to npm
pnpm release
```

`pnpm release` runs `turbo run build && changeset publish`. It will publish every package whose `version` is newer than what's on npm.

---

## Subsequent releases

For every change after the first release:

```bash
# 1. Make your code changes on a feature branch.
git checkout -b feat/add-country-jp

# 2. Edit code...

# 3. Add a changeset describing the impact.
pnpm changeset
#   → pick affected packages
#   → pick severity (patch / minor / major)
#   → write a one-line summary

# 4. Commit + push + open PR.
git add .
git commit -m "feat: add Japan country pack"
git push -u origin feat/add-country-jp
```

Once your PR merges to `main`, the release workflow opens or updates the **Version PR**. Merging the Version PR triggers the actual npm publish.

---

## Verifying a published package

After a release, anyone can install:

```bash
npm install @regium/core @regium/country-in
# or
pnpm add @regium/core @regium/country-in
# or
yarn add @regium/core @regium/country-in
```

Smoke test:

```ts
import { createRegium } from "@regium/core";
import india from "@regium/country-in";

const regium = createRegium({ plugins: [india] });
console.log(regium.getCountryConfig("IN").name); // → "India"
```

---

## Troubleshooting

### "402 Payment Required" when publishing

The package name is already taken or your scope is set to private. Either:

- Add `"publishConfig": { "access": "public" }` to the package.json (already done in this repo), or
- Run `npm publish --access public` for a manual publish.

### "ENEEDAUTH" / "401 Unauthorized"

Your `NPM_TOKEN` is missing, expired, or scoped to the wrong org. Regenerate the token (Step 2) and re-add it as a GitHub secret (Step 3).

### "ERR_PNPM_FROZEN_LOCKFILE_WITH_OUTDATED_LOCKFILE"

Run `pnpm install` locally and commit the updated `pnpm-lock.yaml`.

### Publishing fails halfway through

Changesets publishes packages one at a time. If it stops mid-way, just re-run `pnpm release` — packages already published will be skipped.

### Provenance error

Make sure the workflow has `id-token: write` permission (already set in `release.yml`) and the runner is GitHub-hosted (not self-hosted).

---

## Optional: pin versions and add a CHANGELOG

After the first publish, every package will have a `CHANGELOG.md` auto-generated by Changesets. Commit those.

For LTS branches, create a `release/v1` branch from the tag and apply security patches there.

---

## Optional: 2FA on npm

Strongly recommended:

```bash
npm profile enable-2fa auth-and-writes
```

Then your CI token must be an **automation token** (not a publish token) so it can publish without interactive 2FA. The GitHub Actions workflow above is already compatible.

---

You're done. Push to `main`, merge the release PR, and your packages are live.
