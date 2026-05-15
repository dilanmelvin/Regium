# Regium · Examples

Copy-paste recipes covering the most common use cases.

## 1. Basic country lookup

```ts
import { createRegium } from "@regium/core";
import india from "@regium/country-in";
import us from "@regium/country-us";

const regium = createRegium({ plugins: [india, us] });

const india_cfg = regium.getCountryConfig("IN");
console.log(india_cfg.currency);
// → { code: "INR", symbol: "₹", decimals: 2, name: "Indian Rupee" }
```

## 2. Validate a tax ID

```ts
const result = regium.validate({
  country: "IN",
  field: "PAN",
  value: "ABCPL1234C",
});

if (result.ok) {
  console.log("Valid PAN. Normalized:", result.normalized);
} else {
  console.log("Errors:", result.errors);
}
```

## 3. Validate an IBAN

```ts
import { iban } from "@regium/validators";

iban.validate("DE89 3704 0044 0532 0130 00");
// → { ok: true, errors: [], normalized: "DE89370400440532013000" }
```

## 4. Generate a localized employee form

```ts
import { buildFormFromFields } from "@regium/forms";

const fields = regium.getEmployeeFields("DE");
const schema = buildFormFromFields({
  jurisdiction: "DE",
  audience: "employee",
  fields,
  locale: "de-DE",
});
```

## 5. Compute payroll (gross→net)

```ts
import { computePayroll } from "@regium/payroll";

const result = computePayroll({
  annualGross: 1500000,
  rules: regium.getPayrollRules("IN"),
  taxRules: regium.getTaxRules("IN"),
});

console.log(result.netMonthly);          // → 102_166.66...
console.log(result.totalEmployerCost);   // → 1_582_500
```

## 6. Time-travel: historical rules

```ts
const regiumApr2024 = createRegium({
  plugins: [india],
  effectiveDate: "2024-04-15",
});

regiumApr2024.getTaxRules("IN");
// returns the tax rules valid on 2024-04-15
```

## 7. React integration

```tsx
import { createRegium } from "@regium/core";
import { allCountries } from "@regium/countries";
import { RegiumProvider, useRegiumForm } from "@regium/react";

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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (form.validate()) console.log(form.values);
      }}
    >
      {form.fields.map((f) => (
        <label key={f.id}>
          {typeof f.label === "string" ? f.label : f.label.en}
          <input
            value={form.values[f.id] ?? ""}
            onChange={(e) => form.setValue(f.id, e.target.value)}
          />
        </label>
      ))}
      <button type="submit">Validate</button>
    </form>
  );
}
```

## 8. Custom plugin with private validators

```ts
import { createRegium } from "@regium/core";
import { regex } from "@regium/validators";

const acmeBadge = regex({
  id: "acme.badge-id",
  description: "Acme Corp internal employee badge",
  jurisdiction: "global",
  pattern: /^ACME-\d{6}$/,
});

const regium = createRegium({
  plugins: [
    {
      name: "@acme/regium-private",
      version: "1.0.0",
      setup(host) {
        host.registerValidator(acmeBadge);
      },
    },
  ],
});

regium.getValidator("acme.badge-id").validate("ACME-123456");
```

## 9. Listing all loaded countries

```ts
regium.listCountries();
// → ["AE", "AU", "BR", "CA", "DE", "FR", "GB", "IN", "SG", "US"]
```

## 10. Banking format check

```ts
import { createBanking } from "@regium/banking";

const bank = createBanking(regium.getBankingRules("IN"));
bank.validateAccountLength("123456789012");
// → { ok: true, errors: [] }
```
