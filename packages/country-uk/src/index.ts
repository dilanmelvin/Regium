import type { CountryPack, MetadataEnvelope } from "@regium/types";
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
} from "@regium/types";
import { ukValidators } from "@regium/validators";

const country: MetadataEnvelope<Country> = {
  id: "country.gb.v2025",
  domain: "country",
  jurisdiction: "GB",
  version: "2025.04.0",
  effectiveFrom: "2025-04-06",
  source: [{ title: "GOV.UK", url: "https://www.gov.uk/", fetchedAt: "2025-04-06" }],
  data: {
    name: "United Kingdom",
    officialName: "United Kingdom of Great Britain and Northern Ireland",
    iso2: "GB",
    iso3: "GBR",
    isoNumeric: "826",
    phoneCode: "+44",
    currency: { code: "GBP", symbol: "£", decimals: 2, name: "Pound Sterling" },
    timezones: ["Europe/London"],
    officialLanguages: ["en"],
    payrollRegion: "EMEA",
    legalSystem: "common-law",
    weekStart: "MON",
    dateFormat: "DD/MM/YYYY",
    numberFormat: { decimal: ".", thousands: "," },
    primaryTaxAuthority: "HM Revenue & Customs (HMRC)",
  },
};

const companyFields: MetadataEnvelope<CompanyFields> = {
  id: "company-fields.gb.v2025",
  domain: "company",
  jurisdiction: "GB",
  version: "2025.04.0",
  effectiveFrom: "2025-04-06",
  source: [
    {
      title: "Companies House / HMRC",
      url: "https://www.gov.uk/government/organisations/companies-house",
      fetchedAt: "2025-04-06",
    },
  ],
  data: [
    {
      id: "CompanyNumber",
      category: "corporate",
      label: { en: "Companies House Number" },
      validatorIds: [],
      required: true,
      unique: true,
      sensitivity: "public",
      example: "12345678",
      issuingAuthority: "Companies House",
    },
    {
      id: "UTR",
      category: "tax-id",
      label: { en: "Unique Taxpayer Reference" },
      validatorIds: ["uk.utr"],
      required: true,
      unique: true,
      sensitivity: "internal",
      example: "1234567890",
      issuingAuthority: "HMRC",
    },
    {
      id: "VAT",
      category: "vat-gst",
      label: { en: "VAT Number" },
      validatorIds: [],
      required: false,
      sensitivity: "public",
      example: "GB123456789",
      issuingAuthority: "HMRC",
    },
    {
      id: "PAYE",
      category: "registration",
      label: { en: "PAYE Reference" },
      validatorIds: [],
      required: true,
      sensitivity: "internal",
      issuingAuthority: "HMRC",
    },
  ],
};

const employeeFields: MetadataEnvelope<EmployeeFields> = {
  id: "employee-fields.gb.v2025",
  domain: "employee",
  jurisdiction: "GB",
  version: "2025.04.0",
  effectiveFrom: "2025-04-06",
  source: [
    {
      title: "HMRC",
      url: "https://www.gov.uk/government/organisations/hm-revenue-customs",
      fetchedAt: "2025-04-06",
    },
  ],
  data: [
    {
      id: "NINO",
      category: "national-id",
      label: { en: "National Insurance Number" },
      validatorIds: ["uk.nino"],
      required: true,
      unique: true,
      sensitivity: "pii",
      example: "QQ123456C",
      mask: "AA999999A",
      issuingAuthority: "HMRC",
    },
    {
      id: "Postcode",
      category: "other",
      label: { en: "Postcode" },
      validatorIds: ["uk.postcode"],
      required: true,
      sensitivity: "internal",
      example: "SW1A 1AA",
    },
    {
      id: "BankAccount",
      category: "banking",
      label: { en: "Bank Account Number" },
      validatorIds: [],
      required: true,
      sensitivity: "pii",
    },
    {
      id: "SortCode",
      category: "banking",
      label: { en: "Sort Code" },
      validatorIds: ["uk.sort-code"],
      required: true,
      sensitivity: "internal",
      example: "12-34-56",
    },
  ],
};

