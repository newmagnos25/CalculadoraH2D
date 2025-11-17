import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error_description = searchParams.get('error_description');
  const error_code = searchParams.get('error_code');
  const next = searchParams.get('next') ?? '/calculator';

  // Se houver erro nos params (token expirado, etc)
  if (error_description || error_code) {
    const loginUrl = new URL('/auth/login', origin);

    if (error_code === 'otp_expired') {
      loginUrl.searchParams.set('error', 'Link de confirmação expirado. Por favor, faça login para reenviar.');
    } else {
      loginUrl.searchParams.set('error', error_description || 'Erro na autenticação');
    }

    return NextResponse.redirect(loginUrl);
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Redirecionar para o destino com sucesso
      const redirectUrl = new URL(next, origin);
      redirectUrl.searchParams.set('confirmed', 'true');
      return NextResponse.redirect(redirectUrl);
    }

    // Se houver erro na troca do código
    const loginUrl = new URL('/auth/login', origin);
    loginUrl.searchParams.set('error', error.message || 'Erro ao confirmar conta');
    return NextResponse.redirect(loginUrl);
  }

  // Se não houver código, redirecionar para login
  return NextResponse.redirect(new URL('/auth/login', origin));
}
