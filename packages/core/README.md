# @regium/core

Core registry, resolver, and plugin host. The `createRegium()` entry point for bootstrapping the Regium engine.

Part of the [Regium](../../README.md) ecosystem — global workforce compliance infrastructure for developers.

## Install

```bash
npm install @regium/core
```

## Usage

```ts
import { createRegium } from "@regium/core";
import { countryIN } from "@regium/country-in";

const regium = createRegium({
  countries: [countryIN],
});
```

## API

| Export | Description |
| --- | --- |
| `createRegium()` | Bootstrap a Regium instance with country packs and plugins |
| `Registry` | Internal country/module registry |
| `resolve()` | Resolve a module for a given country context |

## License

[Apache-2.0](../../LICENSE)
