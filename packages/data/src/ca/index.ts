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
import { caValidators } from "regium";

const country: MetadataEnvelope<Country> = {
  id: "country.ca.v2025",
  domain: "country",
  jurisdiction: "CA",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [{ title: "Canada.ca", url: "https://www.canada.ca/", fetchedAt: "2025-01-01" }],
  data: {
    name: "Canada",
    officialName: "Canada",
    iso2: "CA",
    iso3: "CAN",
    isoNumeric: "124",
    phoneCode: "+1",
    currency: { code: "CAD", symbol: "C$", decimals: 2, name: "Canadian Dollar" },
    timezones: [
      "America/Toronto",
      "America/Vancouver",
      "America/Edmonton",
      "America/Halifax",
      "America/Winnipeg",
      "America/St_Johns",
    ],
    officialLanguages: ["en", "fr"],
    payrollRegion: "AMER",
    legalSystem: "mixed",
    weekStart: "SUN",
    dateFormat: "YYYY-MM-DD",
    numberFormat: { decimal: ".", thousands: "," },
    primaryTaxAuthority: "Canada Revenue Agency (CRA)",
    subdivisions: [
      { code: "ON", name: "Ontario", type: "province" },
      { code: "QC", name: "Quebec", type: "province" },
      { code: "BC", name: "British Columbia", type: "province" },
      { code: "AB", name: "Alberta", type: "province" },
    ],
  },
};

const companyFields: MetadataEnvelope<CompanyFields> = {
  id: "company-fields.ca.v2025",
  domain: "company",
  jurisdiction: "CA",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [
    { title: "CRA", url: "https://www.canada.ca/en/revenue-agency.html", fetchedAt: "2025-01-01" },
  ],
  data: [
    {
      id: "BN",
      category: "tax-id",
      label: { en: "Business Number", fr: "Numéro d'entreprise" },
      validatorIds: ["ca.bn"],
      required: true,
      unique: true,
      sensitivity: "internal",
      example: "123456789",
      issuingAuthority: "CRA",
    },
    {
      id: "GST_HST",
      category: "vat-gst",
      label: { en: "GST/HST Account" },
      validatorIds: [],
      required: false,
      sensitivity: "internal",
      issuingAuthority: "CRA",
    },
    {
      id: "PayrollAccount",
      category: "registration",
      label: { en: "Payroll Account (RP)" },
      validatorIds: [],
      required: true,
      sensitivity: "internal",
      issuingAuthority: "CRA",
    },
  ],
};

