#!/usr/bin/env node
/**
 * Regium publish helper.
 *
 * Reads NPM_TOKEN from the environment, writes a temporary user-level
 * .npmrc just for this run, calls `pnpm publish` for every public
 * package via Changesets, and removes the temporary .npmrc afterwards.
 *
 * The token is never written to a file that lives in the repo.
 *
 * Usage:
 *   $env:NPM_TOKEN = "npm_xxx..."        # PowerShell
 *   export NPM_TOKEN="npm_xxx..."         # bash / zsh
 *   pnpm publish:npm
 *
 * Optional flags:
 *   --dry-run     # do everything except the actual publish
 *   --tag latest  # npm dist-tag (default: latest)
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const TAG_INDEX = args.indexOf("--tag");
const TAG = TAG_INDEX >= 0 ? args[TAG_INDEX + 1] : "latest";

const token = process.env.NPM_TOKEN;
if (!token || !token.startsWith("npm_")) {
  console.error("✗ NPM_TOKEN environment variable is missing or invalid.");
  console.error("  Set it once for this session:");
  console.error('    PowerShell:  $env:NPM_TOKEN = "npm_xxx..."');
  console.error('    bash:        export NPM_TOKEN="npm_xxx..."');
  process.exit(1);
}

const npmrcPath = join(homedir(), ".npmrc");
const backupPath = `${npmrcPath}.regium-backup`;
let hadExisting = false;

// Back up any existing user-level .npmrc.
if (existsSync(npmrcPath)) {
  hadExisting = true;
  const existing = readFileSync(npmrcPath, "utf8");
  writeFileSync(backupPath, existing);
}

// Write the token-bearing .npmrc.
const npmrc = [
  `//registry.npmjs.org/:_authToken=${token}`,
  "registry=https://registry.npmjs.org/",
  "always-auth=true",
  "",
].join("\n");
writeFileSync(npmrcPath, npmrc, { mode: 0o600 });

console.log(`Authenticated for this run. Tag: ${TAG}${DRY_RUN ? " (dry-run)" : ""}`);

function cleanup() {
  try {
    if (hadExisting) {
      const backup = readFileSync(backupPath, "utf8");
      writeFileSync(npmrcPath, backup);
      unlinkSync(backupPath);
    } else if (existsSync(npmrcPath)) {
      unlinkSync(npmrcPath);
    }
    console.log("Token cleaned from ~/.npmrc.");
  } catch (e) {
    console.error("Could not clean ~/.npmrc:", e.message);
    console.error(`Manually edit or delete ${npmrcPath} to remove the token.`);
  }
}

process.on("exit", cleanup);
process.on("SIGINT", () => process.exit(130));
process.on("SIGTERM", () => process.exit(143));

function run(label, cmd, cmdArgs) {
  console.log(`\n▸ ${label}`);
  const isWin = process.platform === "win32";
  const result = isWin
    ? spawnSync(`${cmd} ${cmdArgs.map((a) => `"${a}"`).join(" ")}`, {
        stdio: "inherit",
        shell: true,
      })
    : spawnSync(cmd, cmdArgs, { stdio: "inherit" });
  if (result.status !== 0) {
    console.error(`✗ ${label} failed.`);
    process.exit(result.status ?? 1);
  }
}

try {
  // Verify identity.
  run("Verifying npm authentication", "npm", ["whoami"]);

  // Build everything before publishing.
  run("Building all packages", "pnpm", ["build"]);

  // Smoke test for safety.
  run("Running smoke test", "pnpm", ["smoke-test"]);

  if (DRY_RUN) {
    run("Publishing (dry-run)", "pnpm", [
      "-r",
      "--filter",
      "./packages/*",
      "publish",
      "--access",
      "public",
      "--tag",
      TAG,
      "--no-git-checks",
      "--dry-run",
    ]);
    console.log("\n✓ Dry-run complete. No packages were published.");
  } else {
    run("Publishing to npm", "pnpm", [
      "-r",
      "--filter",
      "./packages/*",
      "publish",
      "--access",
      "public",
      "--tag",
      TAG,
      "--no-git-checks",
    ]);
    console.log("\n✓ All packages published to npm.");
    console.log("  Verify: https://www.npmjs.com/package/@regium/core");
  }
} catch (e) {
  console.error("Publish failed:", e.message);
  process.exit(1);
}
