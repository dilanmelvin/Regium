import type { BankingRules } from "./banking.js";
import type { CompanyFields, EmployeeFields, Immigration } from "./compliance.js";
import type { Country } from "./country.js";
import type { MetadataEnvelope } from "./envelope.js";
import type { LaborRules } from "./labor.js";
import type { Localization } from "./localization.js";
import type { PayrollRules } from "./payroll.js";
import type { TaxRules } from "./tax.js";
import type { Validator } from "./validation.js";

/**
 * A complete bundle of metadata for a single jurisdiction.
 * Each `@regium/country-<iso2>` package exports a `CountryPack` as default.
 */
export interface CountryPack {
  /** Unique pack identifier, e.g. "@regium/country-in". */
  packId: string;
  /** Pack version (semver). */
  packVersion: string;
  country: MetadataEnvelope<Country>;
  companyFields: MetadataEnvelope<CompanyFields>;
  employeeFields: MetadataEnvelope<EmployeeFields>;
  payrollRules: MetadataEnvelope<PayrollRules>;
  taxRules: MetadataEnvelope<TaxRules>;
  laborRules: MetadataEnvelope<LaborRules>;
  bankingRules: MetadataEnvelope<BankingRules>;
  localization: MetadataEnvelope<Localization>;
  immigration: MetadataEnvelope<Immigration>;
  /** Validators contributed by this country pack. */
  validators?: Validator[];
}

/**
 * The plugin host exposes registration APIs to plugins during setup.
 */
export interface PluginHost {
  registerCountryPack(pack: CountryPack): void;
  registerValidator(v: Validator): void;
  registerFormAdapter(a: unknown): void;
  registerPayrollProvider(p: unknown): void;
  registerTaxEngine(e: unknown): void;
  registerBankingProvider(b: unknown): void;
}

/**
 * A plugin extends Regium with country packs, validators, or providers.
 */
export interface RegiumPlugin {
  name: string;
  version: string;
  setup(host: PluginHost): void | Promise<void>;
}
