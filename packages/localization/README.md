# @regium/localization

Internationalization (i18n) and locale-aware formatting for the Regium ecosystem.

Part of the [Regium](../../README.md) ecosystem — global workforce compliance infrastructure for developers.

## Install

```bash
npm install @regium/localization
```

## Usage

```ts
import { formatDate, formatNumber, getLocale } from "@regium/localization";

const locale = getLocale("IN");
formatDate(new Date(), locale);    // "01/06/2024"
formatNumber(1500000.5, locale);   // "15,00,000.5"
```

## Features

- Locale-aware date, number, and currency formatting
- Country-to-locale resolution
- Label and message bundles for form fields
- RTL and script-aware display hints

## License

[Apache-2.0](../../LICENSE)
