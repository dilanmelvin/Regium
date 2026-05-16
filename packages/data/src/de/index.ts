import type { CountryPack, MetadataEnvelope } from "regium";
import type {
  BankingRules,
  CompanyFields,
  Country,
  EmployeeFields,
  Immigration,
  LaborRules,
  Localization,
  PayrollRules,
  TaxRules,
} from "regium";
import { deValidators } from "regium";

const country: MetadataEnvelope<Country> = {
  id: "country.de.v2025",
  domain: "country",
  jurisdiction: "DE",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [
    { title: "Bundesregierung", url: "https://www.bundesregierung.de/", fetchedAt: "2025-01-01" },
  ],
  data: {
    name: "Germany",
    officialName: "Federal Republic of Germany",
    iso2: "DE",
    iso3: "DEU",
    isoNumeric: "276",
    phoneCode: "+49",
    currency: { code: "EUR", symbol: "€", decimals: 2, name: "Euro" },
    timezones: ["Europe/Berlin"],
    officialLanguages: ["de"],
    payrollRegion: "EMEA",
    legalSystem: "civil-law",
    weekStart: "MON",
    dateFormat: "DD.MM.YYYY",
    numberFormat: { decimal: ",", thousands: "." },
    primaryTaxAuthority: "Bundeszentralamt für Steuern (BZSt)",
  },
};

const companyFields: MetadataEnvelope<CompanyFields> = {
  id: "company-fields.de.v2025",
  domain: "company",
  jurisdiction: "DE",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [{ title: "BZSt", url: "https://www.bzst.de/", fetchedAt: "2025-01-01" }],
  data: [
    {
      id: "Handelsregister",
      category: "corporate",
      label: { de: "Handelsregisternummer", en: "Commercial Register Number" },
      validatorIds: [],
      required: true,
      unique: true,
      sensitivity: "public",
      issuingAuthority: "Amtsgericht",
    },
    {
      id: "USt-IdNr",
      category: "vat-gst",
      label: { de: "Umsatzsteuer-Identifikationsnummer", en: "VAT ID" },
      validatorIds: ["de.vat"],
      required: false,
      unique: true,
      sensitivity: "public",
      example: "DE123456789",
      issuingAuthority: "BZSt",
    },
    {
      id: "Steuernummer",
      category: "tax-id",
      label: { de: "Steuernummer", en: "Tax Number" },
      validatorIds: [],
      required: true,
      sensitivity: "internal",
      issuingAuthority: "Finanzamt",
    },
    {
      id: "Betriebsnummer",
      category: "registration",
      label: { de: "Betriebsnummer", en: "Establishment Number" },
      validatorIds: [],
      required: true,
      sensitivity: "internal",
      issuingAuthority: "Bundesagentur für Arbeit",
    },
  ],
};

const employeeFields: MetadataEnvelope<EmployeeFields> = {
  id: "employee-fields.de.v2025",
  domain: "employee",
  jurisdiction: "DE",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [{ title: "BZSt", url: "https://www.bzst.de/", fetchedAt: "2025-01-01" }],
  data: [
    {
      id: "Steuer-ID",
      category: "tax-id",
      label: { de: "Steuer-Identifikationsnummer", en: "Tax ID" },
      validatorIds: ["de.steuer-id"],
      required: true,
      unique: true,
      sensitivity: "pii",
      example: "12345678901",
      issuingAuthority: "BZSt",
    },
    {
      id: "SV-Nummer",
      category: "social-security",
      label: { de: "Sozialversicherungsnummer", en: "Social Security Number" },
      validatorIds: [],
      required: true,
      unique: true,
      sensitivity: "pii",
      issuingAuthority: "DRV",
    },
    {
      id: "PLZ",
      category: "other",
      label: { de: "Postleitzahl", en: "Postal Code" },
      validatorIds: ["de.plz"],
      required: true,
      sensitivity: "internal",
      example: "10115",
    },
    {
      id: "IBAN",
      category: "banking",
      label: { en: "IBAN" },
      validatorIds: ["global.iban"],
      required: true,
      sensitivity: "pii",
      example: "DE89 3704 0044 0532 0130 00",
    },
  ],
};

const payrollRules: MetadataEnvelope<PayrollRules> = {
  id: "payroll-rules.de.v2025",
  domain: "payroll",
  jurisdiction: "DE",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [
    {
      title: "Lohnsteuerrichtlinien 2025",
      url: "https://www.bmf-steuerrechner.de/",
      fetchedAt: "2025-01-01",
    },
  ],
  data: {
    frequencies: ["monthly"],
    defaultFrequency: "monthly",
    workingDaysPerMonth: 21.67,
    workingHoursPerDay: 8,
    overtimeMandatory: false,
    thirteenthMonth: true,
    currency: "EUR",
    components: [
      {
        id: "BASE",
        name: { de: "Grundgehalt", en: "Base Salary" },
        type: "earning",
        computation: "fixed",
        taxable: true,
        mandatory: true,
      },
      {
        id: "13TH",
        name: { de: "13. Gehalt", en: "13th Month" },
        type: "bonus",
        computation: "fixed",
        taxable: true,
        mandatory: false,
      },
    ],
    contributions: [
      {
        id: "RV",
        name: { de: "Rentenversicherung" },
        payer: "both",
        rate: 9.3,
        ceiling: 90600,
        authority: "DRV",
      },
      {
        id: "AV",
        name: { de: "Arbeitslosenversicherung" },
        payer: "both",
        rate: 1.3,
        ceiling: 90600,
        authority: "BA",
      },
      {
        id: "KV",
        name: { de: "Krankenversicherung" },
        payer: "both",
        rate: 7.3,
        ceiling: 62100,
        authority: "GKV",
      },
      {
        id: "PV",
        name: { de: "Pflegeversicherung" },
        payer: "both",
        rate: 1.7,
        ceiling: 62100,
        authority: "GKV",
      },
    ],
  },
};

