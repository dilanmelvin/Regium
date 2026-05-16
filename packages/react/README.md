# @regium/react

> React adapter for the [Regium](https://github.com/dilanmelvin/Regium) ecosystem.

[![npm](https://img.shields.io/npm/v/@regium/react?color=0f172a)](https://www.npmjs.com/package/@regium/react)

## Install

```bash
npm install regium @regium/data @regium/react react
```

## Usage

```tsx
import { createRegium } from "regium";
import { allCountries } from "@regium/data";
import { RegiumProvider, useRegiumForm, useValidate } from "@regium/react";

const regium = createRegium({ plugins: allCountries });

function App() {
  return (
    <RegiumProvider regium={regium}>
      <EmployeeForm country="IN" />
    </RegiumProvider>
  );
}

function EmployeeForm({ country }: { country: string }) {
  const form = useRegiumForm({ country, audience: "employee" });

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.validate(); }}>
      {form.fields.map((f) => (
        <div key={f.id}>
          <label>{typeof f.label === "string" ? f.label : f.label.en}</label>
          <input value={form.values[f.id] ?? ""}
            onChange={(e) => form.setValue(f.id, e.target.value)} />
          {form.errors[f.id]?.map((msg, i) => <span key={i}>{msg}</span>)}
        </div>
      ))}
      <button type="submit">Validate</button>
    </form>
  );
}
```

## Hooks

| Hook | Purpose |
|------|---------|
| `useRegium()` | Access the Regium instance from context |
| `useRegiumForm({ country, audience })` | Build a form from country compliance fields with state, validation, errors |
| `useValidate()` | Imperative validation hook |

## Components

| Component | Purpose |
|-----------|---------|
| `<RegiumProvider regium={...}>` | Provides the Regium instance to descendants |

## License

[Apache-2.0](../../LICENSE)
