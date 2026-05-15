# @regium/countries

Master registry bundling all available Regium country packs into a single import.

Part of the [Regium](../../README.md) ecosystem — global workforce compliance infrastructure for developers.

## Install

```bash
npm install @regium/countries
```

## Usage

```ts
import { createRegium } from "@regium/core";
import { allCountries } from "@regium/countries";

const regium = createRegium({
  countries: allCountries,
});
```

## Notes

- Bundles all Tier 1 and Tier 2 country packs
- For smaller bundles, import individual country packs instead (e.g. `@regium/country-in`)
- Tree-shaking is supported when importing individual packs

## License

[Apache-2.0](../../LICENSE)
