/**
 * Tradução de erros técnicos do Supabase para mensagens amigáveis em português
 */

export interface FriendlyError {
  message: string;
  type: 'error' | 'warning' | 'info';
  actionButton?: {
    text: string;
    action: 'resend' | 'reset' | 'contact';
  };
}

/**
 * Mapeia erros do Supabase Auth para mensagens amigáveis
 */
export function translateSupabaseError(error: any): FriendlyError {
  if (!error) {
    return {
      message: 'Erro desconhecido. Tente novamente.',
      type: 'error',
    };
  }

  const errorMessage = error.message || error.msg || String(error);
  const errorCode = error.code || error.error_code || '';

  // Email não confirmado
  if (
    errorMessage.toLowerCase().includes('email not confirmed') ||
    errorMessage.toLowerCase().includes('email confirmation') ||
    errorCode === 'email_not_confirmed'
  ) {
    return {
      message: 'Email não confirmado. Verifique sua caixa de entrada e clique no link de confirmação. Se não recebeu, clique em reenviar.',
      type: 'warning',
      actionButton: {
        text: 'Reenviar Email de Confirmação',
        action: 'resend',
      },
    };
  }

  // Credenciais inválidas
  if (
    errorMessage.toLowerCase().includes('invalid login credentials') ||
    errorMessage.toLowerCase().includes('invalid credentials') ||
    errorCode === 'invalid_credentials'
  ) {
    return {
      message: 'Email ou senha incorretos. Verifique seus dados e tente novamente.',
      type: 'error',
      actionButton: {
        text: 'Esqueci minha senha',
        action: 'reset',
      },
    };
  }

  // Usuário já existe
  if (
    errorMessage.toLowerCase().includes('user already registered') ||
    errorMessage.toLowerCase().includes('email already registered') ||
    errorMessage.toLowerCase().includes('already exists') ||
    errorCode === 'user_already_exists'
  ) {
    return {
      message: 'Este email já está cadastrado. Faça login ou recupere sua senha se esqueceu.',
      type: 'info',
      actionButton: {
        text: 'Ir para Login',
        action: 'reset',
      },
    };
  }

  // Rate limit / muitas tentativas
  if (
    errorMessage.toLowerCase().includes('rate limit') ||
    errorMessage.toLowerCase().includes('too many requests') ||
    errorMessage.toLowerCase().includes('email rate limit exceeded') ||
    errorCode === 'over_email_send_rate_limit'
  ) {
    return {
      message: 'Muitas tentativas em pouco tempo. Por segurança, aguarde alguns minutos antes de tentar novamente.',
      type: 'warning',
    };
  }

  // Senha muito fraca
  if (
    errorMessage.toLowerCase().includes('password') &&
    (errorMessage.toLowerCase().includes('weak') ||
     errorMessage.toLowerCase().includes('short') ||
     errorMessage.toLowerCase().includes('minimum'))
  ) {
    return {
      message: 'Senha muito fraca. Use pelo menos 6 caracteres com letras e números.',
      type: 'error',
    };
  }

  // Email inválido
  if (
    errorMessage.toLowerCase().includes('invalid email') ||
    errorMessage.toLowerCase().includes('email format') ||
    errorCode === 'invalid_email'
  ) {
    return {
      message: 'Formato de email inválido. Verifique se digitou corretamente.',
      type: 'error',
    };
  }

  // Token expirado / inválido
  if (
    errorMessage.toLowerCase().includes('token expired') ||
    errorMessage.toLowerCase().includes('token invalid') ||
    errorMessage.toLowerCase().includes('invalid token') ||
    errorCode === 'invalid_token'
  ) {
    return {
      message: 'Link de confirmação expirado ou inválido. Solicite um novo email de confirmação.',
      type: 'warning',
      actionButton: {
        text: 'Reenviar Email',
        action: 'resend',
      },
    };
  }

  // Sessão expirada
  if (
    errorMessage.toLowerCase().includes('session') &&
    (errorMessage.toLowerCase().includes('expired') ||
     errorMessage.toLowerCase().includes('invalid'))
  ) {
    return {
      message: 'Sua sessão expirou. Faça login novamente.',
      type: 'info',
    };
  }

  // Erro de rede
  if (
    errorMessage.toLowerCase().includes('network') ||
    errorMessage.toLowerCase().includes('fetch') ||
    errorMessage.toLowerCase().includes('connection') ||
    errorCode === 'network_error'
  ) {
    return {
      message: 'Erro de conexão. Verifique sua internet e tente novamente.',
      type: 'error',
    };
  }

  // Serviço indisponível
  if (
    errorMessage.toLowerCase().includes('service unavailable') ||
    errorMessage.toLowerCase().includes('server error') ||
    errorCode === 'service_unavailable'
  ) {
    return {
      message: 'Serviço temporariamente indisponível. Tente novamente em alguns minutos.',
      type: 'warning',
    };
  }

  // Usuário não encontrado
  if (
    errorMessage.toLowerCase().includes('user not found') ||
    errorMessage.toLowerCase().includes('no user found') ||
    errorCode === 'user_not_found'
  ) {
    return {
      message: 'Email não cadastrado. Crie uma conta primeiro.',
      type: 'info',
    };
  }

  // Email já confirmado (tentar confirmar de novo)
  if (
    errorMessage.toLowerCase().includes('email already confirmed') ||
    errorCode === 'email_already_confirmed'
  ) {
    return {
      message: 'Email já confirmado! Você pode fazer login normalmente.',
      type: 'info',
    };
  }

  // Senha atual incorreta (ao tentar trocar senha)
  if (
    errorMessage.toLowerCase().includes('current password') ||
    errorMessage.toLowerCase().includes('old password')
  ) {
    return {
      message: 'Senha atual incorreta. Verifique e tente novamente.',
      type: 'error',
    };
  }

  // Fallback: se não reconheceu o erro específico, retorna mensagem genérica
  // mas inclui parte da mensagem original para debugging
  return {
    message: 'Erro ao processar sua solicitação. Tente novamente ou entre em contato com o suporte.',
    type: 'error',
    actionButton: {
      text: 'Precisa de ajuda?',
      action: 'contact',
    },
  };
}

/**
 * Helper para traduzir múltiplos erros
 */
export function translateSupabaseErrors(errors: any[]): FriendlyError[] {
  return errors.map(translateSupabaseError);
}

/**
 * Converte tipo de erro para classe CSS
 */
export function getErrorClassName(type: FriendlyError['type']): string {
  switch (type) {
    case 'error':
      return 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-800 dark:text-red-200';
    case 'warning':
      return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 text-yellow-800 dark:text-yellow-200';
    case 'info':
      return 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-800 dark:text-blue-200';
    default:
      return 'bg-slate-50 dark:bg-slate-900/20 border-slate-500 text-slate-800 dark:text-slate-200';
  }
}

/**
 * Converte tipo de erro para emoji
 */
export function getErrorEmoji(type: FriendlyError['type']): string {
  switch (type) {
    case 'error':
      return '❌';
    case 'warning':
      return '⚠️';
    case 'info':
      return 'ℹ️';
    default:
      return '•';
  }
}
