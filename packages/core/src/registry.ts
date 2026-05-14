import type { CountryPack, PluginHost, RegiumPlugin, Validator } from "@regium/types";

/**
 * Internal registry storing all loaded country packs and validators.
 * Frozen after `createRegium()` returns to guarantee immutability.
 */
export class Registry implements PluginHost {
  private readonly countries = new Map<string, CountryPack>();
  private readonly validators = new Map<string, Validator>();
  private frozen = false;

  registerCountryPack(pack: CountryPack): void {
    this.assertMutable();
    const code = pack.country.jurisdiction.toUpperCase();
    // Last-wins: detailed T1 packs registered after base packs override them.
    this.countries.set(code, pack);
    // Auto-register validators contributed by the pack.
    for (const v of pack.validators ?? []) {
      this.registerValidator(v);
    }
  }

  registerValidator(v: Validator): void {
    this.assertMutable();
    if (this.validators.has(v.id)) {
      // Last-wins for global validators makes overrides easy in tests.
      this.validators.set(v.id, v);
      return;
    }
    this.validators.set(v.id, v);
  }

  registerFormAdapter(_a: unknown): void {
    // Reserved for future use.
  }
  registerPayrollProvider(_p: unknown): void {
    // Reserved for future use.
  }
  registerTaxEngine(_e: unknown): void {
    // Reserved for future use.
  }
  registerBankingProvider(_b: unknown): void {
    // Reserved for future use.
  }

  freeze(): void {
    this.frozen = true;
  }

  getCountryPack(iso: string): CountryPack | undefined {
    return this.countries.get(iso.toUpperCase());
  }

  listCountries(): string[] {
    return [...this.countries.keys()].sort();
  }

  getValidator(id: string): Validator | undefined {
    return this.validators.get(id);
  }

  listValidators(): string[] {
    return [...this.validators.keys()].sort();
  }

  async runPlugin(plugin: RegiumPlugin): Promise<void> {
    await plugin.setup(this);
  }

  private assertMutable(): void {
    if (this.frozen) {
      throw new Error("Regium registry is frozen and cannot accept new registrations.");
    }
  }
}
