import type {
  BankingRules,
  CompanyFields,
  Country,
  CountryPack,
  EmployeeFields,
  Immigration,
  LaborRules,
  Localization,
  PayrollRules,
  RegiumPlugin,
  TaxRules,
  ValidationResult,
  Validator,
} from "@regium/types";
import { isActiveOn } from "@regium/types";
import { toISODate } from "@regium/utils";
import { CountryNotFoundError, FieldNotFoundError, ValidatorNotFoundError } from "./errors.js";
import { Registry } from "./registry.js";

export interface RegiumOptions {
  /** Plugins (typically country packs) to load. */
  plugins?: (RegiumPlugin | CountryPack)[];
  /** Effective date used for time-travel resolution. Defaults to today. */
  effectiveDate?: Date | string;
  /** Default locale for localized lookups. */
  locale?: string;
}

export interface ValidateRequest {
  country: string;
  field: string;
  value: string;
  context?: Record<string, unknown>;
}

export interface Regium {
  /** Get the country envelope payload (the `Country` data). */
  getCountryConfig(iso: string): Country;
  /** Get the company-side compliance fields for a country. */
  getCompanyFields(iso: string): CompanyFields;
  /** Get the employee-side compliance fields for a country. */
  getEmployeeFields(iso: string): EmployeeFields;
  /** Get payroll rules for a country. */
  getPayrollRules(iso: string): PayrollRules;
  /** Get tax rules for a country. */
  getTaxRules(iso: string): TaxRules;
  /** Get labor rules for a country. */
  getLaborRules(iso: string): LaborRules;
  /** Get banking rules for a country. */
  getBankingRules(iso: string): BankingRules;
  /** Get localization config for a country. */
  getLocalization(iso: string): Localization;
  /** Get immigration metadata for a country. */
  getImmigration(iso: string): Immigration;
  /** List all loaded country ISO2 codes. */
  listCountries(): string[];
  /** Validate a single field value. */
  validate(req: ValidateRequest): ValidationResult;
  /** Get a validator by id. */
  getValidator(id: string): Validator;
  /** Get the registered country pack. */
  getCountryPack(iso: string): CountryPack;
  /** Build a flat list of all compliance fields for a country (company + employee). */
  getAllFields(iso: string): {
    companyFields: CompanyFields;
    employeeFields: EmployeeFields;
  };
}

/** Type guard distinguishing a CountryPack from a RegiumPlugin. */
function isCountryPack(input: RegiumPlugin | CountryPack): input is CountryPack {
  return (
    (input as CountryPack).country !== undefined && (input as CountryPack).packId !== undefined
  );
}

function packToPlugin(pack: CountryPack): RegiumPlugin {
  return {
    name: pack.packId,
    version: pack.packVersion,
    setup(host) {
      host.registerCountryPack(pack);
    },
  };
}

/**
 * Create a Regium instance with a frozen registry. This is the main entry point
 * for consumers.
 */
export function createRegium(options: RegiumOptions = {}): Regium {
  const registry = new Registry();
  const effectiveDate = options.effectiveDate
    ? toISODate(options.effectiveDate)
    : toISODate(new Date());
  // Load plugins synchronously (most country packs are sync).
  for (const input of options.plugins ?? []) {
    const plugin = isCountryPack(input) ? packToPlugin(input) : input;
    const result = plugin.setup(registry);
    if (result instanceof Promise) {
      throw new Error(`Plugin ${plugin.name} requires async setup; use createRegiumAsync instead.`);
    }
  }
  registry.freeze();

  function pack(iso: string): CountryPack {
    const found = registry.getCountryPack(iso);
    if (!found) throw new CountryNotFoundError(iso);
    return found;
  }

  return {
    getCountryConfig(iso) {
      const env = pack(iso).country;
      if (!isActiveOn(env, effectiveDate)) {
        throw new Error(`Country metadata for ${iso} is not active on ${effectiveDate}`);
      }
      return env.data;
    },
    getCompanyFields(iso) {
      return pack(iso).companyFields.data;
    },
    getEmployeeFields(iso) {
      return pack(iso).employeeFields.data;
    },
    getPayrollRules(iso) {
      return pack(iso).payrollRules.data;
    },
    getTaxRules(iso) {
      return pack(iso).taxRules.data;
    },
    getLaborRules(iso) {
      return pack(iso).laborRules.data;
    },
    getBankingRules(iso) {
      return pack(iso).bankingRules.data;
    },
    getLocalization(iso) {
      return pack(iso).localization.data;
    },
    getImmigration(iso) {
      return pack(iso).immigration.data;
    },
    listCountries() {
      return registry.listCountries();
    },
    getValidator(id) {
      const v = registry.getValidator(id);
      if (!v) throw new ValidatorNotFoundError(id);
      return v;
    },
    getCountryPack(iso) {
      return pack(iso);
    },
    getAllFields(iso) {
      const p = pack(iso);
      return {
        companyFields: p.companyFields.data,
        employeeFields: p.employeeFields.data,
      };
    },
    validate(req): ValidationResult {
      // Resolve the field
      const country = pack(req.country);
      const allFields = [...country.companyFields.data, ...country.employeeFields.data];
      const field = allFields.find((f) => f.id === req.field);
      if (!field) {
        // Allow direct validator id (e.g. "global.iban").
        const direct = registry.getValidator(req.field);
        if (direct) return direct.validate(req.value, req.context);
        throw new FieldNotFoundError(req.country, req.field);
      }
      const validatorIds = field.validatorIds ?? [];
      if (validatorIds.length === 0) {
        return { ok: true, errors: [], normalized: req.value };
      }
      // Run all attached validators; aggregate errors.
      const errors = [];
      let normalized: string | undefined = req.value;
      for (const vid of validatorIds) {
        const v = registry.getValidator(vid);
        if (!v) {
          errors.push({
            code: "E_VALIDATOR_MISSING",
            message: `Validator "${vid}" not registered`,
          });
          continue;
        }
        const res = v.validate(req.value, req.context);
        if (!res.ok) errors.push(...res.errors);
        if (res.normalized) normalized = res.normalized;
      }
      return { ok: errors.length === 0, errors, normalized };
    },
  };
}
