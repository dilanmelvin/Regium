import { z } from "zod";

export const CurrencySchema = z.object({
  code: z.string().length(3),
  symbol: z.string().min(1),
  decimals: z.number().int().min(0).max(4),
  name: z.string().optional(),
});
export type Currency = z.infer<typeof CurrencySchema>;

export const NumberFormatSchema = z.object({
  decimal: z.string().min(1).max(2),
  thousands: z.string().min(1).max(2),
});
export type NumberFormat = z.infer<typeof NumberFormatSchema>;

export const LegalSystemSchema = z.enum([
  "common-law",
  "civil-law",
  "religious-law",
  "customary-law",
  "mixed",
]);
export type LegalSystem = z.infer<typeof LegalSystemSchema>;

export const PayrollRegionSchema = z.enum([
  "APAC",
  "EMEA",
  "AMER",
  "LATAM",
  "MENA",
  "AFRICA",
  "OCEANIA",
]);
export type PayrollRegion = z.infer<typeof PayrollRegionSchema>;

export const WeekStartSchema = z.enum(["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]);
export type WeekStart = z.infer<typeof WeekStartSchema>;

export const CountrySchema = z.object({
  name: z.string().min(1),
  officialName: z.string().min(1),
  iso2: z.string().length(2),
  iso3: z.string().length(3),
  isoNumeric: z.string().regex(/^\d{3}$/),
  phoneCode: z.string().regex(/^\+\d{1,4}$/),
  currency: CurrencySchema,
  timezones: z.array(z.string()).min(1),
  officialLanguages: z.array(z.string().min(2)).min(1),
  payrollRegion: PayrollRegionSchema,
  legalSystem: LegalSystemSchema,
  weekStart: WeekStartSchema,
  /** Format token, e.g. "DD/MM/YYYY". */
  dateFormat: z.string().min(1),
  numberFormat: NumberFormatSchema,
  primaryTaxAuthority: z.string().min(1),
  /** Optional: list of subdivision (state/province) codes. */
  subdivisions: z
    .array(
      z.object({
        code: z.string().min(1),
        name: z.string().min(1),
        type: z.string().optional(),
      }),
    )
    .optional(),
});
export type Country = z.infer<typeof CountrySchema>;
