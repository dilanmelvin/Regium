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
import { usValidators } from "@regium/validators";

const country: MetadataEnvelope<Country> = {
  id: "country.us.v2025",
  domain: "country",
  jurisdiction: "US",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [
    { title: "U.S. Department of State", url: "https://www.state.gov/", fetchedAt: "2025-01-01" },
  ],
  data: {
    name: "United States",
    officialName: "United States of America",
    iso2: "US",
    iso3: "USA",
    isoNumeric: "840",
    phoneCode: "+1",
    currency: { code: "USD", symbol: "$", decimals: 2, name: "US Dollar" },
    timezones: ["America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles"],
    officialLanguages: ["en"],
    payrollRegion: "AMER",
    legalSystem: "common-law",
    weekStart: "SUN",
    dateFormat: "MM/DD/YYYY",
    numberFormat: { decimal: ".", thousands: "," },
    primaryTaxAuthority: "Internal Revenue Service (IRS)",
    subdivisions: [
      { code: "CA", name: "California", type: "state" },
      { code: "TX", name: "Texas", type: "state" },
      { code: "NY", name: "New York", type: "state" },
      { code: "FL", name: "Florida", type: "state" },
      { code: "WA", name: "Washington", type: "state" },
      { code: "IL", name: "Illinois", type: "state" },
    ],
  },
};

const companyFields: MetadataEnvelope<CompanyFields> = {
  id: "company-fields.us.v2025",
  domain: "company",
  jurisdiction: "US",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [{ title: "IRS", url: "https://www.irs.gov/", fetchedAt: "2025-01-01" }],
  data: [
    {
      id: "EIN",
      category: "tax-id",
      label: { en: "Employer Identification Number" },
      validatorIds: ["us.ein"],
      required: true,
      unique: true,
      sensitivity: "internal",
      example: "12-3456789",
      issuingAuthority: "IRS",
    },
    {
      id: "StateTaxID",
      category: "tax-id",
      label: { en: "State Tax ID" },
      validatorIds: [],
      required: false,
      sensitivity: "internal",
    },
    {
      id: "DUNS",
      category: "registration",
      label: { en: "DUNS Number" },
      validatorIds: [],
      required: false,
      sensitivity: "public",
    },
  ],
};

const employeeFields: MetadataEnvelope<EmployeeFields> = {
  id: "employee-fields.us.v2025",
  domain: "employee",
  jurisdiction: "US",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [{ title: "SSA / IRS", url: "https://www.ssa.gov/", fetchedAt: "2025-01-01" }],
  data: [
    {
      id: "SSN",
      category: "social-security",
      label: { en: "Social Security Number" },
      validatorIds: ["us.ssn"],
      required: true,
      unique: true,
      sensitivity: "pii",
      mask: "999-99-9999",
      example: "123-45-6789",
      issuingAuthority: "SSA",
    },
    {
      id: "ZIP",
      category: "other",
      label: { en: "ZIP Code" },
      validatorIds: ["us.zip"],
      required: true,
      sensitivity: "internal",
      example: "94105",
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
      id: "Routing",
      category: "banking",
      label: { en: "Routing Number" },
      validatorIds: ["us.aba-routing"],
      required: true,
      sensitivity: "internal",
      example: "021000021",
    },
  ],
};

const payrollRules: MetadataEnvelope<PayrollRules> = {
  id: "payroll-rules.us.v2025",
  domain: "payroll",
  jurisdiction: "US",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [
    { title: "Department of Labor / IRS", url: "https://www.dol.gov/", fetchedAt: "2025-01-01" },
  ],
  data: {
    frequencies: ["weekly", "bi-weekly", "semi-monthly", "monthly"],
    defaultFrequency: "bi-weekly",
    workingDaysPerMonth: 21,
    workingHoursPerDay: 8,
    overtimeMandatory: true,
    overtimeMultiplier: 1.5,
    thirteenthMonth: false,
    currency: "USD",
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
        id: "FICA_SS",
        name: { en: "Social Security" },
        payer: "both",
        rate: 6.2,
        ceiling: 168600,
        authority: "SSA",
      },
      { id: "FICA_MED", name: { en: "Medicare" }, payer: "both", rate: 1.45, authority: "CMS" },
      {
        id: "FUTA",
        name: { en: "Federal Unemployment" },
        payer: "employer",
        rate: 6,
        ceiling: 7000,
        authority: "IRS",
      },
    ],
  },
};

