'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-block w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center border-4 border-amber-300 shadow-2xl shadow-orange-500/50 mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-white mb-2">CalculadoraH2D PRO</h1>
          <p className="text-orange-300">Entre na sua conta</p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border-2 border-orange-200 dark:border-orange-900 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-100 dark:bg-red-900/30 border-2 border-red-500 text-red-800 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                E-mail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-orange-200 dark:border-orange-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                Senha
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-orange-200 dark:border-orange-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg shadow-orange-500/30"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Não tem uma conta?{' '}
              <Link href="/auth/signup" className="text-orange-500 hover:text-orange-600 font-semibold">
                Criar conta grátis
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-slate-400">
          <p>© 2025 BKreativeLab - Todos os direitos reservados</p>
        </div>
      </div>
    </div>
  );
}
