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
import { auValidators } from "@regium/validators";

const country: MetadataEnvelope<Country> = {
  id: "country.au.v2025",
  domain: "country",
  jurisdiction: "AU",
  version: "2025.07.0",
  effectiveFrom: "2025-07-01",
  source: [
    { title: "australia.gov.au", url: "https://www.australia.gov.au/", fetchedAt: "2025-07-01" },
  ],
  data: {
    name: "Australia",
    officialName: "Commonwealth of Australia",
    iso2: "AU",
    iso3: "AUS",
    isoNumeric: "036",
    phoneCode: "+61",
    currency: { code: "AUD", symbol: "A$", decimals: 2, name: "Australian Dollar" },
    timezones: ["Australia/Sydney", "Australia/Melbourne", "Australia/Perth", "Australia/Brisbane"],
    officialLanguages: ["en"],
    payrollRegion: "OCEANIA",
    legalSystem: "common-law",
    weekStart: "MON",
    dateFormat: "DD/MM/YYYY",
    numberFormat: { decimal: ".", thousands: "," },
    primaryTaxAuthority: "Australian Taxation Office (ATO)",
  },
};

const companyFields: MetadataEnvelope<CompanyFields> = {
  id: "company-fields.au.v2025",
  domain: "company",
  jurisdiction: "AU",
  version: "2025.07.0",
  effectiveFrom: "2025-07-01",
  source: [{ title: "ATO / ASIC", url: "https://www.ato.gov.au/", fetchedAt: "2025-07-01" }],
  data: [
    {
      id: "ABN",
      category: "tax-id",
      label: { en: "Australian Business Number" },
      validatorIds: ["au.abn"],
      required: true,
      unique: true,
      sensitivity: "public",
      example: "53004085616",
      mask: "99 999 999 999",
      issuingAuthority: "ATO",
    },
    {
      id: "ACN",
      category: "corporate",
      label: { en: "Australian Company Number" },
      validatorIds: [],
      required: false,
      unique: true,
      sensitivity: "public",
      issuingAuthority: "ASIC",
    },
    {
      id: "TFN_Employer",
      category: "tax-id",
      label: { en: "Withholding payer TFN" },
      validatorIds: ["au.tfn"],
      required: true,
      unique: true,
      sensitivity: "internal",
      issuingAuthority: "ATO",
    },
  ],
};

const employeeFields: MetadataEnvelope<EmployeeFields> = {
  id: "employee-fields.au.v2025",
  domain: "employee",
  jurisdiction: "AU",
  version: "2025.07.0",
  effectiveFrom: "2025-07-01",
  source: [{ title: "ATO", url: "https://www.ato.gov.au/", fetchedAt: "2025-07-01" }],
  data: [
    {
      id: "TFN",
      category: "tax-id",
      label: { en: "Tax File Number" },
      validatorIds: ["au.tfn"],
      required: true,
      unique: true,
      sensitivity: "pii",
      example: "123456782",
      issuingAuthority: "ATO",
    },
    {
      id: "Super",
      category: "pension",
      label: { en: "Superannuation Member Number" },
      validatorIds: [],
      required: true,
      sensitivity: "internal",
    },
    {
      id: "BSB",
      category: "banking",
      label: { en: "BSB Code" },
      validatorIds: ["au.bsb"],
      required: true,
      sensitivity: "internal",
      example: "012-002",
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
  id: "payroll-rules.au.v2025",
  domain: "payroll",
  jurisdiction: "AU",
  version: "2025.07.0",
  effectiveFrom: "2025-07-01",
  source: [
    { title: "Fair Work / ATO", url: "https://www.fairwork.gov.au/", fetchedAt: "2025-07-01" },
  ],
  data: {
    frequencies: ["weekly", "bi-weekly", "monthly"],
    defaultFrequency: "bi-weekly",
    workingDaysPerMonth: 21.67,
    workingHoursPerDay: 7.6,
    overtimeMandatory: true,
    overtimeMultiplier: 1.5,
    thirteenthMonth: false,
    currency: "AUD",
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
        id: "SUPER",
        name: { en: "Superannuation Guarantee" },
        payer: "employer",
        rate: 12,
        authority: "ATO",
      },
      {
        id: "MEDICARE",
        name: { en: "Medicare Levy" },
        payer: "employee",
        rate: 2,
        authority: "ATO",
      },
    ],
  },
};

