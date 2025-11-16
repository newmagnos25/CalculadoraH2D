'use client';

import Link from 'next/link';

export default function CheckoutFailurePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Failure Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 md:p-12 text-center shadow-2xl border-2 border-red-500">
          {/* Failure Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-rose-500 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
            Pagamento Não Aprovado
          </h1>

          {/* Message */}
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            Infelizmente seu pagamento não foi aprovado. Isso pode acontecer por diversos motivos.
          </p>

          {/* Common Reasons */}
          <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Motivos Comuns:
            </h2>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Dados do cartão incorretos (número, CVV, validade)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Saldo ou limite insuficiente</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Cartão bloqueado ou vencido</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Recusa do banco emissor</span>
              </li>
            </ul>
          </div>

          {/* What to do */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 mb-8 text-left border-2 border-blue-200 dark:border-blue-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              💡 O que fazer:
            </h2>
            <ol className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <span>Verifique os dados do seu cartão</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <span>Entre em contato com seu banco se necessário</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <span>Tente novamente ou use outra forma de pagamento (PIX, boleto)</span>
              </li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/pricing"
              className="block w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-lg text-center"
            >
              Tentar Novamente
            </Link>
            <Link
              href="/calculator"
              className="block w-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold py-4 px-6 rounded-lg transition-all text-center"
            >
              Voltar para Calculadora
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
      </div>
    </main>
  );
}
