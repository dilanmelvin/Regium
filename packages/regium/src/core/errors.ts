/** Base error class for the Regium runtime. */
export class RegiumError extends Error {
  readonly code: string;
  constructor(code: string, message: string) {
    super(message);
    this.name = "RegiumError";
    this.code = code;
  }
}

export class CountryNotFoundError extends RegiumError {
  constructor(jurisdiction: string) {
    super("E_COUNTRY_NOT_FOUND", `Country pack not registered: ${jurisdiction}`);
    this.name = "CountryNotFoundError";
  }
}

export class ValidatorNotFoundError extends RegiumError {
  constructor(id: string) {
    super("E_VALIDATOR_NOT_FOUND", `Validator not registered: ${id}`);
    this.name = "ValidatorNotFoundError";
  }
}

export class FieldNotFoundError extends RegiumError {
  constructor(jurisdiction: string, field: string) {
    super("E_FIELD_NOT_FOUND", `Field "${field}" not defined for jurisdiction "${jurisdiction}"`);
    this.name = "FieldNotFoundError";
  }
}
