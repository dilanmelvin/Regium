import type { CountryPack, MetadataEnvelope } from "@regium/core";
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
} from "@regium/core";
import { brValidators } from "@regium/core";

const country: MetadataEnvelope<Country> = {
  id: "country.br.v2025",
  domain: "country",
  jurisdiction: "BR",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [{ title: "gov.br", url: "https://www.gov.br/", fetchedAt: "2025-01-01" }],
  data: {
    name: "Brazil",
    officialName: "Federative Republic of Brazil",
    iso2: "BR",
    iso3: "BRA",
    isoNumeric: "076",
    phoneCode: "+55",
    currency: { code: "BRL", symbol: "R$", decimals: 2, name: "Brazilian Real" },
    timezones: ["America/Sao_Paulo", "America/Manaus", "America/Fortaleza"],
    officialLanguages: ["pt"],
    payrollRegion: "LATAM",
    legalSystem: "civil-law",
    weekStart: "SUN",
    dateFormat: "DD/MM/YYYY",
    numberFormat: { decimal: ",", thousands: "." },
    primaryTaxAuthority: "Receita Federal do Brasil",
  },
};

const companyFields: MetadataEnvelope<CompanyFields> = {
  id: "company-fields.br.v2025",
  domain: "company",
  jurisdiction: "BR",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [
    {
      title: "Receita Federal",
      url: "https://www.gov.br/receitafederal/",
      fetchedAt: "2025-01-01",
    },
  ],
  data: [
    {
      id: "CNPJ",
      category: "tax-id",
      label: { pt: "Cadastro Nacional da Pessoa Jurídica", en: "Corporate Tax ID" },
      validatorIds: ["br.cnpj"],
      required: true,
      unique: true,
      sensitivity: "public",
      example: "11.222.333/0001-81",
      mask: "99.999.999/9999-99",
      issuingAuthority: "Receita Federal",
    },
    {
      id: "InscEstadual",
      category: "registration",
      label: { pt: "Inscrição Estadual", en: "State Registration" },
      validatorIds: [],
      required: false,
      sensitivity: "public",
    },
    {
      id: "InscMunicipal",
      category: "registration",
      label: { pt: "Inscrição Municipal" },
      validatorIds: [],
      required: false,
      sensitivity: "public",
    },
  ],
};

const employeeFields: MetadataEnvelope<EmployeeFields> = {
  id: "employee-fields.br.v2025",
  domain: "employee",
  jurisdiction: "BR",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [
    {
      title: "Receita Federal",
      url: "https://www.gov.br/receitafederal/",
      fetchedAt: "2025-01-01",
    },
  ],
  data: [
    {
      id: "CPF",
      category: "national-id",
      label: { pt: "Cadastro de Pessoas Físicas", en: "Individual Tax ID" },
      validatorIds: ["br.cpf"],
      required: true,
      unique: true,
      sensitivity: "pii",
      example: "390.533.447-05",
      mask: "999.999.999-99",
      issuingAuthority: "Receita Federal",
    },
    {
      id: "PIS",
      category: "social-security",
      label: { pt: "PIS/PASEP" },
      validatorIds: [],
      required: true,
      unique: true,
      sensitivity: "pii",
      issuingAuthority: "Caixa Econômica",
    },
    {
      id: "CTPS",
      category: "labor",
      label: { pt: "Carteira de Trabalho" },
      validatorIds: [],
      required: true,
      sensitivity: "pii",
      issuingAuthority: "Ministério do Trabalho",
    },
    {
      id: "BankAccount",
      category: "banking",
      label: { pt: "Conta Bancária" },
      validatorIds: [],
      required: true,
      sensitivity: "pii",
    },
  ],
};

const payrollRules: MetadataEnvelope<PayrollRules> = {
  id: "payroll-rules.br.v2025",
  domain: "payroll",
  jurisdiction: "BR",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [{ title: "CLT / eSocial", url: "https://www.gov.br/esocial/", fetchedAt: "2025-01-01" }],
  data: {
    frequencies: ["monthly"],
    defaultFrequency: "monthly",
    workingDaysPerMonth: 22,
    workingHoursPerDay: 8,
    overtimeMandatory: true,
    overtimeMultiplier: 1.5,
    thirteenthMonth: true,
    currency: "BRL",
    components: [
      {
        id: "BASE",
        name: { pt: "Salário Base" },
        type: "earning",
        computation: "fixed",
        taxable: true,
        mandatory: true,
      },
      {
        id: "13TH",
        name: { pt: "Décimo Terceiro" },
        type: "bonus",
        computation: "fixed",
        taxable: true,
        mandatory: true,
      },
    ],
    contributions: [
      {
        id: "INSS_EE",
        name: { pt: "INSS (Empregado)" },
        payer: "employee",
        rate: 14,
        ceiling: 7786.02,
        authority: "INSS",
      },
      { id: "FGTS", name: { pt: "FGTS" }, payer: "employer", rate: 8, authority: "Caixa" },
      {
        id: "INSS_ER",
        name: { pt: "INSS (Empregador)" },
        payer: "employer",
        rate: 20,
        authority: "INSS",
      },
    ],
  },
};

