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
    <main className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-900 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Você atingiu o limite! 🚀
          </h1>
          <p className="text-xl text-orange-300">
            Faça upgrade para continuar criando orçamentos profissionais
          </p>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-8 mb-12 border-4 border-red-300">
          <div className="text-center">
            <h2 className="text-2xl font-black text-white mb-4">
              📊 Seu Uso Atual
            </h2>
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-black text-white">
                  {subscription?.tier.toUpperCase()}
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
            href="/"
            className="text-orange-500 hover:text-orange-400 font-bold"
          >
            ← Voltar para a calculadora
          </Link>
        </div>
      </div>
    </main>
  );
}
