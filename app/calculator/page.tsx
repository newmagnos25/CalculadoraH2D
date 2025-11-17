'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Calculator from '@/components/Calculator';
import { createClient } from '@/lib/supabase/client';
import { useSubscription } from '@/lib/hooks/useSubscription';

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { subscription, loading: subLoading } = useSubscription();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/auth/login?redirect=/calculator');
      return;
    }

    setIsAuthenticated(true);
    setLoading(false);
  };

  if (loading || subLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-semibold">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Verificar se não tem plano ou plano free sem acesso
  if (!subscription || (subscription.tier === 'free' && !subscription.allowed)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-900 flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 md:p-12 text-center shadow-2xl border-2 border-orange-500">
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
              🔒 Acesso Restrito
            </h1>

            {/* Message */}
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              {subscription?.tier === 'free' && subscription.current >= (subscription.max || 0) ? (
                <>
                  Você atingiu o limite de <strong>{subscription.max} orçamentos</strong> do plano FREE.
                  <br />
                  Faça upgrade para continuar usando!
                </>
              ) : (
                <>
                  Você precisa de um plano ativo para acessar a calculadora.
                  <br />
                  Escolha um plano e comece agora mesmo!
                </>
              )}
            </p>

            {/* Benefits */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 mb-8 text-left border-2 border-blue-200 dark:border-blue-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 text-center">
                🎁 O Que Você Ganha:
              </h2>
              <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</span>
                  <span>Cálculos precisos de custos de impressão 3D</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</span>
                  <span>PDFs profissionais para seus clientes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</span>
                  <span>Gestão completa de filamentos e custos</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</span>
                  <span>Suporte prioritário</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                href="/pricing"
                className="block w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-lg text-center"
              >
                🚀 Ver Planos
              </Link>
              <Link
                href="/settings"
                className="block w-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold py-4 px-6 rounded-lg transition-all text-center"
              >
                ⚙️ Configurações
              </Link>
            </div>

            {/* Trial Info */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                💡 <strong>Dica:</strong> Experimente nosso plano de teste por apenas <strong>R$ 2,99</strong> e tenha 7 dias de acesso completo!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-orange-50/30 dark:from-black dark:via-slate-950 dark:to-slate-900">
      {/* Header Premium - Preto com Laranja/Dourado */}
      <div className="bg-gradient-to-r from-black via-slate-900 to-black border-b-4 border-orange-500 shadow-2xl">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
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
                  Precificação Profissional para Impressão 3D
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/settings"
                className="flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-3 bg-white hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-orange-600 dark:text-orange-400 font-black text-xs sm:text-sm transition-all shadow-lg border-2 border-orange-400 dark:border-orange-500 hover:scale-105 hover:shadow-xl hover:border-orange-500 dark:hover:border-orange-400"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="hidden xs:inline">⚙️</span>
                <span className="hidden sm:inline">Configurações</span>
                <span className="sm:hidden">Config</span>
              </Link>
              <div className="text-right hidden md:block">
                <div className="text-orange-300 text-xs uppercase tracking-widest font-semibold">Powered by</div>
                <div className="text-2xl font-black bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent drop-shadow-md">
                  BKreativeLab
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Features - Botões Interativos */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 border-b-2 border-blue-200 dark:border-blue-900/50 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap justify-center gap-4">
            <div className="group px-5 py-3 bg-white dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-700 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-blue-900 dark:text-blue-100">Múltiplas Cores</span>
              </div>
            </div>

            <div className="group px-5 py-3 bg-white dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-700 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-blue-900 dark:text-blue-100">Filamentos Customizáveis</span>
              </div>
            </div>

            <div className="group px-5 py-3 bg-white dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-700 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-blue-900 dark:text-blue-100">Adereços Personalizados</span>
              </div>
            </div>

            <div className="group px-5 py-3 bg-white dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-700 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-blue-900 dark:text-blue-100">Tarifas Regionalizadas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Calculator isAuthenticated={true} />

        {/* Footer Premium - Preto com Laranja/Dourado */}
        <footer className="mt-16 pt-12 pb-8 bg-gradient-to-r from-black via-slate-900 to-black border-t-4 border-orange-500 rounded-t-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">Precifica3D</span>
              </h3>
              <p className="text-sm text-slate-300">
                Sistema profissional de precificação para impressão 3D com suporte completo para impressoras Bambu Lab.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-orange-400 mb-3 uppercase tracking-wider text-sm">Funcionalidades</h3>
              <ul className="text-sm text-slate-300 space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
                  Suporte para múltiplas cores
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
                  Filamentos customizáveis
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
                  Adereços e inserções
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
                  Cálculo preciso de energia
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-amber-400 mb-3 uppercase tracking-wider text-sm">Informações</h3>
              <ul className="text-sm text-slate-300 space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"></div>
                  Dados de energia: 01/2025
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"></div>
                  5 modelos Bambu Lab
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"></div>
                  32 distribuidoras Brasil
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"></div>
                  40+ itens de adereços
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-orange-900/50">
            <p className="text-sm text-slate-300 mb-2">
              © 2025 <strong className="text-transparent bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text font-black">BKreativeLab</strong> - Calculadora Profissional para Impressão 3D
            </p>
            <p className="text-xs text-orange-300/60">
              Desenvolvido com tecnologia Next.js e TailwindCSS
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
