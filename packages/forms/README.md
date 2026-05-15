# @regium/forms

Schema-driven form engine for building locale-aware, compliance-ready forms.

Part of the [Regium](../../README.md) ecosystem — global workforce compliance infrastructure for developers.

## Install

```bash
npm install @regium/forms
```

## Usage

```ts
import { createForm } from "@regium/forms";

const form = createForm({
  country: "IN",
  schema: "employee-onboarding",
});

const fields = form.getFields();   // locale-aware field definitions
const result = form.validate(data); // full validation pass
```

## Features

- Country-aware field generation from schemas
- Built-in validation using `@regium/validators`
- Dynamic field visibility and conditional logic
- Framework-agnostic (see `@regium/react` for React bindings)

## License

[Apache-2.0](../../LICENSE)