const payrollRules: MetadataEnvelope<PayrollRules> = {
  id: "payroll-rules.gb.v2025",
  domain: "payroll",
  jurisdiction: "GB",
  version: "2025.04.0",
  effectiveFrom: "2025-04-06",
  source: [
    {
      title: "HMRC PAYE Guide",
      url: "https://www.gov.uk/paye-for-employers",
      fetchedAt: "2025-04-06",
    },
  ],
  data: {
    frequencies: ["weekly", "monthly"],
    defaultFrequency: "monthly",
    workingDaysPerMonth: 21.67,
    workingHoursPerDay: 7.5,
    overtimeMandatory: false,
    thirteenthMonth: false,
    currency: "GBP",
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
        id: "NI_EE",
        name: { en: "Employee National Insurance" },
        payer: "employee",
        rate: 8,
        floor: 12570,
        ceiling: 50270,
        authority: "HMRC",
      },
      {
        id: "NI_ER",
        name: { en: "Employer National Insurance" },
        payer: "employer",
        rate: 15,
        floor: 5000,
        authority: "HMRC",
      },
      {
        id: "PENSION",
        name: { en: "Auto-enrolment Pension" },
        payer: "both",
        rate: 5,
        floor: 6240,
        ceiling: 50270,
        authority: "TPR",
      },
    ],
  },
};

const taxRules: MetadataEnvelope<TaxRules> = {
  id: "tax-rules.gb.v2025",
  domain: "tax",
  jurisdiction: "GB",
  version: "2025.04.0",
  effectiveFrom: "2025-04-06",
  source: [
    {
      title: "HMRC Income Tax Rates 2025/26",
      url: "https://www.gov.uk/income-tax-rates",
      fetchedAt: "2025-04-06",
    },
  ],
  data: {
    authority: "HM Revenue & Customs",
    taxYearStart: "04-06",
    defaultRegimeId: "england",
    regimes: [
      {
        id: "england",
        name: { en: "England, Wales & NI" },
        default: true,
        currency: "GBP",
        period: "annual",
        standardDeduction: 12570,
        slabs: [
          { from: 0, to: 37700, rate: 20 },
          { from: 37700, to: 125140, rate: 40 },
          { from: 125140, to: null, rate: 45 },
        ],
      },
      {
        id: "scotland",
        name: { en: "Scotland" },
        currency: "GBP",
        period: "annual",
        standardDeduction: 12570,
        slabs: [
          { from: 0, to: 2306, rate: 19 },
          { from: 2306, to: 13991, rate: 20 },
          { from: 13991, to: 31092, rate: 21 },
          { from: 31092, to: 62430, rate: 42 },
          { from: 62430, to: 125140, rate: 45 },
          { from: 125140, to: null, rate: 48 },
        ],
      },
    ],
  },
};

const laborRules: MetadataEnvelope<LaborRules> = {
  id: "labor-rules.gb.v2025",
  domain: "labor",
  jurisdiction: "GB",
  version: "2025.04.0",
  effectiveFrom: "2025-04-06",
  source: [
    {
      title: "Working Time Regulations 1998",
      url: "https://www.gov.uk/maximum-weekly-working-hours",
      fetchedAt: "2025-04-06",
    },
  ],
  data: {
    standardWeeklyHours: 37.5,
    maxWeeklyHours: 48,
    maxDailyHours: 13,
    weeklyOffDays: 2,
    minimumWage: { amount: 11.44, period: "hour", currency: "GBP" },
    leavePolicies: [
      {
        type: "annual",
        name: { en: "Statutory Annual Leave" },
        minDaysPerYear: 28,
        paid: true,
        eligibilityDays: 0,
      },
      {
        type: "sick",
        name: { en: "Statutory Sick Pay" },
        minDaysPerYear: 28,
        paid: true,
        eligibilityDays: 0,
      },
      {
        type: "maternity",
        name: { en: "Statutory Maternity Leave" },
        minDaysPerYear: 365,
        paid: true,
        eligibilityDays: 0,
      },
      {
        type: "paternity",
        name: { en: "Paternity Leave" },
        minDaysPerYear: 14,
        paid: true,
        eligibilityDays: 0,
      },
    ],
    termination: {
      minNoticeDays: 7,
      severanceMandatory: true,
      severanceMonthsPerYear: 0.5,
      maxProbationMonths: 6,
    },
    holidayAuthority: "GOV.UK",
    collectiveBargaining: true,
  },
};

