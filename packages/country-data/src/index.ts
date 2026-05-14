import type {
  BankingRules,
  CompanyFields,
  Country,
  CountryPack,
  EmployeeFields,
  Immigration,
  LaborRules,
  Localization,
  MetadataEnvelope,
  PayrollRules,
  TaxRules,
} from "@regium/types";
import { COUNTRIES, type CountryRow } from "./dataset.js";

const EFFECTIVE_FROM = "2025-01-01";
const PACK_VERSION = "0.1.0";

/** Currency decimals — best-effort defaults; full table can override. */
const ZERO_DECIMAL_CURRENCIES = new Set([
  "BIF",
  "CLP",
  "DJF",
  "GNF",
  "ISK",
  "JPY",
  "KMF",
  "KRW",
  "PYG",
  "RWF",
  "UGX",
  "VND",
  "VUV",
  "XAF",
  "XOF",
  "XPF",
]);

/** Symbol → currency code mapping for the most common world currencies. */
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CNY: "¥",
  INR: "₹",
  AUD: "A$",
  CAD: "C$",
  CHF: "Fr",
  BRL: "R$",
  MXN: "$",
  ZAR: "R",
  KRW: "₩",
  RUB: "₽",
  TRY: "₺",
  SGD: "S$",
  HKD: "HK$",
  NZD: "NZ$",
  SEK: "kr",
  NOK: "kr",
  DKK: "kr",
  PLN: "zł",
  THB: "฿",
  PHP: "₱",
  IDR: "Rp",
  MYR: "RM",
  VND: "₫",
  AED: "د.إ",
  SAR: "﷼",
  ILS: "₪",
  EGP: "E£",
  QAR: "﷼",
  KWD: "د.ك",
  BHD: ".د.ب",
  OMR: "﷼",
  JOD: "د.ا",
  PKR: "₨",
  BDT: "৳",
  LKR: "₨",
  NGN: "₦",
  KES: "KSh",
  GHS: "₵",
  UAH: "₴",
  HUF: "Ft",
  CZK: "Kč",
  RON: "lei",
  BGN: "лв",
  HRK: "kn",
  ISK: "kr",
};

