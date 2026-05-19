#!/usr/bin/env node
/**
 * Cleanup old v0.1.x Regium packages.
 *
 * For each old package:
 *   - If it was published within 72 hours: unpublish it (full removal)
 *   - Otherwise: deprecate it with a migration message
 *
 * Keeps: @regium/core, @regium/data, @regium/react (the new v1.0.0 packages)
 *
 * Usage:
 *   $env:NPM_TOKEN = "npm_xxx..."
 *   node scripts/cleanup-old-packages.mjs
 *
 * Optional flags:
 *   --dry-run   Show what would happen, don't actually do it
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const DRY_RUN = process.argv.includes("--dry-run");

// All packages from the old v0.1.x — 22 in total (excluding @regium/core which we keep)
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

const DEPRECATION_MSG_MAP = {
  "@regium/types":
    "Replaced by @regium/core/types in v1+. See https://github.com/dilanmelvin/Regium",
  "@regium/utils": "Replaced by @regium/core/utils in v1+.",
  "@regium/validators": "Replaced by @regium/core/validators in v1+.",
  "@regium/forms": "Replaced by @regium/core/forms in v1+.",
  "@regium/payroll": "Replaced by @regium/core/payroll in v1+.",
  "@regium/tax": "Replaced by @regium/core/tax in v1+.",
  "@regium/labor": "Replaced by @regium/core/labor in v1+.",
  "@regium/banking": "Replaced by @regium/core/banking in v1+.",
  "@regium/localization": "Replaced by @regium/core/localization in v1+.",
  "@regium/countries": "Replaced by @regium/data in v1+.",
  "@regium/country-data": "Merged into @regium/data in v1+.",
  "@regium/country-in": "Use @regium/data/in from @regium/data v1+.",
  "@regium/country-us": "Use @regium/data/us from @regium/data v1+.",
  "@regium/country-uk": "Use @regium/data/uk from @regium/data v1+.",
  "@regium/country-de": "Use @regium/data/de from @regium/data v1+.",
  "@regium/country-fr": "Use @regium/data/fr from @regium/data v1+.",
  "@regium/country-sg": "Use @regium/data/sg from @regium/data v1+.",
  "@regium/country-ae": "Use @regium/data/ae from @regium/data v1+.",
  "@regium/country-br": "Use @regium/data/br from @regium/data v1+.",
  "@regium/country-au": "Use @regium/data/au from @regium/data v1+.",
  "@regium/country-ca": "Use @regium/data/ca from @regium/data v1+.",
};

const token = process.env.NPM_TOKEN;
if (!token || !token.startsWith("npm_")) {
  console.error("✗ NPM_TOKEN environment variable is missing or invalid.");
  console.error('  Set it: $env:NPM_TOKEN = "npm_xxx..."');
  process.exit(1);
}

// Set up auth via temporary ~/.npmrc
const npmrcPath = join(homedir(), ".npmrc");
const backupPath = `${npmrcPath}.regium-cleanup-backup`;
let hadExisting = false;

if (existsSync(npmrcPath)) {
  hadExisting = true;
  writeFileSync(backupPath, readFileSync(npmrcPath, "utf8"));
}

writeFileSync(
  npmrcPath,
  [
    `//registry.npmjs.org/:_authToken=${token}`,
    "registry=https://registry.npmjs.org/",
    "always-auth=true",
    "",
  ].join("\n"),
  { mode: 0o600 },
);

function cleanup() {
  try {
    if (hadExisting) {
      writeFileSync(npmrcPath, readFileSync(backupPath, "utf8"));
      unlinkSync(backupPath);
    } else if (existsSync(npmrcPath)) {
      unlinkSync(npmrcPath);
    }
  } catch (e) {
    console.error("Could not clean ~/.npmrc:", e.message);
  }
}

process.on("exit", cleanup);
process.on("SIGINT", () => process.exit(130));

const isWin = process.platform === "win32";
function npm(args, opts = {}) {
  const cmd = isWin ? `npm ${args.map((a) => `"${a}"`).join(" ")}` : "npm";
  const result = isWin
    ? spawnSync(cmd, { stdio: opts.silent ? "pipe" : "inherit", shell: true })
    : spawnSync("npm", args, { stdio: opts.silent ? "pipe" : "inherit" });
  return result;
}

// First, verify auth before doing anything
process.stdout.write("Verifying npm auth ... ");
const whoami = npm(["whoami"], { silent: true });
if (whoami.status !== 0) {
  console.log("✗");
  console.error("\nNot authenticated. Token might be invalid or expired.");
  console.error("\nFix: Generate a new Classic Automation Token at:");
  console.error("  https://www.npmjs.com/settings/~/tokens");
  console.error("\nThen set it:");
  console.error('  $env:NPM_TOKEN = "npm_xxx..."');
  console.error("  pnpm cleanup:old\n");
  process.exit(1);
}
console.log("✓ as", whoami.stdout.toString().trim());

function getPublishTime(pkg) {
  const result = npm(["view", pkg, "time.0.1.0", "--json"], { silent: true });
  if (result.status !== 0) return null;
  try {
    return new Date(JSON.parse(result.stdout.toString()));
  } catch {
    return null;
  }
}

function within72h(date) {
  if (!date) return false;
  const now = Date.now();
  return now - date.getTime() < 72 * 60 * 60 * 1000;
}

console.log(`\nCleanup ${OLD_PACKAGES.length} old Regium packages${DRY_RUN ? " (DRY RUN)" : ""}\n`);

let unpublished = 0;
let deprecated = 0;
let failed = 0;

for (const pkg of OLD_PACKAGES) {
  process.stdout.write(`  ${pkg.padEnd(28)} `);
  const publishedAt = getPublishTime(pkg);
  const recent = within72h(publishedAt);

  if (recent) {
    process.stdout.write("recent → unpublish ... ");
    if (DRY_RUN) {
      console.log("(skipped, dry-run)");
    } else {
      const r = npm(["unpublish", `${pkg}@0.1.0`, "--force"], { silent: true });
      if (r.status === 0) {
        console.log("✓ unpublished");
        unpublished++;
      } else {
        console.log("✗ failed (will deprecate instead)");
        const d = npm(["deprecate", `${pkg}@*`, DEPRECATION_MSG_MAP[pkg]], { silent: true });
        if (d.status === 0) deprecated++;
        else failed++;
      }
    }
  } else {
    process.stdout.write("old → deprecate ... ");
    if (DRY_RUN) {
      console.log("(skipped, dry-run)");
    } else {
      // Try to deprecate each version individually (npm wildcards don't work)
      const versionsResult = npm(["view", pkg, "versions", "--json"], { silent: true });
      let versions = [];
      try {
        versions = JSON.parse(versionsResult.stdout.toString());
        if (!Array.isArray(versions)) versions = [versions];
      } catch {
        console.log("✗ could not list versions");
        failed++;
        continue;
      }

      let allOk = true;
      let lastError = "";
      for (const v of versions) {
        const r = npm(["deprecate", `${pkg}@${v}`, DEPRECATION_MSG_MAP[pkg]], { silent: true });
        if (r.status !== 0) {
          allOk = false;
          lastError = r.stderr
            .toString()
            .split("\n")
            .filter((l) => l.includes("npm error"))
            .slice(0, 2)
            .join(" ");
        }
      }

      if (allOk) {
        console.log(`✓ deprecated (${versions.length} version${versions.length > 1 ? "s" : ""})`);
        deprecated++;
      } else {
        console.log("✗ failed");
        if (lastError) console.log(`     ${lastError.trim()}`);
        failed++;
      }
    }
  }
}

console.log(`\nDone. Unpublished: ${unpublished}, Deprecated: ${deprecated}, Failed: ${failed}\n`);

if (failed > 0) {
  console.log("Some packages failed. Common causes:");
  console.log("  - Token doesn't have write access to @regium scope");
  console.log("  - Package was already deprecated");
  console.log("  - Network issue\n");
  process.exit(1);
}