const taxRules: MetadataEnvelope<TaxRules> = {
  id: "tax-rules.de.v2025",
  domain: "tax",
  jurisdiction: "DE",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [
    {
      title: "Einkommensteuergesetz §32a",
      url: "https://www.gesetze-im-internet.de/estg/",
      fetchedAt: "2025-01-01",
    },
  ],
  data: {
    authority: "Bundeszentralamt für Steuern",
    taxYearStart: "01-01",
    cessRate: 5.5,
    defaultRegimeId: "single",
    regimes: [
      {
        id: "single",
        name: { de: "Grundtarif", en: "Single Tariff" },
        default: true,
        currency: "EUR",
        period: "annual",
        standardDeduction: 11784,
        slabs: [
          { from: 0, to: 11784, rate: 0 },
          { from: 11784, to: 17005, rate: 14 },
          { from: 17005, to: 66760, rate: 24 },
          { from: 66760, to: 277825, rate: 42 },
          { from: 277825, to: null, rate: 45 },
        ],
      },
    ],
  },
};

const laborRules: MetadataEnvelope<LaborRules> = {
  id: "labor-rules.de.v2025",
  domain: "labor",
  jurisdiction: "DE",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [
    {
      title: "Arbeitszeitgesetz",
      url: "https://www.gesetze-im-internet.de/arbzg/",
      fetchedAt: "2025-01-01",
    },
  ],
  data: {
    standardWeeklyHours: 40,
    maxWeeklyHours: 48,
    maxDailyHours: 10,
    weeklyOffDays: 2,
    minimumWage: { amount: 12.82, period: "hour", currency: "EUR" },
    leavePolicies: [
      {
        type: "annual",
        name: { de: "Erholungsurlaub" },
        minDaysPerYear: 24,
        paid: true,
        eligibilityDays: 180,
        carryForward: true,
        maxCarryForward: 12,
      },
      {
        type: "sick",
        name: { de: "Krankheitstage" },
        minDaysPerYear: 42,
        paid: true,
        eligibilityDays: 0,
      },
      {
        type: "maternity",
        name: { de: "Mutterschutz" },
        minDaysPerYear: 98,
        paid: true,
        eligibilityDays: 0,
      },
      {
        type: "parental",
        name: { de: "Elternzeit" },
        minDaysPerYear: 1095,
        paid: false,
        eligibilityDays: 0,
      },
    ],
    termination: { minNoticeDays: 28, severanceMandatory: false, maxProbationMonths: 6 },
    holidayAuthority: "Bundesländer",
    collectiveBargaining: true,
  },
};

const bankingRules: MetadataEnvelope<BankingRules> = {
  id: "banking-rules.de.v2025",
  domain: "banking",
  jurisdiction: "DE",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [
    { title: "Deutsche Bundesbank", url: "https://www.bundesbank.de/", fetchedAt: "2025-01-01" },
  ],
  data: {
    primaryFormat: "iban",
    acceptedFormats: ["iban", "blz"],
    accountNumberLength: { min: 10, max: 10 },
    iban: { length: 22, countryPrefix: "DE", example: "DE89 3704 0044 0532 0130 00" },
    swiftRequired: true,
    realTimeScheme: "SEPA Instant",
    currency: "EUR",
    authority: "Deutsche Bundesbank",
  },
};

const localization: MetadataEnvelope<Localization> = {
  id: "localization.de.v2025",
  domain: "localization",
  jurisdiction: "DE",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [],
  data: {
    defaultLocale: "de-DE",
    supportedLocales: ["de-DE", "en-DE"],
    currencyPattern: "#,##0.00 ¤",
    dateFormats: { short: "DD.MM.YY", medium: "DD.MM.YYYY", long: "DD. MMMM YYYY" },
    timeFormats: { short: "HH:mm", long: "HH:mm:ss" },
    clock: "24h",
    addressFormat: {
      order: ["line1", "line2", "postal", "city", "country"],
      postalCodeRegex: "^\\d{5}$",
      postalCodeExample: "10115",
      stateRequired: false,
    },
    nameOrder: "given-family",
    rtl: false,
  },
};

const immigration: MetadataEnvelope<Immigration> = {
  id: "immigration.de.v2025",
  domain: "immigration",
  jurisdiction: "DE",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [{ title: "BAMF", url: "https://www.bamf.de/", fetchedAt: "2025-01-01" }],
  data: {
    visaCategories: [
      {
        id: "Blue-Card",
        name: { de: "Blaue Karte EU" },
        workAllowed: true,
        dependentsAllowed: true,
        maxStayDays: 1460,
        issuingAuthority: "Auswärtiges Amt",
      },
      {
        id: "Skilled-Worker",
        name: { de: "Aufenthaltserlaubnis für Fachkräfte" },
        workAllowed: true,
        dependentsAllowed: true,
        issuingAuthority: "Ausländerbehörde",
      },
    ],
    workPermitCategories: [],
  },
};

const pack: CountryPack = {
  packId: "@regium/country-de",
  packVersion: "0.1.0",
  country,
  companyFields,
  employeeFields,
  payrollRules,
  taxRules,
  laborRules,
  bankingRules,
  localization,
  immigration,
  validators: deValidators,
};
export default pack;
