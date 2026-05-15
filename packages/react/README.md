# @regium/react

React adapter for Regium — provides `RegiumProvider`, `useRegiumForm`, and `useValidate` hooks.

Part of the [Regium](../../README.md) ecosystem — global workforce compliance infrastructure for developers.

## Install

```bash
npm install @regium/react
```

## Usage

```tsx
import { RegiumProvider, useRegiumForm } from "@regium/react";
import { createRegium } from "@regium/core";

const regium = createRegium({ countries: [countryIN] });

function App() {
  return (
    <RegiumProvider instance={regium}>
      <EmployeeForm />
    </RegiumProvider>
  );
}

function EmployeeForm() {
  const { fields, validate, handleSubmit } = useRegiumForm("employee-onboarding");
  return <form onSubmit={handleSubmit}>{/* render fields */}</form>;
}
```

## Exports

| Hook / Component | Description |
| --- | --- |
| `RegiumProvider` | Context provider for a Regium instance |
| `useRegiumForm` | Schema-driven form hook |
| `useValidate` | Standalone validation hook |

## License

[Apache-2.0](../../LICENSE)
