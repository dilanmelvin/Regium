#!/usr/bin/env node
/**
 * Generates regium-data.json for the Experience Centre.
 * Reads from the built @regium/countries package and serializes
 * all country data + validator patterns into a static JSON file.
 */
import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../..");

// Import from built packages
const countriesPath = pathToFileURL(resolve(ROOT, "packages/data/dist/index.js")).href;
const validatorsPath = pathToFileURL(
  resolve(ROOT, "packages/regium/dist/validators/index.js"),
).href;

const { allCountries } = await import(countriesPath);
const validators = await import(validatorsPath);

// Collect validator patterns for client-side validation
const validatorMap = {};
const allValidators = [
  ...Object.values(validators).filter((v) => v && typeof v === "object" && v.id && v.validate),
];

for (const v of allValidators) {
  // Extract regex pattern if the validator has one
  if (v.kind === "regex" || v.kind === "checksum") {
    // We can't serialize functions, so we store the pattern string for regex validators
    validatorMap[v.id] = {
      id: v.id,
      description: v.description,
      jurisdiction: v.jurisdiction,
      kind: v.kind,
      // Try to extract pattern from the validator's source
      pattern: null,
      canonical: true,
    };
  }
}

// Known patterns (manually mapped since we can't serialize regex from functions)
const PATTERNS = {
  "in.pan": { pattern: "^[A-Z]{5}\\d{4}[A-Z]$", canonical: true },
  "in.tan": { pattern: "^[A-Z]{4}\\d{5}[A-Z]$", canonical: true },
  "in.gstin": { pattern: "^\\d{2}[A-Z]{5}\\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$", canonical: true },
  "in.aadhaar": { pattern: "^\\d{12}$", canonical: false },
  "in.ifsc": { pattern: "^[A-Z]{4}0[A-Z0-9]{6}$", canonical: true },
  "in.cin": { pattern: "^[LUF]\\d{5}[A-Z]{2}\\d{4}[A-Z]{3}\\d{6}$", canonical: true },
  "in.uan": { pattern: "^\\d{12}$", canonical: true },
  "us.ssn": {
    pattern: "^(?!000|666|9\\d{2})\\d{3}-?(?!00)\\d{2}-?(?!0000)\\d{4}$",
    canonical: false,
  },
  "us.ein": { pattern: "^\\d{2}-?\\d{7}$", canonical: false },
  "us.zip": { pattern: "^\\d{5}(-\\d{4})?$", canonical: false },
  "uk.nino": {
    pattern: "^(?!BG|GB|NK|KN|TN|NT|ZZ)[A-CEGHJ-PR-TW-Z][A-CEGHJ-NPR-TW-Z]\\d{6}[A-D]$",
    canonical: true,
  },
  "uk.utr": { pattern: "^\\d{10}$", canonical: true },
  "uk.sort-code": { pattern: "^\\d{2}-?\\d{2}-?\\d{2}$", canonical: false },
  "de.steuer-id": { pattern: "^\\d{11}$", canonical: false },
  "de.vat": { pattern: "^DE\\d{9}$", canonical: true },
  "de.plz": { pattern: "^\\d{5}$", canonical: false },
  "fr.tva": { pattern: "^FR[A-HJ-NP-Z0-9]{2}\\d{9}$", canonical: true },
  "fr.code-postal": { pattern: "^\\d{5}$", canonical: false },
  "sg.nric": { pattern: "^[STFGM]\\d{7}[A-Z]$", canonical: true },
  "sg.uen": {
    pattern: "^(\\d{8}[A-Z]|\\d{9}[A-Z]|[ST]\\d{2}[A-Z]{2}\\d{4}[A-Z]|R\\d{2}LP\\d{4}[A-Z])$",
    canonical: true,
  },
  "sg.postal": { pattern: "^\\d{6}$", canonical: false },
  "ae.emirates-id": { pattern: "^784-?\\d{4}-?\\d{7}-?\\d$", canonical: false },
  "ae.trn": { pattern: "^\\d{15}$", canonical: false },
  "br.cpf": { pattern: "^\\d{11}$", canonical: false },
  "br.cnpj": { pattern: "^\\d{14}$", canonical: false },
  "au.tfn": { pattern: "^\\d{8,9}$", canonical: false },
  "au.abn": { pattern: "^\\d{11}$", canonical: false },
  "au.bsb": { pattern: "^\\d{3}-?\\d{3}$", canonical: false },
  "ca.sin": { pattern: "^\\d{9}$", canonical: false },
  "ca.bn": { pattern: "^\\d{9}$", canonical: false },
  "ca.postal": {
    pattern: "^[ABCEGHJKLMNPRSTVXY]\\d[A-Z] ?\\d[A-Z]\\d$",
    canonical: false,
    flags: "i",
  },
  "global.iban": { pattern: "^[A-Z]{2}\\d{2}[A-Z0-9]{11,30}$", canonical: true },
  "global.swift": { pattern: "^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$", canonical: true },
  "global.phone-e164": { pattern: "^\\+[1-9]\\d{1,14}$", canonical: false },
  "global.email": {
    pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
    canonical: false,
  },
};

// Merge patterns into validator map
for (const [id, data] of Object.entries(PATTERNS)) {
  validatorMap[id] = { ...validatorMap[id], ...data, id };
}

// Build country data
const T1_CODES = new Set(["IN", "US", "GB", "DE", "FR", "SG", "AE", "BR", "AU", "CA"]);

const countries = allCountries.map((pack) => {
  const c = pack.country.data;
  return {
    iso2: c.iso2,
    iso3: c.iso3,
    isoNumeric: c.isoNumeric,
    name: c.name,
    officialName: c.officialName,
    phoneCode: c.phoneCode,
    currency: c.currency,
    timezones: c.timezones,
    officialLanguages: c.officialLanguages,
    payrollRegion: c.payrollRegion,
    legalSystem: c.legalSystem,
    weekStart: c.weekStart,
    dateFormat: c.dateFormat,
    primaryTaxAuthority: c.primaryTaxAuthority,
    tier: T1_CODES.has(c.iso2) ? "T1" : "T4",
    companyFields: pack.companyFields.data,
    employeeFields: pack.employeeFields.data,
    payrollRules: pack.payrollRules.data,
    taxRules: pack.taxRules.data,
    laborRules: pack.laborRules.data,
  };
});

const output = { countries, validators: validatorMap };
const outPath = resolve(__dirname, "public/regium-data.json");
writeFileSync(outPath, JSON.stringify(output, null, 0));

console.log(
  `✓ Generated regium-data.json (${countries.length} countries, ${Object.keys(validatorMap).length} validators)`,
);
console.log(`  Size: ${(Buffer.byteLength(JSON.stringify(output)) / 1024).toFixed(1)} KB`);
