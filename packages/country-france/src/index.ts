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
import { frValidators } from "@regium/validators";

const country: MetadataEnvelope<Country> = {
  id: "country.fr.v2025",
  domain: "country",
  jurisdiction: "FR",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [
    { title: "République française", url: "https://www.gouvernement.fr/", fetchedAt: "2025-01-01" },
  ],
  data: {
    name: "France",
    officialName: "French Republic",
    iso2: "FR",
    iso3: "FRA",
    isoNumeric: "250",
    phoneCode: "+33",
    currency: { code: "EUR", symbol: "€", decimals: 2, name: "Euro" },
    timezones: ["Europe/Paris"],
    officialLanguages: ["fr"],
    payrollRegion: "EMEA",
    legalSystem: "civil-law",
    weekStart: "MON",
    dateFormat: "DD/MM/YYYY",
    numberFormat: { decimal: ",", thousands: " " },
    primaryTaxAuthority: "Direction générale des Finances publiques (DGFiP)",
  },
};

const companyFields: MetadataEnvelope<CompanyFields> = {
  id: "company-fields.fr.v2025",
  domain: "company",
  jurisdiction: "FR",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [{ title: "INSEE / DGFiP", url: "https://www.insee.fr/", fetchedAt: "2025-01-01" }],
  data: [
    {
      id: "SIREN",
      category: "corporate",
      label: { fr: "SIREN", en: "SIREN" },
      validatorIds: ["fr.siren"],
      required: true,
      unique: true,
      sensitivity: "public",
      example: "732829320",
      issuingAuthority: "INSEE",
    },
    {
      id: "SIRET",
      category: "registration",
      label: { fr: "SIRET", en: "SIRET" },
      validatorIds: ["fr.siret"],
      required: true,
      unique: true,
      sensitivity: "public",
      example: "73282932000074",
      issuingAuthority: "INSEE",
    },
    {
      id: "TVA",
      category: "vat-gst",
      label: { fr: "Numéro de TVA", en: "VAT Number" },
      validatorIds: ["fr.tva"],
      required: false,
      unique: true,
      sensitivity: "public",
      example: "FR40303265045",
      issuingAuthority: "DGFiP",
    },
    {
      id: "APE",
      category: "registration",
      label: { fr: "Code APE", en: "APE Code" },
      validatorIds: [],
      required: true,
      sensitivity: "public",
      issuingAuthority: "INSEE",
    },
  ],
};

const employeeFields: MetadataEnvelope<EmployeeFields> = {
  id: "employee-fields.fr.v2025",
  domain: "employee",
  jurisdiction: "FR",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [{ title: "URSSAF", url: "https://www.urssaf.fr/", fetchedAt: "2025-01-01" }],
  data: [
    {
      id: "NIR",
      category: "social-security",
      label: { fr: "Numéro de Sécurité Sociale", en: "Social Security Number" },
      validatorIds: [],
      required: true,
      unique: true,
      sensitivity: "pii",
      example: "1 84 06 92 030 162 23",
      issuingAuthority: "INSEE",
    },
    {
      id: "CodePostal",
      category: "other",
      label: { fr: "Code Postal" },
      validatorIds: ["fr.code-postal"],
      required: true,
      sensitivity: "internal",
      example: "75001",
    },
    {
      id: "IBAN",
      category: "banking",
      label: { en: "IBAN" },
      validatorIds: ["global.iban"],
      required: true,
      sensitivity: "pii",
      example: "FR14 2004 1010 0505 0001 3M02 606",
    },
  ],
};

const payrollRules: MetadataEnvelope<PayrollRules> = {
  id: "payroll-rules.fr.v2025",
  domain: "payroll",
  jurisdiction: "FR",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [
    { title: "URSSAF / Code du travail", url: "https://www.urssaf.fr/", fetchedAt: "2025-01-01" },
  ],
  data: {
    frequencies: ["monthly"],
    defaultFrequency: "monthly",
    workingDaysPerMonth: 21.67,
    workingHoursPerDay: 7,
    overtimeMandatory: true,
    overtimeMultiplier: 1.25,
    thirteenthMonth: false,
    currency: "EUR",
    components: [
      {
        id: "BASE",
        name: { fr: "Salaire de base" },
        type: "earning",
        computation: "fixed",
        taxable: true,
        mandatory: true,
      },
    ],
    contributions: [
      { id: "CSG", name: { fr: "CSG/CRDS" }, payer: "employee", rate: 9.2, authority: "URSSAF" },
      {
        id: "RETRAITE",
        name: { fr: "Retraite de base" },
        payer: "both",
        rate: 6.9,
        ceiling: 47100,
        authority: "CNAV",
      },
      {
        id: "MALADIE",
        name: { fr: "Assurance maladie" },
        payer: "employer",
        rate: 13,
        authority: "URSSAF",
      },
      {
        id: "CHOMAGE",
        name: { fr: "Chômage" },
        payer: "employer",
        rate: 4.05,
        authority: "URSSAF",
      },
    ],
  },
};