const taxRules: MetadataEnvelope<TaxRules> = {
  id: "tax-rules.br.v2025",
  domain: "tax",
  jurisdiction: "BR",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [
    {
      title: "Receita Federal — IRPF 2025",
      url: "https://www.gov.br/receitafederal/",
      fetchedAt: "2025-01-01",
    },
  ],
  data: {
    authority: "Receita Federal",
    taxYearStart: "01-01",
    defaultRegimeId: "irpf",
    regimes: [
      {
        id: "irpf",
        name: { pt: "IRPF (Pessoa Física)" },
        default: true,
        currency: "BRL",
        period: "annual",
        standardDeduction: 0,
        slabs: [
          { from: 0, to: 27264, rate: 0 },
          { from: 27264, to: 33919.8, rate: 7.5 },
          { from: 33919.8, to: 45012.6, rate: 15 },
          { from: 45012.6, to: 55976.16, rate: 22.5 },
          { from: 55976.16, to: null, rate: 27.5 },
        ],
      },
    ],
  },
};

const laborRules: MetadataEnvelope<LaborRules> = {
  id: "labor-rules.br.v2025",
  domain: "labor",
  jurisdiction: "BR",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [
    {
      title: "Consolidação das Leis do Trabalho",
      url: "https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm",
      fetchedAt: "2025-01-01",
    },
  ],
  data: {
    standardWeeklyHours: 44,
    maxWeeklyHours: 44,
    maxDailyHours: 8,
    weeklyOffDays: 1,
    minimumWage: { amount: 1518, period: "month", currency: "BRL" },
    leavePolicies: [
      {
        type: "annual",
        name: { pt: "Férias" },
        minDaysPerYear: 30,
        paid: true,
        eligibilityDays: 365,
      },
      {
        type: "sick",
        name: { pt: "Auxílio-doença" },
        minDaysPerYear: 0,
        paid: true,
        eligibilityDays: 0,
      },
      {
        type: "maternity",
        name: { pt: "Licença-maternidade" },
        minDaysPerYear: 120,
        paid: true,
        eligibilityDays: 0,
      },
      {
        type: "paternity",
        name: { pt: "Licença-paternidade" },
        minDaysPerYear: 5,
        paid: true,
        eligibilityDays: 0,
      },
    ],
    termination: {
      minNoticeDays: 30,
      severanceMandatory: true,
      severanceMonthsPerYear: 1,
      maxProbationMonths: 3,
    },
    holidayAuthority: "Lei 662/1949 + estaduais",
    collectiveBargaining: true,
  },
};

const bankingRules: MetadataEnvelope<BankingRules> = {
  id: "banking-rules.br.v2025",
  domain: "banking",
  jurisdiction: "BR",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [
    { title: "Banco Central do Brasil", url: "https://www.bcb.gov.br/", fetchedAt: "2025-01-01" },
  ],
  data: {
    primaryFormat: "branch-code",
    acceptedFormats: ["branch-code"],
    accountNumberLength: { min: 6, max: 12 },
    swiftRequired: true,
    realTimeScheme: "PIX",
    currency: "BRL",
    authority: "Banco Central do Brasil",
  },
};

const localization: MetadataEnvelope<Localization> = {
  id: "localization.br.v2025",
  domain: "localization",
  jurisdiction: "BR",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [],
  data: {
    defaultLocale: "pt-BR",
    supportedLocales: ["pt-BR", "en-BR"],
    currencyPattern: "¤ #,##0.00",
    dateFormats: { short: "DD/MM/YY", medium: "DD/MM/YYYY", long: "DD 'de' MMMM 'de' YYYY" },
    timeFormats: { short: "HH:mm", long: "HH:mm:ss" },
    clock: "24h",
    addressFormat: {
      order: ["line1", "line2", "city", "state", "postal", "country"],
      postalCodeRegex: "^\\d{5}-?\\d{3}$",
      postalCodeExample: "01310-100",
      stateRequired: true,
    },
    nameOrder: "given-family",
    rtl: false,
  },
};

const immigration: MetadataEnvelope<Immigration> = {
  id: "immigration.br.v2025",
  domain: "immigration",
  jurisdiction: "BR",
  version: "2025.01.0",
  effectiveFrom: "2025-01-01",
  source: [
    {
      title: "Polícia Federal — Imigração",
      url: "https://www.gov.br/pf/pt-br/",
      fetchedAt: "2025-01-01",
    },
  ],
  data: {
    visaCategories: [
      {
        id: "VITEM-V",
        name: { pt: "Visto de Trabalho" },
        workAllowed: true,
        dependentsAllowed: true,
        maxStayDays: 730,
        issuingAuthority: "MJ",
      },
      {
        id: "VITEM-XI",
        name: { pt: "Visto de Investidor" },
        workAllowed: true,
        dependentsAllowed: true,
        issuingAuthority: "MJ",
      },
    ],
    workPermitCategories: [],
  },
};

const pack: CountryPack = {
  packId: "@regium/country-br",
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
  validators: brValidators,
};
export default pack;