function rowToEnvelopes(row: CountryRow): {
  country: MetadataEnvelope<Country>;
  companyFields: MetadataEnvelope<CompanyFields>;
  employeeFields: MetadataEnvelope<EmployeeFields>;
  payrollRules: MetadataEnvelope<PayrollRules>;
  taxRules: MetadataEnvelope<TaxRules>;
  laborRules: MetadataEnvelope<LaborRules>;
  bankingRules: MetadataEnvelope<BankingRules>;
  localization: MetadataEnvelope<Localization>;
  immigration: MetadataEnvelope<Immigration>;
} {
  const [
    iso2,
    iso3,
    isoNumeric,
    name,
    officialName,
    currencyCode,
    phoneCode,
    timezone,
    language,
    region,
    weekStart,
    dateFormat,
    taxAuthority,
  ] = row;

  const decimals = ZERO_DECIMAL_CURRENCIES.has(currencyCode) ? 0 : 2;
  const symbol = CURRENCY_SYMBOLS[currencyCode] ?? currencyCode;
  const isoLower = iso2.toLowerCase();

  const country: MetadataEnvelope<Country> = {
    id: `country.${isoLower}.v2025`,
    domain: "country",
    jurisdiction: iso2,
    version: PACK_VERSION,
    effectiveFrom: EFFECTIVE_FROM,
    data: {
      name,
      officialName,
      iso2,
      iso3,
      isoNumeric,
      phoneCode,
      currency: { code: currencyCode, symbol, decimals, name: currencyCode },
      timezones: [timezone],
      officialLanguages: [language],
      payrollRegion: region,
      legalSystem: "mixed",
      weekStart,
      dateFormat,
      numberFormat: { decimal: ".", thousands: "," },
      primaryTaxAuthority: taxAuthority,
    },
  };

  const companyFields: MetadataEnvelope<CompanyFields> = {
    id: `company-fields.${isoLower}.v2025`,
    domain: "company",
    jurisdiction: iso2,
    version: PACK_VERSION,
    effectiveFrom: EFFECTIVE_FROM,
    data: [
      {
        id: "TaxID",
        category: "tax-id",
        label: { en: "Corporate Tax Identification Number" },
        validatorIds: [],
        required: true,
        sensitivity: "internal",
        issuingAuthority: taxAuthority,
      },
      {
        id: "RegistrationNumber",
        category: "corporate",
        label: { en: "Company Registration Number" },
        validatorIds: [],
        required: true,
        sensitivity: "public",
      },
    ],
  };

  const employeeFields: MetadataEnvelope<EmployeeFields> = {
    id: `employee-fields.${isoLower}.v2025`,
    domain: "employee",
    jurisdiction: iso2,
    version: PACK_VERSION,
    effectiveFrom: EFFECTIVE_FROM,
    data: [
      {
        id: "NationalID",
        category: "national-id",
        label: { en: "National Identification Number" },
        validatorIds: [],
        required: true,
        sensitivity: "pii",
      },
      {
        id: "BankAccount",
        category: "banking",
        label: { en: "Bank Account Number" },
        validatorIds: [],
        required: true,
        sensitivity: "pii",
      },
    ],
  };

  const payrollRules: MetadataEnvelope<PayrollRules> = {
    id: `payroll-rules.${isoLower}.v2025`,
    domain: "payroll",
    jurisdiction: iso2,
    version: PACK_VERSION,
    effectiveFrom: EFFECTIVE_FROM,
    data: {
      frequencies: ["monthly"],
      defaultFrequency: "monthly",
      workingDaysPerMonth: 22,
      workingHoursPerDay: 8,
      currency: currencyCode,
      components: [
        {
          id: "BASE",
          name: { en: "Base Salary" },
          type: "earning",
          computation: "fixed",
          taxable: true,
          mandatory: true,
        },
      ],
      contributions: [],
    },
  };

  const taxRules: MetadataEnvelope<TaxRules> = {
    id: `tax-rules.${isoLower}.v2025`,
    domain: "tax",
    jurisdiction: iso2,
    version: PACK_VERSION,
    effectiveFrom: EFFECTIVE_FROM,
    data: {
      authority: taxAuthority,
      taxYearStart: "01-01",
      defaultRegimeId: "default",
      regimes: [
        {
          id: "default",
          name: { en: "Default regime" },
          currency: currencyCode,
          period: "annual",
          standardDeduction: 0,
          slabs: [{ from: 0, to: null, rate: 0 }],
        },
      ],
    },
  };

  const laborRules: MetadataEnvelope<LaborRules> = {
    id: `labor-rules.${isoLower}.v2025`,
    domain: "labor",
    jurisdiction: iso2,
    version: PACK_VERSION,
    effectiveFrom: EFFECTIVE_FROM,
    data: {
      standardWeeklyHours: 40,
      maxWeeklyHours: 48,
      maxDailyHours: 9,
      weeklyOffDays: weekStart === "SUN" ? 1 : weekStart === "SAT" ? 2 : 1,
      leavePolicies: [
        {
          type: "annual",
          name: { en: "Annual leave" },
          minDaysPerYear: 14,
          paid: true,
          eligibilityDays: 90,
        },
      ],
      termination: { minNoticeDays: 30, severanceMandatory: false },
    },
  };

  const bankingRules: MetadataEnvelope<BankingRules> = {
    id: `banking-rules.${isoLower}.v2025`,
    domain: "banking",
    jurisdiction: iso2,
    version: PACK_VERSION,
    effectiveFrom: EFFECTIVE_FROM,
    data: {
      primaryFormat: "branch-code",
      acceptedFormats: ["branch-code"],
      accountNumberLength: { min: 6, max: 20 },
      swiftRequired: true,
      currency: currencyCode,
    },
  };

  const localization: MetadataEnvelope<Localization> = {
    id: `localization.${isoLower}.v2025`,
    domain: "localization",
    jurisdiction: iso2,
    version: PACK_VERSION,
    effectiveFrom: EFFECTIVE_FROM,
    data: {
      defaultLocale: `${language}-${iso2}`,
      supportedLocales: [`${language}-${iso2}`],
      currencyPattern: "¤#,##0.00",
      dateFormats: { short: dateFormat, medium: dateFormat, long: dateFormat },
      timeFormats: { short: "HH:mm", long: "HH:mm:ss" },
      clock: "24h",
      addressFormat: { order: ["line1", "line2", "city", "postal", "country"] },
      nameOrder: "given-family",
      rtl: language === "ar" || language === "he" || language === "fa" || language === "ur",
    },
  };

  const immigration: MetadataEnvelope<Immigration> = {
    id: `immigration.${isoLower}.v2025`,
    domain: "immigration",
    jurisdiction: iso2,
    version: PACK_VERSION,
    effectiveFrom: EFFECTIVE_FROM,
    data: {
      visaCategories: [],
      workPermitCategories: [],
    },
  };

  return {
    country,
    companyFields,
    employeeFields,
    payrollRules,
    taxRules,
    laborRules,
    bankingRules,
    localization,
    immigration,
  };
}

/** Build a stub T4 CountryPack from a row. */
export function buildBasePack(row: CountryRow): CountryPack {
  const envelopes = rowToEnvelopes(row);
  return {
    packId: `@regium/country-data/${row[0].toLowerCase()}`,
    packVersion: PACK_VERSION,
    ...envelopes,
    validators: [],
  };
}

/** Every country and territory in the world as a base pack. */
export const allBaseCountries: CountryPack[] = COUNTRIES.map((row) => buildBasePack(row));

/** Lookup map, ISO2 → base pack. */
export const baseCountriesByISO: Record<string, CountryPack> = Object.fromEntries(
  allBaseCountries.map((p) => [p.country.jurisdiction, p]),
);

/** Re-export the raw dataset for callers who want the compact form. */
export { COUNTRIES } from "./dataset.js";
export type { CountryRow } from "./dataset.js";
