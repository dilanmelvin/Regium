import type { Validator } from "../types/index.js";
import { checksum } from "./primitives.js";

function digitCheck(digits: number[], weights: number[]): number {
  let sum = 0;
  for (let i = 0; i < weights.length; i++) {
    const d = digits[i];
    const w = weights[i];
    if (d === undefined || w === undefined) return -1;
    sum += d * w;
  }
  const r = sum % 11;
  return r < 2 ? 0 : 11 - r;
}

/** Brazilian CPF (11 digits, two check digits). */
export const cpf: Validator = checksum({
  id: "br.cpf",
  description: "Brazilian Cadastro de Pessoas Físicas",
  jurisdiction: "BR",
  format: /^\d{11}$/,
  check: (v) => {
    if (/^(\d)\1{10}$/.test(v)) return false;
    const digits = [...v].map(Number);
    const w1 = [10, 9, 8, 7, 6, 5, 4, 3, 2];
    const w2 = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
    const d1 = digitCheck(digits.slice(0, 9), w1);
    const d2 = digitCheck(digits.slice(0, 10), w2);
    return d1 === digits[9] && d2 === digits[10];
  },
});

/** Brazilian CNPJ (14 digits, two check digits). */
export const cnpj: Validator = checksum({
  id: "br.cnpj",
  description: "Brazilian Cadastro Nacional da Pessoa Jurídica",
  jurisdiction: "BR",
  format: /^\d{14}$/,
  check: (v) => {
    if (/^(\d)\1{13}$/.test(v)) return false;
    const digits = [...v].map(Number);
    const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const d1 = digitCheck(digits.slice(0, 12), w1);
    const d2 = digitCheck(digits.slice(0, 13), w2);
    return d1 === digits[12] && d2 === digits[13];
  },
});

export const brValidators: Validator[] = [cpf, cnpj];
