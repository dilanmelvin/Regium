import ae from "@regium/country-ae";
import au from "@regium/country-au";
import br from "@regium/country-br";
import ca from "@regium/country-ca";
import de from "@regium/country-de";
import fr from "@regium/country-fr";
import india from "@regium/country-in";
import sg from "@regium/country-sg";
import uk from "@regium/country-uk";
import us from "@regium/country-us";
import type { CountryPack } from "@regium/types";

/** All country packs shipped in the default registry. */
export const allCountries: CountryPack[] = [india, us, uk, de, fr, sg, ae, br, au, ca];

/** Lookup map keyed by ISO2 (uppercase). */
export const countriesByISO: Record<string, CountryPack> = Object.fromEntries(
  allCountries.map((p) => [p.country.jurisdiction.toUpperCase(), p]),
);

/** Get a country pack by ISO2 code. */
export function getCountry(iso: string): CountryPack | undefined {
  return countriesByISO[iso.toUpperCase()];
}

export { india, us, uk, de, fr, sg, ae, br, au, ca };