const taxRules: MetadataEnvelope<TaxRules> = {
  id: "tax-rules.au.v2025",
  domain: "tax",
  jurisdiction: "AU",
  version: "2025.07.0",
  effectiveFrom: "2025-07-01",
  source: [
    {
      title: "ATO Individual income tax rates 2025–26",
      url: "https://www.ato.gov.au/rates/individual-income-tax-rates/",
      fetchedAt: "2025-07-01",
    },
  ],
  data: {
    authority: "Australian Taxation Office",
    taxYearStart: "07-01",
    defaultRegimeId: "resident",
    regimes: [
      {
        id: "resident",
        name: { en: "Resident 2025–26" },
        default: true,
        currency: "AUD",
        period: "annual",
        standardDeduction: 0,
        slabs: [
          { from: 0, to: 18200, rate: 0 },
          { from: 18200, to: 45000, rate: 16 },
          { from: 45000, to: 135000, rate: 30 },
          { from: 135000, to: 190000, rate: 37 },
          { from: 190000, to: null, rate: 45 },
        ],
      },
    ],
  },
};

const laborRules: MetadataEnvelope<LaborRules> = {
  id: "labor-rules.au.v2025",
  domain: "labor",
  jurisdiction: "AU",
  version: "2025.07.0",
  effectiveFrom: "2025-07-01",
  source: [
    { title: "Fair Work Act 2009", url: "https://www.fairwork.gov.au/", fetchedAt: "2025-07-01" },
  ],
  data: {
    standardWeeklyHours: 38,
    maxWeeklyHours: 48,
    maxDailyHours: 12,
    weeklyOffDays: 2,
    minimumWage: { amount: 24.1, period: "hour", currency: "AUD" },
    leavePolicies: [
      {
        type: "annual",
        name: { en: "Annual Leave" },
        minDaysPerYear: 20,
        paid: true,
        eligibilityDays: 0,
        carryForward: true,
      },
      {
        type: "sick",
        name: { en: "Personal/Carer's Leave" },
        minDaysPerYear: 10,
        paid: true,
        eligibilityDays: 0,
      },
      {
        type: "maternity",
        name: { en: "Parental Leave" },
        minDaysPerYear: 365,
        paid: true,
        eligibilityDays: 365,
      },
    ],
    termination: {
      minNoticeDays: 7,
      severanceMandatory: true,
      severanceMonthsPerYear: 0.25,
      maxProbationMonths: 6,
    },
    holidayAuthority: "Fair Work Commission",
    collectiveBargaining: true,
  },
};

const bankingRules: MetadataEnvelope<BankingRules> = {
  id: "banking-rules.au.v2025",
  domain: "banking",
  jurisdiction: "AU",
  version: "2025.07.0",
  effectiveFrom: "2025-07-01",
  source: [
    { title: "Reserve Bank of Australia", url: "https://www.rba.gov.au/", fetchedAt: "2025-07-01" },
  ],
  data: {
    primaryFormat: "bsb",
    acceptedFormats: ["bsb"],
    accountNumberLength: { min: 6, max: 10 },
    swiftRequired: true,
    realTimeScheme: "NPP / PayID",
    currency: "AUD",
    authority: "Reserve Bank of Australia",
  },
};

const localization: MetadataEnvelope<Localization> = {
  id: "localization.au.v2025",
  domain: "localization",
  jurisdiction: "AU",
  version: "2025.07.0",
  effectiveFrom: "2025-07-01",
  source: [],
  data: {
    defaultLocale: "en-AU",
    supportedLocales: ["en-AU"],
    currencyPattern: "¤#,##0.00",
    dateFormats: { short: "DD/MM/YY", medium: "DD MMM YYYY", long: "DD MMMM YYYY" },
    timeFormats: { short: "h:mm a", long: "h:mm:ss a" },
    clock: "12h",
    addressFormat: {
      order: ["line1", "line2", "city", "state", "postal", "country"],
      postalCodeRegex: "^\\d{4}$",
      postalCodeExample: "2000",
      stateRequired: true,
    },
    nameOrder: "given-family",
    rtl: false,
  },
};

const immigration: MetadataEnvelope<Immigration> = {
  id: "immigration.au.v2025",
  domain: "immigration",
  jurisdiction: "AU",
  version: "2025.07.0",
  effectiveFrom: "2025-07-01",
  source: [
    {
      title: "Department of Home Affairs",
      url: "https://immi.homeaffairs.gov.au/",
      fetchedAt: "2025-07-01",
    },
  ],
  data: {
    visaCategories: [
      {
        id: "482",
        name: { en: "Skills in Demand visa (subclass 482)" },
        workAllowed: true,
        dependentsAllowed: true,
        maxStayDays: 1460,
        issuingAuthority: "DHA",
      },
      {
        id: "186",
        name: { en: "Employer Nomination Scheme (subclass 186)" },
        workAllowed: true,
        dependentsAllowed: true,
        issuingAuthority: "DHA",
      },
      {
        id: "189",
        name: { en: "Skilled Independent visa (subclass 189)" },
        workAllowed: true,
        dependentsAllowed: true,
        issuingAuthority: "DHA",
      },
    ],
    workPermitCategories: [],
  },
};

const pack: CountryPack = {
  packId: "@regium/country-au",
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
  validators: auValidators,
};
export default pack;
