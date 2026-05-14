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
import { sgValidators } from "@regium/validators";

const country: MetadataEnvelope<Country> = {
  id: "country.sg.v2025",
  domain: "country",
  jurisdiction: "SG",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [{ title: "gov.sg", url: "https://www.gov.sg/", fetchedAt: "2025-01-01" }],
  data: {
    name: "Singapore",
    officialName: "Republic of Singapore",
    iso2: "SG",
    iso3: "SGP",
    isoNumeric: "702",
    phoneCode: "+65",
    currency: { code: "SGD", symbol: "S$", decimals: 2, name: "Singapore Dollar" },
    timezones: ["Asia/Singapore"],
    officialLanguages: ["en", "ms", "ta", "zh"],
    payrollRegion: "APAC",
    legalSystem: "common-law",
    weekStart: "MON",
    dateFormat: "DD/MM/YYYY",
    numberFormat: { decimal: ".", thousands: "," },
    primaryTaxAuthority: "Inland Revenue Authority of Singapore (IRAS)",
  },
};

const companyFields: MetadataEnvelope<CompanyFields> = {
  id: "company-fields.sg.v2025",
  domain: "company",
  jurisdiction: "SG",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [{ title: "ACRA", url: "https://www.acra.gov.sg/", fetchedAt: "2025-01-01" }],
  data: [
    {
      id: "UEN",
      category: "corporate",
      label: { en: "Unique Entity Number" },
      validatorIds: ["sg.uen"],
      required: true,
      unique: true,
      sensitivity: "public",
      example: "201912345A",
      issuingAuthority: "ACRA",
    },
    {
      id: "GST",
      category: "vat-gst",
      label: { en: "GST Registration Number" },
      validatorIds: [],
      required: false,
      unique: true,
      sensitivity: "public",
      issuingAuthority: "IRAS",
    },
    {
      id: "CPFEmployer",
      category: "registration",
      label: { en: "CPF Employer Account" },
      validatorIds: [],
      required: true,
      sensitivity: "internal",
      issuingAuthority: "CPF Board",
    },
  ],
};

