'use client';

import Link from 'next/link';
import { useSubscription } from '@/lib/hooks/useSubscription';

export default function UpgradePage() {
  const { subscription, loading } = useSubscription();

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-900">
      {/* Header Premium */}
      <div className="bg-gradient-to-r from-black via-slate-900 to-black border-b-4 border-orange-500 shadow-2xl">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center gap-6">
            <Link href="/calculator" className="flex items-center gap-4 hover:opacity-80 transition-opacity cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center border-2 border-amber-300 shadow-lg shadow-orange-500/50">
                <svg className="w-10 h-10 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
                    Precifica3D
                  </h1>
                  <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full text-xs font-black border-2 border-amber-300 text-white shadow-lg">
                    PRO
                  </span>
                </div>
                <p className="text-orange-200 text-xs sm:text-sm md:text-base font-medium">
                  🚀 Você atingiu o limite!
                </p>
              </div>
            </Link>
            <p className="text-xl text-orange-300 text-center max-w-2xl">
              Faça upgrade para continuar criando orçamentos profissionais
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl py-12 px-4">

        <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-8 mb-12 border-4 border-red-300">
          <div className="text-center">
            <h2 className="text-2xl font-black text-white mb-4">
              📊 Seu Uso Atual
            </h2>
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-black text-white">
                  {subscription?.tier?.toUpperCase() || 'FREE'}
                </div>
                <div className="text-sm text-white/80">Plano Atual</div>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-black text-white">
                  {subscription?.current || 0}
                </div>
                <div className="text-sm text-white/80">Orçamentos Usados</div>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-black text-white">
                  {subscription?.max || '∞'}
                </div>
                <div className="text-sm text-white/80">Limite Mensal</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 mb-12 border-2 border-orange-500">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 text-center">
            🎁 Ao fazer upgrade você ganha:
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="text-2xl">📈</div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                  Mais Orçamentos
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  De 3 para 50 orçamentos/mês (ou ilimitado!)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">👥</div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                  Clientes Ilimitados
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Cadastre quantos clientes quiser
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">📊</div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                  Histórico Completo
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Acesse todos os orçamentos já criados
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">📈</div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                  Dashboard de Analytics
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Veja estatísticas e insights
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/pricing"
            className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black py-4 px-8 rounded-xl text-lg transition-all shadow-lg hover:scale-105"
          >
            Ver Planos e Preços 🚀
          </Link>
          <p className="text-slate-400 mt-4 text-sm">
            Escolha o plano ideal para o seu negócio
          </p>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/calculator"
            className="text-orange-500 hover:text-orange-400 font-bold"
          >
            ← Voltar para a calculadora
          </Link>
        </div>
      </div>
    </main>
  );
}
