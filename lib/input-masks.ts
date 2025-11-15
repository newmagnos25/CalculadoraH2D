/**
 * Máscaras e funções utilitárias para formatação de inputs
 */

export const MASKS = {
  CPF: '999.999.999-99',
  CNPJ: '99.999.999/9999-99',
  PHONE: '(99) 99999-9999',
  PHONE_OLD: '(99) 9999-9999', // Telefone fixo
  CEP: '99999-999',
  DATE: '99/99/9999',
};

/**
 * Remove caracteres não numéricos de uma string
 */
export function removeNonNumeric(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Detecta automaticamente se é CPF ou CNPJ e retorna a máscara apropriada
 */
export function getCpfCnpjMask(value: string): string {
  const numbers = removeNonNumeric(value);
  return numbers.length <= 11 ? MASKS.CPF : MASKS.CNPJ;
}

/**
 * Detecta automaticamente se é telefone celular ou fixo
 */
export function getPhoneMask(value: string): string {
  const numbers = removeNonNumeric(value);
  // Se tem 11 dígitos (ex: 11 98765-4321) é celular
  // Se tem 10 dígitos (ex: 11 3456-7890) é fixo
  return numbers.length === 11 ? MASKS.PHONE : MASKS.PHONE_OLD;
}

/**
 * Formata CPF
 */
export function formatCPF(value: string): string {
  const numbers = removeNonNumeric(value);
  if (numbers.length !== 11) return value;
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Formata CNPJ
 */
export function formatCNPJ(value: string): string {
  const numbers = removeNonNumeric(value);
  if (numbers.length !== 14) return value;
  return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

/**
 * Formata CEP
 */
export function formatCEP(value: string): string {
  const numbers = removeNonNumeric(value);
  if (numbers.length !== 8) return value;
  return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
}

/**
 * Formata telefone
 */
export function formatPhone(value: string): string {
  const numbers = removeNonNumeric(value);
  if (numbers.length === 11) {
    // Celular: (11) 98765-4321
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (numbers.length === 10) {
    // Fixo: (11) 3456-7890
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return value;
}

/**
 * Valida CPF
 */
export function validateCPF(cpf: string): boolean {
  const numbers = removeNonNumeric(cpf);
  if (numbers.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(numbers)) return false;

  // Validação dos dígitos verificadores
  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(numbers.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(numbers.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers.substring(10, 11))) return false;

  return true;
}

/**
 * Valida CNPJ
 */
export function validateCNPJ(cnpj: string): boolean {
  const numbers = removeNonNumeric(cnpj);
  if (numbers.length !== 14) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(numbers)) return false;

  // Validação dos dígitos verificadores
  let length = numbers.length - 2;
  let nums = numbers.substring(0, length);
  const digits = numbers.substring(length);
  let sum = 0;
  let pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(nums.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;

  length = length + 1;
  nums = numbers.substring(0, length);
  sum = 0;
  pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(nums.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;

  return true;
}

/**
 * Valida CEP
 */
export function validateCEP(cep: string): boolean {
  const numbers = removeNonNumeric(cep);
  return numbers.length === 8;
}

/**
 * Valida telefone
 */
export function validatePhone(phone: string): boolean {
  const numbers = removeNonNumeric(phone);
  return numbers.length === 10 || numbers.length === 11;
}
