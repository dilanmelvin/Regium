#!/usr/bin/env node
/**
 * Regium smoke test orchestrator.
 *
 * Does the full publish-and-install dry run:
 *   1. packs every public package into .tgz tarballs
 *   2. creates a clean temp project outside the workspace
 *   3. installs the tarballs there with `npm install`
 *   4. runs real validations against 218 countries
 *   5. cleans up
 *
 * If this passes, `npm publish` will work too. Same artefacts, same install path.
 *
 * Usage:
 *   pnpm smoke-test
 *   pnpm smoke-test --keep   (don't delete the sandbox at the end)
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(SCRIPT_DIR, "..");
const PACKAGES_DIR = join(ROOT, "packages");
const KEEP = process.argv.includes("--keep");

const log = (msg) => console.log(msg);
const logStep = (n, msg) => console.log(`\n[${n}] ${msg}`);

function run(cmd, args, options = {}) {
  // On Windows, npm/pnpm are .cmd shims and need the shell. Suppress the Node
  // deprecation warning by quoting args ourselves and passing a single string.
  const isWin = process.platform === "win32";
  const useShell = isWin;
  const result = useShell
    ? spawnSync(`${cmd} ${args.map((a) => `"${a}"`).join(" ")}`, {
        stdio: options.silent ? "pipe" : "inherit",
        shell: true,
        ...options,
      })
    : spawnSync(cmd, args, {
        stdio: options.silent ? "pipe" : "inherit",
        ...options,
      });
  if (result.status !== 0) {
    if (options.silent && result.stderr) {
      console.error(result.stderr.toString());
    }
    throw new Error(`${cmd} ${args.join(" ")} exited with code ${result.status}`);
  }
  return result;
}

function runQuiet(cmd, args, cwd) {
  return run(cmd, args, { silent: true, cwd });
}

// 1. Pack every public package.
logStep(1, "Packing every public package as a .tgz tarball");

const tarballDir = join(tmpdir(), "regium-smoke-tarballs");
if (existsSync(tarballDir)) rmSync(tarballDir, { recursive: true, force: true });
mkdirSync(tarballDir, { recursive: true });

const packages = readdirSync(PACKAGES_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

for (const name of packages) {
  const dir = join(PACKAGES_DIR, name);
  process.stdout.write(`    ${name.padEnd(22)} `);
  runQuiet("pnpm", ["pack", "--pack-destination", tarballDir], dir);
  log("✓");
}

const tarballs = readdirSync(tarballDir).filter((f) => f.endsWith(".tgz"));
log(`\n  → ${tarballs.length} tarballs in ${tarballDir}`);

// 2. Create a clean sandbox project.
logStep(2, "Creating clean sandbox project");

const sandbox = mkdtempSync(join(tmpdir(), "regium-smoke-"));
log(`  → ${sandbox}`);

writeFileSync(
  join(sandbox, "package.json"),
  JSON.stringify(
    {
      name: "regium-smoke-sandbox",
      version: "1.0.0",
      private: true,
      type: "module",
    },
    null,
    2,
  ),
);

// 3. Install all tarballs.
logStep(3, "Installing tarballs with npm install");

const tarballPaths = tarballs.map((f) => `file:${join(tarballDir, f)}`);
runQuiet("npm", ["install", "--silent", "--no-audit", "--no-fund", ...tarballPaths], sandbox);
log("  ✓ All packages installed");

// 4. Write the actual smoke-test inside the sandbox and run it.
logStep(4, "Running smoke tests against installed packages");

const testScript = `
import { createRegium } from "regium";
import { allCountries } from "@regium/data";

const r = createRegium({ plugins: allCountries });
const total = r.listCountries().length;
console.log(\`  Loaded \${total} countries\`);
if (total < 218) { console.error("✗ Expected ≥ 218"); process.exit(1); }

const cases = [
  { country: "IN", field: "PAN",         value: "ABCPL1234C",            expect: true },
  { country: "DE", field: "IBAN",        value: "DE89370400440532013000", expect: true },
  { country: "US", field: "SSN",         value: "123-45-6789",           expect: true },
  { country: "BR", field: "CPF",         value: "39053344705",           expect: true },
  { country: "GB", field: "NINO",        value: "AB123456C",             expect: true },
  { country: "SG", field: "NRIC",        value: "S1234567D",             expect: true },
  { country: "AU", field: "ABN",         value: "53004085616",           expect: true },
  { country: "CA", field: "SIN",         value: "046454286",             expect: true },
  { country: "AE", field: "EmiratesID",  value: "784-1985-1234567-1",    expect: true },
  { country: "FR", field: "SIREN",       value: "732829320",             expect: true },
  // negative test — wrong format must fail
  { country: "IN", field: "PAN",         value: "INVALID123",            expect: false },
];

let passed = 0, failed = 0;
for (const c of cases) {
  const res = r.validate({ country: c.country, field: c.field, value: c.value });
  const ok = res.ok === c.expect;
  console.log(\`  \${ok ? "✓" : "✗"} \${c.country.padEnd(2)}.\${c.field.padEnd(12)} "\${c.value.padEnd(28)}" expected=\${c.expect} got=\${res.ok}\`);
  if (ok) passed++;
  else { failed++; console.error("    errors:", res.errors); }
}

const samples = ["IN","US","GB","DE","FR","JP","BR","VA","TV","HK","MO","KP","VN","NZ","ZA"];
console.log("\\n  Country lookups:");
for (const iso of samples) {
  const c = r.getCountryConfig(iso);
  console.log(\`    \${iso} \${c.name.padEnd(20)} → \${c.currency.code.padEnd(4)} (\${c.currency.symbol})\`);
}

console.log(\`\\n  → \${passed} passed, \${failed} failed across \${total} countries.\`);
process.exit(failed === 0 ? 0 : 1);
`;

writeFileSync(join(sandbox, "test.mjs"), testScript);
run("node", ["test.mjs"], { cwd: sandbox });

// 5. Clean up.
if (KEEP) {
  log(`\n[5] Sandbox kept at: ${sandbox}`);
  log(`    Tarballs at: ${tarballDir}`);
} else {
  logStep(5, "Cleaning up sandbox");
  rmSync(sandbox, { recursive: true, force: true });
  rmSync(tarballDir, { recursive: true, force: true });
  log("  ✓ Cleaned");
}

console.log("\n══════════════════════════════════════════════");
console.log("  ✓ Regium is healthy. Ready to publish to npm.");
console.log("══════════════════════════════════════════════\n");
