'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'error' | 'warning' | 'success'>('error');
  const [resendingEmail, setResendingEmail] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [confirmingManually, setConfirmingManually] = useState(false);

  // Capturar erro da URL (vindo do callback)
  useEffect(() => {
    const urlError = searchParams.get('error');
    if (urlError) {
      const errorMsg = decodeURIComponent(urlError);
      setMessage(errorMsg);
      // Se for sobre confirmação/expiração, é warning; senão é erro
      if (errorMsg.includes('confirmação') || errorMsg.includes('expirado')) {
        setMessageType('warning');
      } else {
        setMessageType('error');
      }
    }
  }, [searchParams]);

  const handleResendConfirmation = async () => {
    if (!email) {
      setMessage('Digite seu email para reenviar a confirmação');
      setMessageType('error');
      return;
    }

    setResendingEmail(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${appUrl}/auth/callback`,
        }
      });

      if (error) {
        setMessage(error.message);
        setMessageType('error');
      } else {
        setMessage('Email de confirmação reenviado! Verifique sua caixa de entrada.');
        setMessageType('warning');
      }
    } catch (err: any) {
      setMessage('Erro ao reenviar email. Tente novamente.');
      setMessageType('error');
    } finally {
      setResendingEmail(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage('Digite seu email para recuperar a senha');
      setMessageType('error');
      return;
    }

    setResettingPassword(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${appUrl}/auth/reset-password`,
      });

      if (error) {
        setMessage(error.message);
        setMessageType('error');
      } else {
        setMessage('Email de recuperação enviado! Verifique sua caixa de entrada.');
        setMessageType('warning');
      }
    } catch (err: any) {
      setMessage('Erro ao enviar email de recuperação. Tente novamente.');
      setMessageType('error');
    } finally {
      setResettingPassword(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erro ao fazer login:', error);

        // Se o erro for de email não confirmado
        if (error.message.includes('Email not confirmed')) {
          setMessage('Email não confirmado. Clique no botão abaixo para reenviar o email de confirmação.');
          setMessageType('warning');
        } else {
          setMessage(error.message);
          setMessageType('error');
        }

        setLoading(false);
        return;
      }

      console.log('Login realizado com sucesso:', data);

      // Verificar se tem redirect ou tier salvo
      const redirectTo = searchParams.get('redirect');
      const savedTier = localStorage.getItem('checkout_tier_intent');

      if (redirectTo) {
        window.location.href = redirectTo;
      } else if (savedTier) {
        localStorage.removeItem('checkout_tier_intent');
        window.location.href = `/checkout/${savedTier}`;
      } else {
        window.location.href = '/calculator';
      }
    } catch (err: any) {
      console.error('Erro inesperado:', err);
      setMessage('Erro ao conectar. Tente novamente.');
      setMessageType('error');
      setLoading(false);
    }
  };

  const handleManualConfirmation = async () => {
    if (!email) {
      setMessage('Digite seu email para confirmar');
      setMessageType('error');
      return;
    }

    setConfirmingManually(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/confirm-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          secretKey: 'dev-secret-12345' // Senha hardcoded apenas para testes
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || 'Erro ao confirmar email');
        setMessageType('error');
        setConfirmingManually(false);
        return;
      }

      setMessage('✅ Email confirmado! Faça login novamente.');
      setMessageType('success');

      // Limpar formulário após 2 segundos para refazer login
      setTimeout(() => {
        setMessage(null);
      }, 3000);

    } catch (err: any) {
      setMessage('Erro ao confirmar email. Tente novamente.');
      setMessageType('error');
    } finally {
      setConfirmingManually(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-900 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white mb-2">
            Precifica3D PRO
          </h1>
          <p className="text-slate-400">
            Faça login para continuar
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border-2 border-orange-500 shadow-2xl">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">
            Entrar
          </h2>

          {message && (
            <div className={`mb-6 p-4 border-2 rounded-lg ${
              messageType === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                : messageType === 'warning'
                ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                : 'bg-red-50 dark:bg-red-900/20 border-red-500'
            }`}>
              <p className={`text-sm font-semibold ${
                messageType === 'success'
                  ? 'text-green-800 dark:text-green-200'
                  : messageType === 'warning'
                  ? 'text-yellow-800 dark:text-yellow-200'
                  : 'text-red-800 dark:text-red-200'
              }`}>
                {messageType === 'success' ? '✅' : messageType === 'warning' ? '⚠️' : '❌'} {message}
              </p>

              {messageType !== 'success' && (message.includes('confirmação') || message.includes('expirado')) && (
                <div className="mt-3 space-y-2">
                  <button
                    type="button"
                    onClick={handleResendConfirmation}
                    disabled={resendingEmail}
                    className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white text-sm font-bold rounded-lg transition-colors"
                  >
                    {resendingEmail ? 'Reenviando...' : '📧 Reenviar Email de Confirmação'}
                  </button>

                  <button
                    type="button"
                    onClick={handleManualConfirmation}
                    disabled={confirmingManually}
                    className="w-full py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-slate-400 disabled:to-slate-500 text-white text-sm font-bold rounded-lg transition-all shadow-lg"
                  >
                    {confirmingManually ? '⏳ Confirmando...' : '✅ Confirmar Manualmente (Teste)'}
                  </button>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:outline-none"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                  Senha
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={resettingPassword}
                  className="text-xs font-bold text-blue-500 hover:text-blue-400 disabled:text-blue-300 transition-colors"
                >
                  {resettingPassword ? 'Enviando...' : 'Esqueci minha senha'}
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:from-slate-400 disabled:to-slate-500 text-white font-black py-3 px-6 rounded-lg transition-all shadow-lg disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Não tem uma conta?{' '}
              <Link href="/auth/signup" className="text-orange-500 hover:text-orange-400 font-bold">
                Criar conta grátis
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 text-center">
          <p className="text-white font-bold">
            🎉 Crie sua conta e ganhe <strong>3 orçamentos grátis</strong> para testar!
          </p>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </main>
    }>
      <LoginForm />
    </Suspense>
  );
}