const taxRules: MetadataEnvelope<TaxRules> = {
  id: "tax-rules.us.v2025",
  domain: "tax",
  jurisdiction: "US",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [
    { title: "IRS Rev. Proc. 2024-40", url: "https://www.irs.gov/", fetchedAt: "2025-01-01" },
  ],
  data: {
    authority: "Internal Revenue Service",
    taxYearStart: "01-01",
    defaultRegimeId: "single",
    regimes: [
      {
        id: "single",
        name: { en: "Single (federal)" },
        default: true,
        currency: "USD",
        period: "annual",
        standardDeduction: 15000,
        slabs: [
          { from: 0, to: 11600, rate: 10 },
          { from: 11600, to: 47150, rate: 12 },
          { from: 47150, to: 100525, rate: 22 },
          { from: 100525, to: 191950, rate: 24 },
          { from: 191950, to: 243725, rate: 32 },
          { from: 243725, to: 609350, rate: 35 },
          { from: 609350, to: null, rate: 37 },
        ],
      },
      {
        id: "married-jointly",
        name: { en: "Married filing jointly" },
        currency: "USD",
        period: "annual",
        standardDeduction: 30000,
        slabs: [
          { from: 0, to: 23200, rate: 10 },
          { from: 23200, to: 94300, rate: 12 },
          { from: 94300, to: 201050, rate: 22 },
          { from: 201050, to: 383900, rate: 24 },
          { from: 383900, to: 487450, rate: 32 },
          { from: 487450, to: 731200, rate: 35 },
          { from: 731200, to: null, rate: 37 },
        ],
      },
    ],
  },
};

const laborRules: MetadataEnvelope<LaborRules> = {
  id: "labor-rules.us.v2025",
  domain: "labor",
  jurisdiction: "US",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [
    {
      title: "Fair Labor Standards Act (FLSA)",
      url: "https://www.dol.gov/",
      fetchedAt: "2025-01-01",
    },
  ],
  data: {
    standardWeeklyHours: 40,
    maxWeeklyHours: 60,
    maxDailyHours: 12,
    weeklyOffDays: 2,
    minimumWage: { amount: 7.25, period: "hour", currency: "USD" },
    leavePolicies: [
      {
        type: "annual",
        name: { en: "Vacation (employer-defined)" },
        minDaysPerYear: 0,
        paid: true,
        eligibilityDays: 0,
      },
      {
        type: "sick",
        name: { en: "Sick Leave (state-dependent)" },
        minDaysPerYear: 0,
        paid: true,
        eligibilityDays: 0,
      },
      {
        type: "maternity",
        name: { en: "FMLA (unpaid)" },
        minDaysPerYear: 84,
        paid: false,
        eligibilityDays: 365,
      },
    ],
    termination: { minNoticeDays: 0, severanceMandatory: false, maxProbationMonths: 6 },
    holidayAuthority: "Federal & state governments",
    collectiveBargaining: true,
  },
};

const bankingRules: MetadataEnvelope<BankingRules> = {
  id: "banking-rules.us.v2025",
  domain: "banking",
  jurisdiction: "US",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [
    {
      title: "Federal Reserve / ABA",
      url: "https://www.federalreserve.gov/",
      fetchedAt: "2025-01-01",
    },
  ],
  data: {
    primaryFormat: "routing-aba",
    acceptedFormats: ["routing-aba"],
    accountNumberLength: { min: 4, max: 17 },
    swiftRequired: true,
    realTimeScheme: "FedNow / RTP",
    currency: "USD",
    authority: "Federal Reserve",
  },
};

const localization: MetadataEnvelope<Localization> = {
  id: "localization.us.v2025",
  domain: "localization",
  jurisdiction: "US",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [],
  data: {
    defaultLocale: "en-US",
    supportedLocales: ["en-US", "es-US"],
    currencyPattern: "¤#,##0.00",
    dateFormats: { short: "MM/DD/YY", medium: "MMM DD, YYYY", long: "MMMM DD, YYYY" },
    timeFormats: { short: "h:mm a", long: "h:mm:ss a" },
    clock: "12h",
    addressFormat: {
      order: ["line1", "line2", "city", "state", "postal", "country"],
      postalCodeRegex: "^\\d{5}(-\\d{4})?$",
      postalCodeExample: "94105",
      stateRequired: true,
    },
    nameOrder: "given-family",
    rtl: false,
  },
};

const immigration: MetadataEnvelope<Immigration> = {
  id: "immigration.us.v2025",
  domain: "immigration",
  jurisdiction: "US",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [{ title: "USCIS", url: "https://www.uscis.gov/", fetchedAt: "2025-01-01" }],
  data: {
    visaCategories: [
      {
        id: "H-1B",
        name: { en: "H-1B Specialty Occupation" },
        workAllowed: true,
        dependentsAllowed: true,
        maxStayDays: 2190,
        issuingAuthority: "USCIS",
      },
      {
        id: "L-1",
        name: { en: "L-1 Intracompany Transferee" },
        workAllowed: true,
        dependentsAllowed: true,
        issuingAuthority: "USCIS",
      },
      {
        id: "O-1",
        name: { en: "O-1 Extraordinary Ability" },
        workAllowed: true,
        dependentsAllowed: true,
        issuingAuthority: "USCIS",
      },
      {
        id: "F-1",
        name: { en: "F-1 Student" },
        workAllowed: false,
        dependentsAllowed: true,
        issuingAuthority: "USCIS",
      },
    ],
    workPermitCategories: [
      {
        id: "EAD",
        name: { en: "Employment Authorization Document" },
        workAllowed: true,
        issuingAuthority: "USCIS",
      },
    ],
  },
};

const pack: CountryPack = {
  packId: "@regium/country-us",
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
  validators: usValidators,
};

export default pack;
