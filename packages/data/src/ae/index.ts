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
import { aeValidators } from "regium";

const country: MetadataEnvelope<Country> = {
  id: "country.ae.v2025",
  domain: "country",
  jurisdiction: "AE",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [{ title: "u.ae", url: "https://u.ae/", fetchedAt: "2025-01-01" }],
  data: {
    name: "United Arab Emirates",
    officialName: "United Arab Emirates",
    iso2: "AE",
    iso3: "ARE",
    isoNumeric: "784",
    phoneCode: "+971",
    currency: { code: "AED", symbol: "د.إ", decimals: 2, name: "UAE Dirham" },
    timezones: ["Asia/Dubai"],
    officialLanguages: ["ar", "en"],
    payrollRegion: "MENA",
    legalSystem: "mixed",
    weekStart: "MON",
    dateFormat: "DD/MM/YYYY",
    numberFormat: { decimal: ".", thousands: "," },
    primaryTaxAuthority: "Federal Tax Authority (FTA)",
  },
};

const companyFields: MetadataEnvelope<CompanyFields> = {
  id: "company-fields.ae.v2025",
  domain: "company",
  jurisdiction: "AE",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [{ title: "FTA", url: "https://tax.gov.ae/", fetchedAt: "2025-01-01" }],
  data: [
    {
      id: "TradeLicence",
      category: "corporate",
      label: { en: "Trade Licence Number", ar: "رقم الرخصة التجارية" },
      validatorIds: ["ae.trade-licence"],
      required: true,
      unique: true,
      sensitivity: "public",
      issuingAuthority: "DED",
    },
    {
      id: "TRN",
      category: "tax-id",
      label: { en: "Tax Registration Number" },
      validatorIds: ["ae.trn"],
      required: false,
      unique: true,
      sensitivity: "internal",
      example: "100123456700003",
      issuingAuthority: "FTA",
    },
    {
      id: "MOHRE",
      category: "registration",
      label: { en: "MOHRE Establishment ID" },
      validatorIds: [],
      required: true,
      sensitivity: "internal",
      issuingAuthority: "MOHRE",
    },
  ],
};

const employeeFields: MetadataEnvelope<EmployeeFields> = {
  id: "employee-fields.ae.v2025",
  domain: "employee",
  jurisdiction: "AE",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [{ title: "ICA", url: "https://icp.gov.ae/", fetchedAt: "2025-01-01" }],
  data: [
    {
      id: "EmiratesID",
      category: "national-id",
      label: { en: "Emirates ID" },
      validatorIds: ["ae.emirates-id"],
      required: true,
      unique: true,
      sensitivity: "pii",
      example: "784-1985-1234567-1",
      mask: "999-9999-9999999-9",
      issuingAuthority: "ICA",
    },
    {
      id: "PassportNumber",
      category: "passport",
      label: { en: "Passport Number" },
      validatorIds: [],
      required: true,
      sensitivity: "pii",
    },
    {
      id: "WPSAccount",
      category: "banking",
      label: { en: "WPS-enabled Bank Account" },
      validatorIds: [],
      required: true,
      sensitivity: "pii",
    },
    {
      id: "IBAN",
      category: "banking",
      label: { en: "IBAN" },
      validatorIds: ["global.iban"],
      required: true,
      sensitivity: "pii",
      example: "AE07 0331 2345 6789 0123 456",
    },
  ],
};

const payrollRules: MetadataEnvelope<PayrollRules> = {
  id: "payroll-rules.ae.v2025",
  domain: "payroll",
  jurisdiction: "AE",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [{ title: "MOHRE / WPS", url: "https://www.mohre.gov.ae/", fetchedAt: "2025-01-01" }],
  data: {
    frequencies: ["monthly"],
    defaultFrequency: "monthly",
    workingDaysPerMonth: 22,
    workingHoursPerDay: 8,
    overtimeMandatory: true,
    overtimeMultiplier: 1.25,
    thirteenthMonth: false,
    currency: "AED",
    components: [
      {
        id: "BASE",
        name: { en: "Basic Salary" },
        type: "earning",
        computation: "fixed",
        taxable: false,
        mandatory: true,
      },
      {
        id: "HOUSING",
        name: { en: "Housing Allowance" },
        type: "allowance",
        computation: "fixed",
        taxable: false,
        mandatory: false,
      },
      {
        id: "TRANSPORT",
        name: { en: "Transport Allowance" },
        type: "allowance",
        computation: "fixed",
        taxable: false,
        mandatory: false,
      },
    ],
    contributions: [
      {
        id: "GPSSA",
        name: { en: "Pension (UAE Nationals only)" },
        payer: "both",
        rate: 5,
        authority: "GPSSA",
      },
    ],
  },
};

