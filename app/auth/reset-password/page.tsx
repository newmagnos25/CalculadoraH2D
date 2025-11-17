'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'error' | 'warning' | 'success'>('error');

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (password !== confirmPassword) {
      setMessage('As senhas não coincidem');
      setMessageType('error');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setMessage('A senha deve ter pelo menos 6 caracteres');
      setMessageType('error');
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        console.error('Erro ao redefinir senha:', error);
        setMessage(error.message);
        setMessageType('error');
        setLoading(false);
        return;
      }

      setMessage('Senha redefinida com sucesso! Redirecionando...');
      setMessageType('success');

      // Redirecionar após 2 segundos
      setTimeout(() => {
        window.location.href = '/calculator';
      }, 2000);
    } catch (err: any) {
      console.error('Erro inesperado:', err);
      setMessage('Erro ao redefinir senha. Tente novamente.');
      setMessageType('error');
      setLoading(false);
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
            Redefinir senha
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border-2 border-orange-500 shadow-2xl">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">
            Nova Senha
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
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Nova Senha
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

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Confirmar Nova Senha
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading || messageType === 'success'}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:from-slate-400 disabled:to-slate-500 text-white font-black py-3 px-6 rounded-lg transition-all shadow-lg disabled:cursor-not-allowed"
            >
              {loading ? 'Redefinindo...' : messageType === 'success' ? 'Redirecionando...' : 'Redefinir Senha'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/auth/login" className="text-sm text-orange-500 hover:text-orange-400 font-bold">
              ← Voltar para login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </main>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
