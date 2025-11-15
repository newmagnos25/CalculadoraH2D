'use client';

import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
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
          <p className="text-orange-300">Sistema de Login</p>
        </div>

        {/* Message Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border-2 border-blue-200 dark:border-blue-900 p-8">
          <div className="text-center">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Autenticação Temporariamente Desabilitada
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              O sistema de autenticação está sendo configurado. Por enquanto, use a calculadora sem login.
            </p>
            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg"
            >
              Ir para Calculadora
            </Link>
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
