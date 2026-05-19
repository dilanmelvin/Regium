import { z } from "zod";

export const BCP47Schema = z
  .string()
  .regex(/^[a-z]{2,3}(-[A-Z][a-z]{3})?(-[A-Z]{2})?(-[a-zA-Z0-9]{1,8})*$/, "Invalid BCP-47 tag");
export type BCP47 = z.infer<typeof BCP47Schema>;

export const AddressFormatSchema = z.object({
  /** Order of address lines, e.g. ["line1", "line2", "city", "state", "postal", "country"]. */
  order: z.array(z.string().min(1)),
  /** Postal code regex if applicable. */
  postalCodeRegex: z.string().optional(),
  /** Postal code example. */
  postalCodeExample: z.string().optional(),
  /** Whether state/province is required. */
  stateRequired: z.boolean().optional(),
});
export type AddressFormat = z.infer<typeof AddressFormatSchema>;

export const NameOrderSchema = z.enum([
  "given-family",
  "family-given",
  "family-given-comma",
  "single",
]);
export type NameOrder = z.infer<typeof NameOrderSchema>;

export const LocalizationSchema = z.object({
  defaultLocale: BCP47Schema,
  supportedLocales: z.array(BCP47Schema).min(1),
  /** ICU pattern for currency display. */
  currencyPattern: z.string().optional(),
  dateFormats: z.object({
    short: z.string().min(1),
    medium: z.string().min(1),
    long: z.string().min(1),
  }),
  timeFormats: z.object({
    short: z.string().min(1),
    long: z.string().min(1),
  }),
  /** 12 or 24 hour clock convention. */
  clock: z.enum(["12h", "24h"]),
  addressFormat: AddressFormatSchema,
  nameOrder: NameOrderSchema.optional(),
  rtl: z.boolean().optional(),
});
export type Localization = z.infer<typeof LocalizationSchema>;