const taxRules: MetadataEnvelope<TaxRules> = {
  id: "tax-rules.fr.v2025",
  domain: "tax",
  jurisdiction: "FR",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [
    { title: "Loi de finances 2025", url: "https://www.impots.gouv.fr/", fetchedAt: "2025-01-01" },
  ],
  data: {
    authority: "DGFiP",
    taxYearStart: "01-01",
    defaultRegimeId: "single",
    regimes: [
      {
        id: "single",
        name: { fr: "Barème de l'impôt 2025" },
        default: true,
        currency: "EUR",
        period: "annual",
        standardDeduction: 0,
        slabs: [
          { from: 0, to: 11497, rate: 0 },
          { from: 11497, to: 29315, rate: 11 },
          { from: 29315, to: 83823, rate: 30 },
          { from: 83823, to: 180294, rate: 41 },
          { from: 180294, to: null, rate: 45 },
        ],
      },
    ],
  },
};

const laborRules: MetadataEnvelope<LaborRules> = {
  id: "labor-rules.fr.v2025",
  domain: "labor",
  jurisdiction: "FR",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [
    {
      title: "Code du travail",
      url: "https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006072050/",
      fetchedAt: "2025-01-01",
    },
  ],
  data: {
    standardWeeklyHours: 35,
    maxWeeklyHours: 48,
    maxDailyHours: 10,
    weeklyOffDays: 2,
    minimumWage: { amount: 11.88, period: "hour", currency: "EUR" },
    leavePolicies: [
      {
        type: "annual",
        name: { fr: "Congés payés" },
        minDaysPerYear: 25,
        paid: true,
        eligibilityDays: 0,
        carryForward: false,
      },
      {
        type: "sick",
        name: { fr: "Arrêt maladie" },
        minDaysPerYear: 0,
        paid: true,
        eligibilityDays: 0,
      },
      {
        type: "maternity",
        name: { fr: "Congé maternité" },
        minDaysPerYear: 112,
        paid: true,
        eligibilityDays: 0,
      },
      {
        type: "paternity",
        name: { fr: "Congé paternité" },
        minDaysPerYear: 28,
        paid: true,
        eligibilityDays: 0,
      },
    ],
    termination: {
      minNoticeDays: 30,
      severanceMandatory: true,
      severanceMonthsPerYear: 0.25,
      maxProbationMonths: 8,
    },
    holidayAuthority: "Code du travail",
    collectiveBargaining: true,
  },
};

const bankingRules: MetadataEnvelope<BankingRules> = {
  id: "banking-rules.fr.v2025",
  domain: "banking",
  jurisdiction: "FR",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [
    { title: "Banque de France", url: "https://www.banque-france.fr/", fetchedAt: "2025-01-01" },
  ],
  data: {
    primaryFormat: "iban",
    acceptedFormats: ["iban"],
    accountNumberLength: { min: 11, max: 11 },
    iban: { length: 27, countryPrefix: "FR", example: "FR14 2004 1010 0505 0001 3M02 606" },
    swiftRequired: true,
    realTimeScheme: "SEPA Instant",
    currency: "EUR",
    authority: "Banque de France",
  },
};

const localization: MetadataEnvelope<Localization> = {
  id: "localization.fr.v2025",
  domain: "localization",
  jurisdiction: "FR",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [],
  data: {
    defaultLocale: "fr-FR",
    supportedLocales: ["fr-FR", "en-FR"],
    currencyPattern: "#,##0.00 ¤",
    dateFormats: { short: "DD/MM/YY", medium: "DD/MM/YYYY", long: "DD MMMM YYYY" },
    timeFormats: { short: "HH:mm", long: "HH:mm:ss" },
    clock: "24h",
    addressFormat: {
      order: ["line1", "line2", "postal", "city", "country"],
      postalCodeRegex: "^\\d{5}$",
      postalCodeExample: "75001",
      stateRequired: false,
    },
    nameOrder: "given-family",
    rtl: false,
  },
};

const immigration: MetadataEnvelope<Immigration> = {
  id: "immigration.fr.v2025",
  domain: "immigration",
  jurisdiction: "FR",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [
    { title: "France-Visas", url: "https://france-visas.gouv.fr/", fetchedAt: "2025-01-01" },
  ],
  data: {
    visaCategories: [
      {
        id: "Talent",
        name: { fr: "Passeport Talent" },
        workAllowed: true,
        dependentsAllowed: true,
        maxStayDays: 1460,
        issuingAuthority: "MEAE",
      },
      {
        id: "Salarie",
        name: { fr: "Visa Salarié" },
        workAllowed: true,
        dependentsAllowed: true,
        issuingAuthority: "MEAE",
      },
    ],
    workPermitCategories: [],
  },
};

const pack: CountryPack = {
  packId: "@regium/country-fr",
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
  validators: frValidators,
};
export default pack;
