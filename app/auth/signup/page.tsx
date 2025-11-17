'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'error' | 'warning' | 'success'>('error');
  const [confirmingManually, setConfirmingManually] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (password.length < 6) {
      setMessage('A senha deve ter pelo menos 6 caracteres');
      setMessageType('error');
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      // Verificar se o Supabase está configurado
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        setMessage('Erro de configuração: Supabase não configurado corretamente');
        setMessageType('error');
        setLoading(false);
        return;
      }

      console.log('Tentando criar conta para:', email);

      // Usar NEXT_PUBLIC_APP_URL se disponível, senão usar window.location.origin
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${appUrl}/auth/callback`,
        },
      });

      if (error) {
        console.error('Erro ao criar conta:', error);

        // Tratar erro de email duplicado
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          setMessage('Este email já está cadastrado. Faça login ou use outro email.');
          setMessageType('error');
        } else if (error.message.includes('invalid email')) {
          setMessage('Email inválido. Verifique e tente novamente.');
          setMessageType('error');
        } else {
          setMessage(error.message || 'Erro ao criar conta. Tente novamente.');
          setMessageType('error');
        }

        setLoading(false);
        return;
      }

      console.log('Conta criada com sucesso:', data);

      // Verificar se precisa de confirmação de email
      if (data.user && !data.session) {
        setMessage('Verifique seu email para confirmar a conta. Não recebeu? Clique no botão abaixo.');
        setMessageType('warning');
        setNeedsConfirmation(true);
        setLoading(false);
        return;
      }

      // Se tudo deu certo, redirecionar
      console.log('Conta criada com sucesso!');

      // Verificar se tem redirect query param ou tier salvo
      const redirectTo = searchParams.get('redirect');
      const savedTier = localStorage.getItem('checkout_tier_intent');

      if (redirectTo) {
        // Redirecionar para onde estava tentando ir
        window.location.href = redirectTo;
      } else if (savedTier) {
        // Redirecionar para checkout do tier salvo
        localStorage.removeItem('checkout_tier_intent');
        window.location.href = `/checkout/${savedTier}`;
      } else {
        // Redirecionar para calculadora
        window.location.href = '/calculator';
      }
    } catch (err: any) {
      console.error('Erro inesperado:', err);
      setMessage(`Erro ao conectar: ${err.message || 'Verifique sua conexão com a internet'}`);
      setMessageType('error');
      setLoading(false);
    }
  };

  const handleManualConfirmation = async () => {
    if (!email) {
      setMessage('Digite seu email primeiro');
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
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || 'Erro ao confirmar email');
        setMessageType('error');
        setConfirmingManually(false);
        return;
      }

      setMessage('✅ Email confirmado! Agora você pode fazer login.');
      setMessageType('success');
      setNeedsConfirmation(false);

      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 2000);

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
            Crie sua conta gratuitamente
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border-2 border-orange-500 shadow-2xl">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">
            Criar Conta
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

              {needsConfirmation && messageType === 'warning' && (
                <button
                  type="button"
                  onClick={handleManualConfirmation}
                  disabled={confirmingManually}
                  className="mt-3 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-slate-400 disabled:to-slate-500 text-white text-sm font-bold rounded-lg transition-all shadow-lg"
                >
                  {confirmingManually ? '⏳ Confirmando...' : '✅ Confirmar Email Manualmente (Teste)'}
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:outline-none"
                placeholder="Seu nome"
              />
            </div>

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
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:outline-none"
                placeholder="••••••••"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Mínimo 6 caracteres
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:from-slate-400 disabled:to-slate-500 text-white font-black py-3 px-6 rounded-lg transition-all shadow-lg disabled:cursor-not-allowed"
            >
              {loading ? 'Criando conta...' : 'Criar Conta Grátis'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Já tem uma conta?{' '}
              <Link href="/auth/login" className="text-orange-500 hover:text-orange-400 font-bold">
                Fazer login
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6">
          <h3 className="text-white font-black text-lg mb-3 text-center">
            🎉 Plano FREE Incluído!
          </h3>
          <ul className="space-y-2 text-white text-sm">
            <li className="flex items-center gap-2">
              <span>✅</span>
              <span><strong>3 orçamentos por mês</strong></span>
            </li>
            <li className="flex items-center gap-2">
              <span>✅</span>
              <span>Geração de PDFs profissionais</span>
            </li>
            <li className="flex items-center gap-2">
              <span>✅</span>
              <span>Sem cartão de crédito necessário</span>
            </li>
            <li className="flex items-center gap-2">
              <span>✅</span>
              <span>Faça upgrade quando quiser</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </main>
    }>
      <SignupForm />
    </Suspense>
  );
}
