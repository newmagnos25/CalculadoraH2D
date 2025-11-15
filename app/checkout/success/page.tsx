'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const [paymentId, setPaymentId] = useState<string | null>(null);

  useEffect(() => {
    // Get payment ID from URL params
    const id = searchParams.get('payment_id') || searchParams.get('collection_id');
    setPaymentId(id);
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 md:p-12 text-center shadow-2xl border-2 border-green-500">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
            🎉 Pagamento Aprovado!
          </h1>

          {/* Message */}
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            Obrigado pela sua assinatura! Seu acesso ao <strong className="text-orange-600">CalculadoraH2D PRO</strong> foi ativado com sucesso.
          </p>

          {/* Payment ID */}
          {paymentId && (
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 mb-8">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                ID do Pagamento
              </p>
              <p className="text-lg font-mono font-bold text-slate-900 dark:text-white">
                {paymentId}
              </p>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 mb-8 text-left border-2 border-blue-200 dark:border-blue-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              📋 Próximos Passos:
            </h2>
            <ol className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <span>Você receberá um email de confirmação com os detalhes da sua assinatura</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <span>Configure os dados da sua empresa nas Configurações</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <span>Comece a criar orçamentos profissionais agora mesmo!</span>
              </li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/"
              className="block w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-lg text-center"
            >
              Ir para Calculadora
            </Link>
            <Link
              href="/settings"
              className="block w-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold py-4 px-6 rounded-lg transition-all text-center"
            >
              Configurações
            </Link>
          </div>

          {/* Support */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Precisa de ajuda?{' '}
              <a href="mailto:suporte@calculadorah2d.com" className="text-orange-500 hover:underline font-semibold">
                Entre em contato
              </a>
            </p>
          </div>
        </div>

        {/* Invoice Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-400">
            A nota fiscal será enviada para seu email em até 48 horas
          </p>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-slate-950 to-slate-900"><p className="text-white">Carregando...</p></div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
