# @regium/country-data

Base metadata for 218 countries — codes, currencies, phone prefixes, and region info.

Part of the [Regium](../../README.md) ecosystem — global workforce compliance infrastructure for developers.

## Install

```bash
npm install @regium/country-data
```

## Usage

```ts
import { getCountry, getAllCountries } from "@regium/country-data";

const india = getCountry("IN");
// { name: "India", iso3: "IND", currency: "INR", phone: "+91", region: "Asia" }

const all = getAllCountries(); // 218 entries
```

## Data Included

- ISO 3166-1 alpha-2 and alpha-3 codes
- Currency codes (ISO 4217)
- Phone dialing prefixes
- Region and sub-region classification
- Capital, languages, and timezone info

## License

[Apache-2.0](../../LICENSE)
