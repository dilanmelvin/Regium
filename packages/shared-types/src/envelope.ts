import { z } from "zod";

/** ISO-8601 calendar date in YYYY-MM-DD form. */
export const ISODateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected ISO date in YYYY-MM-DD form");
export type ISODate = z.infer<typeof ISODateSchema>;

/** ISO 3166-1 alpha-2 country code, or a known territory code. */
export const JurisdictionCodeSchema = z
  .string()
  .min(2)
  .max(5)
  .regex(/^[A-Z0-9-]+$/, "Jurisdiction code must be uppercase letters/digits");
export type JurisdictionCode = z.infer<typeof JurisdictionCodeSchema>;

export const MetadataDomainSchema = z.enum([
  "country",
  "company",
  "employee",
  "payroll",
  "tax",
  "social-security",
  "labor",
  "banking",
  "immigration",
  "localization",
  "validation",
  "documents",
  "contributions",
  "leave",
  "termination",
  "employment-types",
  "work-auth",
  "benefits",
  "pension",
  "payroll-frequency",
]);
export type MetadataDomain = z.infer<typeof MetadataDomainSchema>;

export const SourceCitationSchema = z.object({
  /** Human-readable label, e.g. "Income Tax Act, 1961, Section 139A". */
  title: z.string().min(1),
  /** Public URL of the primary source. */
  url: z.string().url(),
  /** ISO date the source was last fetched / verified. */
  fetchedAt: ISODateSchema,
  /** Optional archived snapshot URL (Wayback or internal). */
  archivedAt: z.string().url().optional(),
  /** Whether this is a primary government / regulator source. Defaults to true. */
  primary: z.boolean().optional(),
});
export type SourceCitation = z.infer<typeof SourceCitationSchema>;

/**
 * Universal metadata envelope. Every metadata item in Regium wraps its payload
 * in this envelope so consumers can audit, version, and time-travel.
 */
export const MetadataEnvelopeSchema = <T extends z.ZodTypeAny>(payload: T) =>
  z.object({
    /** Stable slug, e.g. "country.in.v2025.04". */
    id: z.string().min(1),
    domain: MetadataDomainSchema,
    jurisdiction: JurisdictionCodeSchema,
    /** Semantic version of the metadata document. */
    version: z.string().min(1),
    effectiveFrom: ISODateSchema,
    effectiveTo: ISODateSchema.optional(),
    deprecated: z.boolean().optional(),
    supersededBy: z.string().optional(),
    source: z.array(SourceCitationSchema).optional(),
    authoredBy: z.string().optional(),
    reviewedBy: z.array(z.string()).optional(),
    lastReviewedAt: ISODateSchema.optional(),
    data: payload,
  });

export type MetadataEnvelope<T> = {
  id: string;
  domain: MetadataDomain;
  jurisdiction: JurisdictionCode;
  version: string;
  effectiveFrom: ISODate;
  effectiveTo?: ISODate;
  deprecated?: boolean;
  supersededBy?: string;
  source?: SourceCitation[];
  authoredBy?: string;
  reviewedBy?: string[];
  lastReviewedAt?: ISODate;
  data: T;
};

/** Helper: pick the envelope active for a given effective date. */
export function isActiveOn<T>(env: MetadataEnvelope<T>, when: ISODate): boolean {
  if (env.deprecated) return false;
  if (env.effectiveFrom > when) return false;
  if (env.effectiveTo && env.effectiveTo <= when) return false;
  return true;
}