const employeeFields: MetadataEnvelope<EmployeeFields> = {
  id: "employee-fields.sg.v2025",
  domain: "employee",
  jurisdiction: "SG",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [
    { title: "Singpass / IRAS", url: "https://www.singpass.gov.sg/", fetchedAt: "2025-01-01" },
  ],
  data: [
    {
      id: "NRIC",
      category: "national-id",
      label: { en: "NRIC / FIN" },
      validatorIds: ["sg.nric"],
      required: true,
      unique: true,
      sensitivity: "pii",
      example: "S1234567D",
      issuingAuthority: "ICA",
    },
    {
      id: "PostalCode",
      category: "other",
      label: { en: "Postal Code" },
      validatorIds: ["sg.postal"],
      required: true,
      sensitivity: "internal",
      example: "049145",
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
  id: "payroll-rules.sg.v2025",
  domain: "payroll",
  jurisdiction: "SG",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [{ title: "MOM / CPF Board", url: "https://www.mom.gov.sg/", fetchedAt: "2025-01-01" }],
  data: {
    frequencies: ["monthly"],
    defaultFrequency: "monthly",
    workingDaysPerMonth: 22,
    workingHoursPerDay: 8.5,
    overtimeMandatory: true,
    overtimeMultiplier: 1.5,
    thirteenthMonth: false,
    currency: "SGD",
    components: [
      {
        id: "BASE",
        name: { en: "Basic Salary" },
        type: "earning",
        computation: "fixed",
        taxable: true,
        mandatory: true,
      },
    ],
    contributions: [
      {
        id: "CPF_EE",
        name: { en: "CPF (Employee)" },
        payer: "employee",
        rate: 20,
        ceiling: 6800,
        authority: "CPF Board",
      },
      {
        id: "CPF_ER",
        name: { en: "CPF (Employer)" },
        payer: "employer",
        rate: 17,
        ceiling: 6800,
        authority: "CPF Board",
      },
      {
        id: "SDL",
        name: { en: "Skills Development Levy" },
        payer: "employer",
        rate: 0.25,
        ceiling: 4500,
        authority: "SkillsFuture SG",
      },
    ],
  },
};

const taxRules: MetadataEnvelope<TaxRules> = {
  id: "tax-rules.sg.v2025",
  domain: "tax",
  jurisdiction: "SG",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [
    { title: "IRAS YA 2025 rates", url: "https://www.iras.gov.sg/", fetchedAt: "2025-01-01" },
  ],
  data: {
    authority: "IRAS",
    taxYearStart: "01-01",
    defaultRegimeId: "resident",
    regimes: [
      {
        id: "resident",
        name: { en: "Resident YA 2025" },
        default: true,
        currency: "SGD",
        period: "annual",
        standardDeduction: 0,
        slabs: [
          { from: 0, to: 20000, rate: 0 },
          { from: 20000, to: 30000, rate: 2 },
          { from: 30000, to: 40000, rate: 3.5 },
          { from: 40000, to: 80000, rate: 7 },
          { from: 80000, to: 120000, rate: 11.5 },
          { from: 120000, to: 160000, rate: 15 },
          { from: 160000, to: 200000, rate: 18 },
          { from: 200000, to: 240000, rate: 19 },
          { from: 240000, to: 280000, rate: 19.5 },
          { from: 280000, to: 320000, rate: 20 },
          { from: 320000, to: 500000, rate: 22 },
          { from: 500000, to: 1000000, rate: 23 },
          { from: 1000000, to: null, rate: 24 },
        ],
      },
    ],
  },
};

const laborRules: MetadataEnvelope<LaborRules> = {
  id: "labor-rules.sg.v2025",
  domain: "labor",
  jurisdiction: "SG",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [
    { title: "Employment Act", url: "https://sso.agc.gov.sg/Act/EmA1968", fetchedAt: "2025-01-01" },
  ],
  data: {
    standardWeeklyHours: 44,
    maxWeeklyHours: 48,
    maxDailyHours: 12,
    weeklyOffDays: 1,
    leavePolicies: [
      {
        type: "annual",
        name: { en: "Annual Leave" },
        minDaysPerYear: 7,
        paid: true,
        eligibilityDays: 90,
      },
      {
        type: "sick",
        name: { en: "Outpatient Sick Leave" },
        minDaysPerYear: 14,
        paid: true,
        eligibilityDays: 90,
      },
      {
        type: "maternity",
        name: { en: "Maternity Leave" },
        minDaysPerYear: 112,
        paid: true,
        eligibilityDays: 90,
      },
      {
        type: "paternity",
        name: { en: "Paternity Leave" },
        minDaysPerYear: 28,
        paid: true,
        eligibilityDays: 90,
      },
    ],
    termination: { minNoticeDays: 1, severanceMandatory: false, maxProbationMonths: 6 },
    holidayAuthority: "MOM",
    collectiveBargaining: true,
  },
};

const bankingRules: MetadataEnvelope<BankingRules> = {
  id: "banking-rules.sg.v2025",
  domain: "banking",
  jurisdiction: "SG",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [{ title: "MAS", url: "https://www.mas.gov.sg/", fetchedAt: "2025-01-01" }],
  data: {
    primaryFormat: "branch-code",
    acceptedFormats: ["branch-code", "swift"],
    accountNumberLength: { min: 6, max: 17 },
    swiftRequired: true,
    realTimeScheme: "PayNow / FAST",
    currency: "SGD",
    authority: "Monetary Authority of Singapore",
  },
};

const localization: MetadataEnvelope<Localization> = {
  id: "localization.sg.v2025",
  domain: "localization",
  jurisdiction: "SG",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [],
  data: {
    defaultLocale: "en-SG",
    supportedLocales: ["en-SG", "zh-SG", "ms-SG", "ta-SG"],
    currencyPattern: "¤#,##0.00",
    dateFormats: { short: "DD/MM/YY", medium: "DD MMM YYYY", long: "DD MMMM YYYY" },
    timeFormats: { short: "h:mm a", long: "h:mm:ss a" },
    clock: "12h",
    addressFormat: {
      order: ["line1", "line2", "city", "postal", "country"],
      postalCodeRegex: "^\\d{6}$",
      postalCodeExample: "049145",
      stateRequired: false,
    },
    nameOrder: "given-family",
    rtl: false,
  },
};

const immigration: MetadataEnvelope<Immigration> = {
  id: "immigration.sg.v2025",
  domain: "immigration",
  jurisdiction: "SG",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [{ title: "MOM", url: "https://www.mom.gov.sg/", fetchedAt: "2025-01-01" }],
  data: {
    visaCategories: [
      {
        id: "EP",
        name: { en: "Employment Pass" },
        workAllowed: true,
        dependentsAllowed: true,
        maxStayDays: 730,
        issuingAuthority: "MOM",
      },
      {
        id: "S-Pass",
        name: { en: "S Pass" },
        workAllowed: true,
        dependentsAllowed: true,
        issuingAuthority: "MOM",
      },
      {
        id: "ONE-Pass",
        name: { en: "Overseas Networks & Expertise Pass" },
        workAllowed: true,
        dependentsAllowed: true,
        maxStayDays: 1825,
        issuingAuthority: "MOM",
      },
    ],
    workPermitCategories: [],
  },
};

const pack: CountryPack = {
  packId: "@regium/country-sg",
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
  validators: sgValidators,
};
export default pack;
