# Running Regium

How to run, develop, and verify the Regium monorepo on every operating system. Choose your platform below and follow the steps top-to-bottom.

---

## Prerequisites (any OS)

You need:

| Tool | Min version | Why |
| ---- | ----------- | --- |
| **Node.js** | 18.17+ (20 LTS or 22 recommended) | Runtime for tooling and the playground |
| **pnpm** | 9.x | Workspace package manager |
| **Git** | any recent | Source control |

> ✅ Tip: If you already have Node, run `node --version` and `pnpm --version` to confirm they're new enough. Skip to the [Run](#run) section if so.

---

## macOS

### Install Node.js and pnpm

The cleanest path is **Homebrew**:

```bash
# install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# install Node.js (LTS)
brew install node@20

# install pnpm globally via npm (ships with Node)
npm install -g pnpm@9
```

Or with **Volta** (recommended for Node version pinning):

```bash
curl https://get.volta.sh | bash
volta install node@20
volta install pnpm@9
```

Verify:

```bash
node --version       # v20.x
pnpm --version       # 9.x
```

---

## Linux (Ubuntu / Debian / Fedora / Arch)

### Install Node.js

The cleanest way on any Linux distro is **fnm** or **nvm**:

```bash
# fnm (fast, written in Rust)
curl -fsSL https://fnm.vercel.app/install | bash
exec $SHELL
fnm install 20
fnm use 20
```

Or **nvm**:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
exec $SHELL
nvm install 20
nvm use 20
```

Or your distro's package manager:

```bash
# Ubuntu / Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Fedora
sudo dnf install -y nodejs

# Arch
sudo pacman -S nodejs npm
```

### Install pnpm

```bash
npm install -g pnpm@9
# or, standalone (no Node required):
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

Verify:

```bash
node --version       # v20.x
pnpm --version       # 9.x
```

---

## Windows

You have two options. Pick **one**.

### Option A — Native Windows (PowerShell or cmd)

1. Install Node.js LTS from <https://nodejs.org/> (the MSI installer).
2. Open **PowerShell** (Start → "PowerShell"):
   ```powershell
   npm install -g pnpm@9
   node --version    # should print v20.x
   pnpm --version    # should print 9.x
   ```

If PowerShell blocks scripts, run once as Administrator:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

### Option B — Windows + WSL2 (recommended for parity with CI)

1. Open PowerShell as Administrator and run:
   ```powershell
   wsl --install -d Ubuntu
   ```
2. Reboot, launch Ubuntu, then follow the [Linux](#linux-ubuntu--debian--fedora--arch) steps inside WSL.

> 💡 WSL2 gives you a Linux-identical environment which mirrors what GitHub Actions uses — fewer surprises.

---

## Run

These commands work identically on all three operating systems.

### 1. Clone the repo

```bash
git clone https://github.com/<your-org>/regium.git
cd regium
```

### 2. Install dependencies

```bash
pnpm install
```

This installs everything across all 24 workspace packages (~5–20 seconds on a warm cache).

### 3. Build all packages

```bash
pnpm build
```

Turborepo will build the dependency graph in parallel. Expected result: **24 successful tasks**.

### 4. Open the playground

```bash
pnpm playground
```

This boots Vite at <http://localhost:5173>. Your default browser opens automatically.

You should see the Regium playground with:

- A **country dropdown** at the top
- **Overview**, **Validators**, **Form**, **Payroll** tabs
- All data updates the instant you change the country

---

## Useful commands

```bash
# Run all tests
pnpm test

# Type-check all packages
pnpm typecheck

# Lint with Biome (auto-format ESM/CJS files)
pnpm lint
pnpm lint:fix         # apply auto-fixes

# Build only one package
pnpm --filter @regium/core build
pnpm --filter "@regium/country-*" build    # all country packs

# Run only the playground in dev mode
pnpm --filter @regium/playground dev

# Clean every dist/ and node_modules
pnpm clean

# Add a changeset for the next release
pnpm changeset
```

---

## Verifying it actually works

After `pnpm build`, run a smoke-test in the Node REPL:

```bash
node
```

```js
> const { createRegium } = await import("./packages/core/dist/index.js");
> const india = (await import("./packages/country-india/dist/index.js")).default;
> const r = createRegium({ plugins: [india] });
> r.getCountryConfig("IN").currency
{ code: "INR", symbol: "₹", decimals: 2, name: "Indian Rupee" }
> r.validate({ country: "IN", field: "PAN", value: "ABCPL1234C" })
{ ok: true, errors: [], normalized: "ABCPL1234C" }
```

---

## Troubleshooting

### `pnpm: command not found`

You either skipped pnpm install, or your `PATH` doesn't include the global npm bin.

```bash
npm install -g pnpm@9
# verify the bin path:
npm config get prefix
# add that path/bin to your PATH if needed
```

On Windows, restart PowerShell after installing.

### `Error: Cannot find module '@regium/types'`

You forgot to build first. Run:

```bash
pnpm build
```

Workspace packages are linked symbolically, but consumers import from `dist/`, so the dist folders must exist.

### `EPERM: operation not permitted` on Windows

Antivirus or another process locked a file. Close any editors/terminals using `dist/` and retry, or run the terminal as Administrator.

### Playground shows a blank page

Check the terminal where `pnpm playground` is running — the most common cause is a stale build. Run:

```bash
pnpm clean
pnpm install
pnpm build
pnpm playground
```

### "Module not found: react" inside the playground

Reinstall, then build:

```bash
pnpm install
pnpm --filter @regium/react build
pnpm playground
```

### TypeScript shows red squiggles in the editor

Restart the TS server in your editor:

- **VS Code / Kiro:** `Ctrl/Cmd + Shift + P` → **TypeScript: Restart TS Server**
- **JetBrains:** **File → Invalidate Caches**

### Port 5173 already in use

```bash
# Set a different port
PORT=4000 pnpm playground               # macOS / Linux
$env:PORT=4000; pnpm playground         # PowerShell
set PORT=4000 && pnpm playground        # cmd
```

Or pass the flag through Vite:

```bash
pnpm --filter @regium/playground dev -- --port 4000
```

### `node-gyp` errors during install

Some transitive dependency wants to compile native code. Solutions:

- **macOS:** `xcode-select --install`
- **Windows:** install [windows-build-tools](https://github.com/felixrieseberg/windows-build-tools), or use WSL2
- **Linux:** `sudo apt-get install build-essential python3` (or your distro's equivalent)

---

## Editor setup (recommended)

### VS Code / Kiro

Install these extensions (you'll be prompted by `.vscode/extensions.json`):

- **Biome** (`biomejs.biome`) — formatting + linting
- **TypeScript Vue / React** support

Use the workspace TypeScript version: open any `.ts` file → bottom-right TS version → **Use Workspace Version**.

### JetBrains

Mark `node_modules` as excluded. Set the TypeScript version to "From package.json".

---

You're ready. If anything in this guide didn't work, open an issue with your OS, Node version, and the exact error.