const taxRules: MetadataEnvelope<TaxRules> = {
  id: "tax-rules.ae.v2025",
  domain: "tax",
  jurisdiction: "AE",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [
    {
      title: "FTA — UAE has no personal income tax",
      url: "https://tax.gov.ae/",
      fetchedAt: "2025-01-01",
    },
  ],
  data: {
    authority: "Federal Tax Authority",
    taxYearStart: "01-01",
    defaultRegimeId: "none",
    regimes: [
      {
        id: "none",
        name: { en: "No personal income tax" },
        default: true,
        currency: "AED",
        period: "annual",
        standardDeduction: 0,
        slabs: [{ from: 0, to: null, rate: 0 }],
      },
    ],
  },
};

const laborRules: MetadataEnvelope<LaborRules> = {
  id: "labor-rules.ae.v2025",
  domain: "labor",
  jurisdiction: "AE",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [
    {
      title: "Federal Decree-Law No. 33 of 2021",
      url: "https://www.mohre.gov.ae/",
      fetchedAt: "2025-01-01",
    },
  ],
  data: {
    standardWeeklyHours: 48,
    maxWeeklyHours: 60,
    maxDailyHours: 9,
    weeklyOffDays: 1,
    leavePolicies: [
      {
        type: "annual",
        name: { en: "Annual Leave" },
        minDaysPerYear: 30,
        paid: true,
        eligibilityDays: 365,
      },
      {
        type: "sick",
        name: { en: "Sick Leave" },
        minDaysPerYear: 90,
        paid: true,
        eligibilityDays: 90,
      },
      {
        type: "maternity",
        name: { en: "Maternity Leave" },
        minDaysPerYear: 60,
        paid: true,
        eligibilityDays: 0,
      },
      {
        type: "paternity",
        name: { en: "Parental Leave" },
        minDaysPerYear: 5,
        paid: true,
        eligibilityDays: 0,
      },
    ],
    termination: {
      minNoticeDays: 30,
      severanceMandatory: true,
      severanceMonthsPerYear: 0.5,
      maxProbationMonths: 6,
    },
    holidayAuthority: "UAE Cabinet",
    collectiveBargaining: false,
  },
};

const bankingRules: MetadataEnvelope<BankingRules> = {
  id: "banking-rules.ae.v2025",
  domain: "banking",
  jurisdiction: "AE",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [{ title: "CBUAE", url: "https://www.centralbank.ae/", fetchedAt: "2025-01-01" }],
  data: {
    primaryFormat: "iban",
    acceptedFormats: ["iban"],
    accountNumberLength: { min: 16, max: 23 },
    iban: { length: 23, countryPrefix: "AE", example: "AE07 0331 2345 6789 0123 456" },
    swiftRequired: true,
    realTimeScheme: "Aani",
    currency: "AED",
    authority: "Central Bank of the UAE",
  },
};

const localization: MetadataEnvelope<Localization> = {
  id: "localization.ae.v2025",
  domain: "localization",
  jurisdiction: "AE",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [],
  data: {
    defaultLocale: "en-AE",
    supportedLocales: ["en-AE", "ar-AE"],
    currencyPattern: "¤#,##0.00",
    dateFormats: { short: "DD/MM/YY", medium: "DD MMM YYYY", long: "DD MMMM YYYY" },
    timeFormats: { short: "h:mm a", long: "h:mm:ss a" },
    clock: "12h",
    addressFormat: { order: ["line1", "line2", "city", "country"], stateRequired: false },
    nameOrder: "given-family",
    rtl: false,
  },
};

const immigration: MetadataEnvelope<Immigration> = {
  id: "immigration.ae.v2025",
  domain: "immigration",
  jurisdiction: "AE",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [{ title: "ICA", url: "https://icp.gov.ae/", fetchedAt: "2025-01-01" }],
  data: {
    visaCategories: [
      {
        id: "Employment",
        name: { en: "Employment Residence Visa" },
        workAllowed: true,
        dependentsAllowed: true,
        maxStayDays: 730,
        issuingAuthority: "MOHRE",
      },
      {
        id: "Golden",
        name: { en: "Golden Visa" },
        workAllowed: true,
        dependentsAllowed: true,
        maxStayDays: 3650,
        issuingAuthority: "ICA",
      },
      {
        id: "Green",
        name: { en: "Green Visa" },
        workAllowed: true,
        dependentsAllowed: true,
        maxStayDays: 1825,
        issuingAuthority: "ICA",
      },
    ],
    workPermitCategories: [],
  },
};

const pack: CountryPack = {
  packId: "@regium/country-ae",
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
  validators: aeValidators,
};
export default pack;
