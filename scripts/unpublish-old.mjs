#!/usr/bin/env node
/**
 * Attempts to unpublish all old v0.1.x Regium packages.
 * npm permits unpublishing under specific conditions:
 *   - Within 72 hours of publish (always allowed)
 *   - After 72h: only if package has zero recent downloads + no dependents
 *
 * Usage:
 *   $env:NPM_TOKEN = "automation-token"
 *   pnpm unpublish:old
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const OLD_PACKAGES = [
  "@regium/types",
  "@regium/utils",
  "@regium/validators",
  "@regium/forms",
  "@regium/payroll",
  "@regium/tax",
  "@regium/labor",
  "@regium/banking",
  "@regium/localization",
  "@regium/countries",
  "@regium/country-data",
  "@regium/country-in",
  "@regium/country-us",
  "@regium/country-uk",
  "@regium/country-de",
  "@regium/country-fr",
  "@regium/country-sg",
  "@regium/country-ae",
  "@regium/country-br",
  "@regium/country-au",
  "@regium/country-ca",
];

const token = process.env.NPM_TOKEN;
if (!token || !token.startsWith("npm_")) {
  console.error("✗ Set NPM_TOKEN first: $env:NPM_TOKEN = \"npm_xxx...\"");
  process.exit(1);
}

const npmrcPath = join(homedir(), ".npmrc");
const backupPath = `${npmrcPath}.regium-unpublish-backup`;
let hadExisting = false;
if (existsSync(npmrcPath)) {
  hadExisting = true;
  writeFileSync(backupPath, readFileSync(npmrcPath, "utf8"));
}
writeFileSync(npmrcPath, [
  `//registry.npmjs.org/:_authToken=${token}`,
  "registry=https://registry.npmjs.org/",
  "always-auth=true",
  "",
].join("\n"), { mode: 0o600 });

function cleanup() {
  try {
    if (hadExisting) {
      writeFileSync(npmrcPath, readFileSync(backupPath, "utf8"));
      unlinkSync(backupPath);
    } else if (existsSync(npmrcPath)) {
      unlinkSync(npmrcPath);
    }
  } catch {}
}
process.on("exit", cleanup);
process.on("SIGINT", () => process.exit(130));

const isWin = process.platform === "win32";
function npm(args, opts = {}) {
  const cmd = isWin ? `npm ${args.map((a) => `"${a}"`).join(" ")}` : "npm";
  return isWin
    ? spawnSync(cmd, { stdio: opts.silent ? "pipe" : "inherit", shell: true })
    : spawnSync("npm", args, { stdio: opts.silent ? "pipe" : "inherit" });
}

console.log("\nAttempting to unpublish 21 old packages...\n");
console.log("Note: npm allows unpublishing only within 72h, OR if package has");
console.log("zero downloads + no dependents. Most will fail; that's expected.\n");

let unpublished = 0;
let failed = 0;

for (const pkg of OLD_PACKAGES) {
  process.stdout.write(`  ${pkg.padEnd(28)} `);
  // Unpublish entire package (all versions)
  const r = npm(["unpublish", pkg, "--force"], { silent: true });
  if (r.status === 0) {
    console.log("✓ unpublished");
    unpublished++;
  } else {
    const err = r.stderr.toString().split("\n").find((l) => l.includes("npm error"));
    const reason = err ? err.replace(/^npm error\s*/, "").substring(0, 80) : "unknown";
    console.log(`✗ ${reason}`);
    failed++;
  }
}

console.log(`\nDone. Unpublished: ${unpublished}, Failed: ${failed}`);
if (unpublished > 0) {
  console.log("Refresh https://www.npmjs.com/settings/regium/packages to see them gone.");
}
