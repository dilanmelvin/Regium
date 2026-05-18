import { allBaseCountries } from "./_base/index.js";
import ae from "./ae/index.js";
import au from "./au/index.js";
import br from "./br/index.js";
import ca from "./ca/index.js";
import de from "./de/index.js";
import fr from "./fr/index.js";
// @regium/data — main entry
import india from "./in/index.js";
import sg from "./sg/index.js";
import uk from "./uk/index.js";
import us from "./us/index.js";

import type { CountryPack } from "@regium/core";

export const detailedCountries: CountryPack[] = [india, us, uk, de, fr, sg, ae, br, au, ca];

const detailedCodes = new Set(detailedCountries.map((p) => p.country.jurisdiction.toUpperCase()));

/** All 218 countries — detailed packs override base stubs. */
export const allCountries: CountryPack[] = [
  ...allBaseCountries.filter((p) => !detailedCodes.has(p.country.jurisdiction.toUpperCase())),
  ...detailedCountries,
];

export const countriesByISO: Record<string, CountryPack> = Object.fromEntries(
  allCountries.map((p) => [p.country.jurisdiction.toUpperCase(), p]),
);

export function getCountry(iso: string): CountryPack | undefined {
  return countriesByISO[iso.toUpperCase()];
}

export { india, us, uk, de, fr, sg, ae, br, au, ca };
export { allBaseCountries } from "./_base/index.js";
