/**
 * Utilitários de validação de formulários
 */

export interface EmailValidationResult {
  isValid: boolean;
  error?: string;
  warning?: string;
}

/**
 * Valida email com regras rigorosas para evitar emails falsos
 *
 * Regras:
 * - Formato válido com @ e domínio
 * - Domínio deve ter TLD válido (.com, .br, .net, etc)
 * - Bloqueio de padrões obviamente falsos (test@test, fake@fake, etc)
 * - Bloqueio de domínios temporários conhecidos
 */
export function validateEmail(email: string): EmailValidationResult {
  // Trim e lowercase para normalização
  const normalizedEmail = email.trim().toLowerCase();

  // 1. Verificação básica de formato
  if (!normalizedEmail) {
    return {
      isValid: false,
      error: 'Email é obrigatório',
    };
  }

  // 2. Deve conter @
  if (!normalizedEmail.includes('@')) {
    return {
      isValid: false,
      error: 'Email deve conter @',
    };
  }

  // 3. Regex completo para validação de email
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(normalizedEmail)) {
    return {
      isValid: false,
      error: 'Formato de email inválido',
    };
  }

  // 4. Separar local e domínio
  const [localPart, domain] = normalizedEmail.split('@');

  // 5. Validar parte local (antes do @)
  if (!localPart || localPart.length < 1) {
    return {
      isValid: false,
      error: 'Email inválido: parte antes do @ muito curta',
    };
  }

  // 6. Validar domínio (depois do @)
  if (!domain || !domain.includes('.')) {
    return {
      isValid: false,
      error: 'Email deve ter domínio válido (ex: .com, .br)',
    };
  }

  // 7. Validar TLD (Top Level Domain)
  const domainParts = domain.split('.');
  const tld = domainParts[domainParts.length - 1];

  // Lista de TLDs comuns válidos
  const validTLDs = [
    'com', 'br', 'net', 'org', 'edu', 'gov', 'io', 'dev', 'app',
    'co', 'info', 'biz', 'me', 'tech', 'online', 'site', 'store',
    'uk', 'us', 'ca', 'de', 'fr', 'es', 'it', 'pt', 'mx', 'ar',
  ];

  if (!validTLDs.includes(tld)) {
    return {
      isValid: false,
      error: `Domínio .${tld} não é comum. Use .com, .br, .net, etc.`,
    };
  }

  // 8. Bloquear padrões obviamente falsos
  const fakePatternsLocal = [
    'test', 'teste', 'fake', 'falso', 'temp', 'temporario',
    'example', 'exemplo', 'asdf', 'qwerty', '123456',
    'xxx', 'dummy', 'spam', 'trash', 'lixo',
  ];

  const fakeDomains = [
    'test.com', 'test.br', 'teste.com', 'teste.br',
    'fake.com', 'falso.com', 'temp.com', 'example.com',
    'exemplo.com', 'asdf.com', 'qwerty.com', 'dummy.com',
    'spam.com', 'trash.com', 'lixo.com',
    // Serviços de email temporário conhecidos
    '10minutemail.com', 'guerrillamail.com', 'mailinator.com',
    'tempmail.com', 'throwaway.email', 'trashmail.com',
    'yopmail.com', 'maildrop.cc', 'getnada.com',
    'temp-mail.org', 'sharklasers.com', 'guerillamail.info',
    'grr.la', 'guerrillamail.biz', 'guerrillamail.de',
    'spam4.me', 'mintemail.com', 'emailondeck.com',
    'jetable.org', 'throwawaymail.com', 'fakeinbox.com',
    'dispostable.com', 'soodonims.com', 'spamgourmet.com',
    'mytrashmail.com', 'mailnesia.com', 'emailnax.com',
    '10mail.org', 'tempmailaddress.com', 'correotemporal.org',
    'mohmal.com', 'inbox.lv', '33mail.com', 'getairmail.com',
    'mailcatch.com', 'mailforspam.com', 'anonymbox.com',
  ];

  // Verificar se o local é fake
  if (fakePatternsLocal.some(pattern => localPart.includes(pattern))) {
    return {
      isValid: false,
      error: 'Este email parece ser falso. Use seu email real.',
    };
  }

  // Verificar se o domínio completo é fake
  if (fakeDomains.includes(domain)) {
    return {
      isValid: false,
      error: 'Email temporário ou falso não é permitido. Use email permanente.',
    };
  }

  // 9. Verificar padrões suspeitos adicionais
  // Ex: muitos números consecutivos, caracteres repetidos
  const hasOnlyNumbers = /^[0-9]+@/.test(normalizedEmail);
  if (hasOnlyNumbers) {
    return {
      isValid: true,
      warning: 'Email com apenas números pode não receber confirmação corretamente.',
    };
  }

  // Caracteres repetidos demais (ex: aaaa@, 1111@)
  const hasRepeatingChars = /(.)\1{3,}/.test(localPart);
  if (hasRepeatingChars) {
    return {
      isValid: true,
      warning: 'Email com caracteres repetidos pode ser inválido.',
    };
  }

  // 10. Validar domínios comuns com typos
  const commonDomainTypos: Record<string, string> = {
    'gmial.com': 'gmail.com',
    'gmai.com': 'gmail.com',
    'gnail.com': 'gmail.com',
    'gamil.com': 'gmail.com',
    'hotmial.com': 'hotmail.com',
    'hotnail.com': 'hotmail.com',
    'outlok.com': 'outlook.com',
    'outllok.com': 'outlook.com',
    'yahooo.com': 'yahoo.com',
    'yaho.com': 'yahoo.com',
  };

  if (commonDomainTypos[domain]) {
    return {
      isValid: true,
      warning: `Você quis dizer ${commonDomainTypos[domain]}? Verifique se está correto.`,
    };
  }

  // Se passou por todas as validações, é válido!
  return {
    isValid: true,
  };
}

