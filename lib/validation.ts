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
}

export function validatePassword(password: string): PasswordValidationResult {
  if (!password) {
    return {
      isValid: false,
      error: 'Senha é obrigatória',
    };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      error: 'Senha deve ter pelo menos 6 caracteres',
    };
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
    isValid: true,
    strength,
  };
}