const bankingRules: MetadataEnvelope<BankingRules> = {
  id: "banking-rules.gb.v2025",
  domain: "banking",
  jurisdiction: "GB",
  version: "2025.04.0",
  effectiveFrom: "2025-04-06",
  source: [
    { title: "Bank of England", url: "https://www.bankofengland.co.uk/", fetchedAt: "2025-04-06" },
  ],
  data: {
    primaryFormat: "sort-code",
    acceptedFormats: ["sort-code", "iban"],
    accountNumberLength: { min: 8, max: 8 },
    iban: { length: 22, countryPrefix: "GB", example: "GB29 NWBK 6016 1331 9268 19" },
    swiftRequired: true,
    realTimeScheme: "Faster Payments",
    currency: "GBP",
    authority: "Bank of England",
  },
};

const localization: MetadataEnvelope<Localization> = {
  id: "localization.gb.v2025",
  domain: "localization",
  jurisdiction: "GB",
  version: "2025.04.0",
  effectiveFrom: "2025-04-06",
  source: [],
  data: {
    defaultLocale: "en-GB",
    supportedLocales: ["en-GB", "cy-GB"],
    currencyPattern: "¤#,##0.00",
    dateFormats: { short: "DD/MM/YYYY", medium: "DD MMM YYYY", long: "DD MMMM YYYY" },
    timeFormats: { short: "HH:mm", long: "HH:mm:ss" },
    clock: "24h",
    addressFormat: {
      order: ["line1", "line2", "city", "postal", "country"],
      postalCodeRegex: "^[A-Z]{1,2}\\d[A-Z\\d]?\\s*\\d[A-Z]{2}$",
      postalCodeExample: "SW1A 1AA",
      stateRequired: false,
    },
    nameOrder: "given-family",
    rtl: false,
  },
};

const immigration: MetadataEnvelope<Immigration> = {
  id: "immigration.gb.v2025",
  domain: "immigration",
  jurisdiction: "GB",
  version: "2025.04.0",
  effectiveFrom: "2025-04-06",
  source: [
    {
      title: "UK Visas and Immigration",
      url: "https://www.gov.uk/government/organisations/uk-visas-and-immigration",
      fetchedAt: "2025-04-06",
    },
  ],
  data: {
    visaCategories: [
      {
        id: "Skilled-Worker",
        name: { en: "Skilled Worker visa" },
        workAllowed: true,
        dependentsAllowed: true,
        maxStayDays: 1825,
        issuingAuthority: "UKVI",
      },
      {
        id: "Global-Talent",
        name: { en: "Global Talent visa" },
        workAllowed: true,
        dependentsAllowed: true,
        maxStayDays: 1825,
        issuingAuthority: "UKVI",
      },
      {
        id: "Health-Care",
        name: { en: "Health and Care Worker visa" },
        workAllowed: true,
        dependentsAllowed: true,
        issuingAuthority: "UKVI",
      },
    ],
    workPermitCategories: [],
  },
};

const pack: CountryPack = {
  packId: "@regium/country-uk",
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
  validators: ukValidators,
};

export default pack;