const employeeFields: MetadataEnvelope<EmployeeFields> = {
  id: "employee-fields.ca.v2025",
  domain: "employee",
  jurisdiction: "CA",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [
    {
      title: "Service Canada",
      url: "https://www.canada.ca/en/employment-social-development/services/sin.html",
      fetchedAt: "2025-01-01",
    },
  ],
  data: [
    {
      id: "SIN",
      category: "social-security",
      label: { en: "Social Insurance Number", fr: "Numéro d'assurance sociale" },
      validatorIds: ["ca.sin"],
      required: true,
      unique: true,
      sensitivity: "pii",
      example: "046454286",
      mask: "999-999-999",
      issuingAuthority: "Service Canada",
    },
    {
      id: "PostalCode",
      category: "other",
      label: { en: "Postal Code" },
      validatorIds: ["ca.postal"],
      required: true,
      sensitivity: "internal",
      example: "K1A 0B1",
    },
    {
      id: "Transit",
      category: "banking",
      label: { en: "Transit + Institution" },
      validatorIds: ["ca.transit"],
      required: true,
      sensitivity: "internal",
      example: "12345-001",
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
  id: "payroll-rules.ca.v2025",
  domain: "payroll",
  jurisdiction: "CA",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [
    {
      title: "CRA T4127 Payroll Deductions",
      url: "https://www.canada.ca/",
      fetchedAt: "2025-01-01",
    },
  ],
  data: {
    frequencies: ["weekly", "bi-weekly", "semi-monthly", "monthly"],
    defaultFrequency: "bi-weekly",
    workingDaysPerMonth: 21,
    workingHoursPerDay: 7.5,
    overtimeMandatory: true,
    overtimeMultiplier: 1.5,
    thirteenthMonth: false,
    currency: "CAD",
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
    contributions: [
      {
        id: "CPP",
        name: { en: "Canada Pension Plan" },
        payer: "both",
        rate: 5.95,
        ceiling: 71300,
        floor: 3500,
        authority: "CRA",
      },
      {
        id: "EI",
        name: { en: "Employment Insurance" },
        payer: "both",
        rate: 1.64,
        ceiling: 65700,
        authority: "Service Canada",
      },
    ],
  },
};

const taxRules: MetadataEnvelope<TaxRules> = {
  id: "tax-rules.ca.v2025",
  domain: "tax",
  jurisdiction: "CA",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [
    {
      title: "CRA Federal tax rates 2025",
      url: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/canadian-income-tax-rates-individuals-current-previous-years.html",
      fetchedAt: "2025-01-01",
    },
  ],
  data: {
    authority: "Canada Revenue Agency",
    taxYearStart: "01-01",
    defaultRegimeId: "federal",
    regimes: [
      {
        id: "federal",
        name: { en: "Federal 2025" },
        default: true,
        currency: "CAD",
        period: "annual",
        standardDeduction: 16129,
        slabs: [
          { from: 0, to: 57375, rate: 15 },
          { from: 57375, to: 114750, rate: 20.5 },
          { from: 114750, to: 177882, rate: 26 },
          { from: 177882, to: 253414, rate: 29 },
          { from: 253414, to: null, rate: 33 },
        ],
      },
    ],
  },
};

const laborRules: MetadataEnvelope<LaborRules> = {
  id: "labor-rules.ca.v2025",
  domain: "labor",
  jurisdiction: "CA",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [
    {
      title: "Canada Labour Code",
      url: "https://laws-lois.justice.gc.ca/eng/acts/L-2/",
      fetchedAt: "2025-01-01",
    },
  ],
  data: {
    standardWeeklyHours: 40,
    maxWeeklyHours: 48,
    maxDailyHours: 10,
    weeklyOffDays: 2,
    minimumWage: { amount: 17.3, period: "hour", currency: "CAD" },
    leavePolicies: [
      {
        type: "annual",
        name: { en: "Annual Vacation" },
        minDaysPerYear: 10,
        paid: true,
        eligibilityDays: 365,
      },
      {
        type: "sick",
        name: { en: "Personal Leave" },
        minDaysPerYear: 5,
        paid: true,
        eligibilityDays: 90,
      },
      {
        type: "maternity",
        name: { en: "Maternity Leave" },
        minDaysPerYear: 119,
        paid: false,
        eligibilityDays: 0,
      },
      {
        type: "parental",
        name: { en: "Parental Leave" },
        minDaysPerYear: 252,
        paid: false,
        eligibilityDays: 0,
      },
    ],
    termination: {
      minNoticeDays: 14,
      severanceMandatory: true,
      severanceMonthsPerYear: 0.25,
      maxProbationMonths: 3,
    },
    holidayAuthority: "Canada Labour Code",
    collectiveBargaining: true,
  },
};

const bankingRules: MetadataEnvelope<BankingRules> = {
  id: "banking-rules.ca.v2025",
  domain: "banking",
  jurisdiction: "CA",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [{ title: "Payments Canada", url: "https://www.payments.ca/", fetchedAt: "2025-01-01" }],
  data: {
    primaryFormat: "transit",
    acceptedFormats: ["transit"],
    accountNumberLength: { min: 7, max: 12 },
    swiftRequired: true,
    realTimeScheme: "Interac e-Transfer",
    currency: "CAD",
    authority: "Payments Canada",
  },
};

const localization: MetadataEnvelope<Localization> = {
  id: "localization.ca.v2025",
  domain: "localization",
  jurisdiction: "CA",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [],
  data: {
    defaultLocale: "en-CA",
    supportedLocales: ["en-CA", "fr-CA"],
    currencyPattern: "¤#,##0.00",
    dateFormats: { short: "YYYY-MM-DD", medium: "MMM DD, YYYY", long: "MMMM DD, YYYY" },
    timeFormats: { short: "h:mm a", long: "h:mm:ss a" },
    clock: "12h",
    addressFormat: {
      order: ["line1", "line2", "city", "state", "postal", "country"],
      postalCodeRegex: "^[A-Z]\\d[A-Z] ?\\d[A-Z]\\d$",
      postalCodeExample: "K1A 0B1",
      stateRequired: true,
    },
    nameOrder: "given-family",
    rtl: false,
  },
};

const immigration: MetadataEnvelope<Immigration> = {
  id: "immigration.ca.v2025",
  domain: "immigration",
  jurisdiction: "CA",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [
    {
      title: "IRCC",
      url: "https://www.canada.ca/en/immigration-refugees-citizenship.html",
      fetchedAt: "2025-01-01",
    },
  ],
  data: {
    visaCategories: [
      {
        id: "Express-Entry",
        name: { en: "Express Entry (PR)" },
        workAllowed: true,
        dependentsAllowed: true,
        issuingAuthority: "IRCC",
      },
      {
        id: "TFWP",
        name: { en: "Temporary Foreign Worker Program" },
        workAllowed: true,
        dependentsAllowed: true,
        maxStayDays: 730,
        issuingAuthority: "ESDC",
      },
      {
        id: "GTS",
        name: { en: "Global Talent Stream" },
        workAllowed: true,
        dependentsAllowed: true,
        issuingAuthority: "ESDC",
      },
    ],
    workPermitCategories: [],
  },
};

const pack: CountryPack = {
  packId: "@regium/country-ca",
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
  validators: caValidators,
};
export default pack;
