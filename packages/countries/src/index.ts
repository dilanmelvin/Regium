import ae from "@regium/country-ae";
import au from "@regium/country-au";
import br from "@regium/country-br";
import ca from "@regium/country-ca";
import { allBaseCountries } from "@regium/country-data";
import de from "@regium/country-de";
import fr from "@regium/country-fr";
import india from "@regium/country-in";
import sg from "@regium/country-sg";
import uk from "@regium/country-uk";
import us from "@regium/country-us";
import type { CountryPack } from "@regium/types";

/** Detailed T1 country packs that override base data with full payroll/tax/labor rules. */
export const detailedCountries: CountryPack[] = [india, us, uk, de, fr, sg, ae, br, au, ca];

const detailedByCode = new Set(detailedCountries.map((p) => p.country.jurisdiction.toUpperCase()));

/**
 * Every country in the world. T1 packs (10) override the base data; the rest
 * (~190) are present as T4 stubs with country / currency / tax-authority metadata.
 *
 * Detailed packs are listed first so the registry's last-wins semantics still
 * leave base packs in place for unmapped jurisdictions.
 */
export const allCountries: CountryPack[] = [
  ...allBaseCountries.filter((p) => !detailedByCode.has(p.country.jurisdiction.toUpperCase())),
  ...detailedCountries,
];

/** Lookup map keyed by ISO2 (uppercase). */
export const countriesByISO: Record<string, CountryPack> = Object.fromEntries(
  allCountries.map((p) => [p.country.jurisdiction.toUpperCase(), p]),
);

/** Get a country pack by ISO2 code. */
export function getCountry(iso: string): CountryPack | undefined {
  return countriesByISO[iso.toUpperCase()];
}

export { india, us, uk, de, fr, sg, ae, br, au, ca };
export { allBaseCountries } from "@regium/country-data";