/**
 * Validação de senha
 */
export interface PasswordValidationResult {
  isValid: boolean;
  error?: string;
  strength?: 'weak' | 'medium' | 'strong';
  suggestions?: string[];
}

export function validatePassword(password: string): PasswordValidationResult {
  if (!password) {
    return {
      isValid: false,
      error: 'Senha é obrigatória',
      suggestions: ['Digite uma senha para proteger sua conta'],
    };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      error: 'Senha deve ter pelo menos 6 caracteres',
      suggestions: ['Use uma senha mais longa para maior segurança'],
    };
  }

  const suggestions: string[] = [];

  // Verificar cada critério e adicionar sugestões
  if (!/\d/.test(password)) {
    suggestions.push('Adicione números à sua senha');
  }
  if (!/[a-z]/.test(password)) {
    suggestions.push('Adicione letras minúsculas');
  }
  if (!/[A-Z]/.test(password)) {
    suggestions.push('Adicione letras maiúsculas');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    suggestions.push('Adicione caracteres especiais como @, #, !, etc.');
  }
  if (password.length < 8) {
    suggestions.push('Use pelo menos 8 caracteres para maior segurança');
  }

  // Calcular força da senha
  let strength: 'weak' | 'medium' | 'strong' = 'weak';

  const hasNumbers = /\d/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLongEnough = password.length >= 8;

  const criteriaCount = [
    hasNumbers,
    hasLowerCase,
    hasUpperCase,
    hasSpecialChar,
    isLongEnough,
  ].filter(Boolean).length;

  if (criteriaCount >= 4) {
    strength = 'strong';
  } else if (criteriaCount >= 2) {
    strength = 'medium';
  }

  return {
    isValid: password.length >= 6,
    strength,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
  };
}

/**
 * Validação de valores numéricos para calculadora
 */
export interface NumberValidationResult {
  isValid: boolean;
  value: number;
  error?: string;
  warning?: string;
}

export function validatePositiveNumber(
  value: number | string,
  fieldName: string,
  allowZero: boolean = false,
  minValue?: number,
  maxValue?: number
): NumberValidationResult {
  // Converter string para número se necessário
  let numValue: number;
  if (typeof value === 'string') {
    numValue = parseFloat(value.replace(',', '.'));
  } else {
    numValue = value;
  }

  // Verificar se é um número válido
  if (isNaN(numValue)) {
    return {
      isValid: false,
      value: 0,
      error: `${fieldName} deve ser um número válido`,
    };
  }

  // Verificar se é positivo
  if (!allowZero && numValue <= 0) {
    return {
      isValid: false,
      value: 0,
      error: `${fieldName} deve ser maior que zero`,
    };
  }

  // Verificar valor mínimo
  if (minValue !== undefined && numValue < minValue) {
    return {
      isValid: false,
      value: numValue,
      error: `${fieldName} deve ser pelo menos ${minValue}`,
    };
  }

  // Verificar valor máximo
  if (maxValue !== undefined && numValue > maxValue) {
    return {
      isValid: false,
      value: numValue,
      error: `${fieldName} não pode ser maior que ${maxValue}`,
    };
  }

  // Verificar se é um valor razoável (warning)
  if (numValue > 1000000) {
    return {
      isValid: true,
      value: numValue,
      warning: `O valor de ${fieldName} parece muito alto. Verifique se está correto.`,
    };
  }

  return {
    isValid: true,
    value: numValue,
  };
}

/**
 * Validação de CPF/CNPJ
 */
export function validateCPFCNPJ(value: string): { isValid: boolean; type: 'CPF' | 'CNPJ' | 'invalid'; error?: string } {
  // Remove caracteres não numéricos
  const cleanValue = value.replace(/\D/g, '');

  // Validação de CPF
  if (cleanValue.length === 11) {
    let sum = 0;
    let remainder: number;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cleanValue.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    if (remainder !== parseInt(cleanValue.substring(9, 10))) {
      return { isValid: false, type: 'invalid', error: 'CPF inválido - dígito verificador incorreto' };
    }

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cleanValue.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    if (remainder !== parseInt(cleanValue.substring(10, 11))) {
      return { isValid: false, type: 'invalid', error: 'CPF inválido - dígito verificador incorreto' };
    }

    return { isValid: true, type: 'CPF' };
  }

  // Validação de CNPJ
  if (cleanValue.length === 14) {
    let sum = 0;
    let weight = 5;

    for (let i = 0; i < 12; i++) {
      sum += parseInt(cleanValue.substring(i, i + 1)) * weight;
      weight--;
      if (weight < 2) weight = 9;
    }

    let remainder = sum % 11;
    let digit1 = remainder < 2 ? 0 : 11 - remainder;

    sum = 0;
    weight = 6;
    for (let i = 0; i < 13; i++) {
      sum += parseInt(cleanValue.substring(i, i + 1)) * weight;
      weight--;
      if (weight < 2) weight = 9;
    }

    remainder = sum % 11;
    let digit2 = remainder < 2 ? 0 : 11 - remainder;

    if (digit1 !== parseInt(cleanValue.substring(12, 13)) ||
        digit2 !== parseInt(cleanValue.substring(13, 14))) {
      return { isValid: false, type: 'invalid', error: 'CNPJ inválido - dígitos verificadores incorretos' };
    }

    return { isValid: true, type: 'CNPJ' };
  }

  return { isValid: false, type: 'invalid', error: 'CPF/CNPJ deve ter 11 ou 14 dígitos' };
}
