'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function CheckoutPendingContent() {
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
        {/* Pending Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 md:p-12 text-center shadow-2xl border-2 border-yellow-500">
          {/* Pending Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
            ⏳ Pagamento Pendente
          </h1>

          {/* Message */}
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            Seu pagamento está sendo processado. Você receberá uma confirmação por email assim que for aprovado.
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
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                Guarde este número para referência
              </p>
            </div>
          )}

          {/* Payment Methods Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 mb-8 text-left border-2 border-blue-200 dark:border-blue-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              ℹ️ Tempo de Aprovação:
            </h2>
            <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <p className="font-semibold">PIX</p>
                  <p className="text-xs">Aprovação em até 1 hora após o pagamento</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">📄</span>
                <div>
                  <p className="font-semibold">Boleto Bancário</p>
                  <p className="text-xs">Aprovação em até 2 dias úteis após o pagamento</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">💳</span>
                <div>
                  <p className="font-semibold">Cartão de Crédito</p>
                  <p className="text-xs">Geralmente aprovado em minutos, mas pode levar até 24h</p>
                </div>
              </li>
            </ul>
          </div>

          {/* What happens next */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6 mb-8 text-left border-2 border-green-200 dark:border-green-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              ✅ O que acontece agora:
            </h2>
            <ol className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <span>Aguarde a confirmação do pagamento pela instituição financeira</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <span>Você receberá um email de confirmação assim que for aprovado</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <span>Seu acesso ao Precifica3D PRO será ativado automaticamente</span>
              </li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/calculator"
              className="block w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-lg text-center"
            >
              Ir para Calculadora
            </Link>
            <a
              href="mailto:suporte@calculadorah2d.com"
              className="block w-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold py-4 px-6 rounded-lg transition-all text-center"
            >
              Preciso de Ajuda
            </a>
          </div>

          {/* Important Note */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Importante:</strong> Não efetue o pagamento novamente. Aguarde a confirmação do pagamento atual.
            </p>
          </div>
        </div>

        {/* Check Status */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-400">
            Você pode verificar o status do seu pagamento a qualquer momento acessando seu{' '}
            <Link href="/settings" className="text-orange-500 hover:underline">
              painel de controle
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPendingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-slate-950 to-slate-900"><p className="text-white">Carregando...</p></div>}>
      <CheckoutPendingContent />
    </Suspense>
  );
}
