import { z } from "zod";

export const BankCodeFormatSchema = z.enum([
  "iban",
  "swift",
  "ifsc",
  "bsb",
  "routing-aba",
  "sort-code",
  "branch-code",
  "clabe",
  "blz",
  "transit",
]);
export type BankCodeFormat = z.infer<typeof BankCodeFormatSchema>;

export const BankingRulesSchema = z.object({
  /** Primary code format used for domestic transfers. */
  primaryFormat: BankCodeFormatSchema,
  /** Other accepted formats. */
  acceptedFormats: z.array(BankCodeFormatSchema).optional(),
  /** Account number length range. */
  accountNumberLength: z.object({
    min: z.number().int().positive(),
    max: z.number().int().positive(),
  }),
  /** IBAN config if country uses IBAN. */
  iban: z
    .object({
      length: z.number().int().positive(),
      countryPrefix: z.string().length(2),
      example: z.string().min(1),
    })
    .optional(),
  /** Whether SWIFT/BIC is required for international. */
  swiftRequired: z.boolean().optional(),
  /** Real-time payment scheme name (e.g. UPI, Faster Payments). */
  realTimeScheme: z.string().optional(),
  /** Currency for domestic settlement. */
  currency: z.string().length(3),
  /** Authority that publishes bank codes. */
  authority: z.string().optional(),
});
export type BankingRules = z.infer<typeof BankingRulesSchema>;
