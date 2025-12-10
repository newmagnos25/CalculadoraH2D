'use client';

import Link from 'next/link';
import { TIER_CONFIGS } from '@/lib/types/database';

export default function PricingPage() {
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-black via-slate-900 to-black border-b-4 border-orange-500 shadow-2xl">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center gap-6">
            <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity cursor-pointer">
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
                  💰 Escolha Seu Plano
                </p>
              </div>
            </Link>
            <p className="text-xl text-orange-300 max-w-2xl text-center">
              Profissionalize sua precificação de impressão 3D com as melhores ferramentas do mercado
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="container mx-auto px-4 py-16">
        {/* Free Banner */}
        <div className="max-w-4xl mx-auto mb-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-8 text-center shadow-2xl">
          <h2 className="text-3xl font-black text-white mb-3">
            🎉 Comece GRÁTIS - Sem Cartão de Crédito
          </h2>
          <p className="text-xl text-white/90 mb-4">
            5 orçamentos por mês que renovam automaticamente. Sempre grátis!
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-8 py-3 bg-white text-green-600 font-black rounded-lg hover:bg-gray-100 transition-all shadow-lg text-lg mr-4"
          >
            Criar Conta Grátis
          </Link>
        </div>

        {/* Trial Banner */}
        <div className="max-w-4xl mx-auto mb-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-center shadow-2xl border-2 border-blue-300">
          <h3 className="text-2xl font-black text-white mb-2">
            💡 Quer testar recursos profissionais?
          </h3>
          <p className="text-lg text-white/90 mb-3">
            Teste o plano Professional por 7 dias pagando apenas R$ 2,99
          </p>
          <Link
            href="/checkout/test"
            className="inline-block px-6 py-2 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-all shadow-lg"
          >
            Testar por R$ 2,99
          </Link>
          <p className="text-xs text-white/70 mt-2">
            Pagamento único • Sem renovação automática • Cancele quando quiser
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {/* FREE Plan */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border-2 border-green-200 dark:border-green-900 p-8 flex flex-col">
            <div className="mb-6">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                FREE
              </h3>
              <div className="text-4xl font-black text-green-600 dark:text-green-400 mb-2">
                R$ 0
                <span className="text-lg font-normal text-slate-600 dark:text-slate-400">/mês</span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
                Sempre grátis
              </p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-slate-700 dark:text-slate-300 font-semibold">5 orçamentos/mês</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-slate-700 dark:text-slate-300">Renova todo mês</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-slate-700 dark:text-slate-300">Geração de PDFs</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-slate-700 dark:text-slate-300">Sem cartão de crédito</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-400 dark:text-slate-600">
                <span className="mt-0.5">✗</span>
                <span>Sem gestão de clientes</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-400 dark:text-slate-600">
                <span className="mt-0.5">✗</span>
                <span>Sem histórico</span>
              </li>
            </ul>

            <Link
              href="/auth/signup"
              className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-center transition-all"
            >
              Começar Grátis
            </Link>
          </div>

          {/* Starter Plan */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border-2 border-blue-200 dark:border-blue-900 p-8 flex flex-col">
            <div className="mb-6">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                Starter
              </h3>
              <div className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-2">
                {formatPrice(TIER_CONFIGS.starter.price_monthly)}
                <span className="text-lg font-normal text-slate-600 dark:text-slate-400">/mês</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                ou {formatPrice(TIER_CONFIGS.starter.price_yearly)}/ano (economize 17%)
              </p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-slate-700 dark:text-slate-300">Até 50 orçamentos/mês</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-slate-700 dark:text-slate-300">Até 20 clientes</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-slate-700 dark:text-slate-300">1 empresa</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-slate-700 dark:text-slate-300">Geração de PDFs</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-slate-700 dark:text-slate-300">Suporte por email</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-400 dark:text-slate-600">
                <span className="mt-0.5">✗</span>
                <span>Sem histórico de orçamentos</span>
              </li>
            </ul>

            <Link
              href="/checkout/starter"
              className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-center transition-all"
            >
              Começar Agora
            </Link>
          </div>

          {/* Professional Plan (Most Popular) */}
          <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-2xl border-4 border-amber-300 p-8 flex flex-col relative transform lg:scale-105">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 px-4 py-1 rounded-full border-2 border-amber-300 shadow-lg">
              <span className="text-sm font-black text-orange-600 dark:text-orange-400">MAIS POPULAR</span>
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-black text-white mb-2">
                Professional
              </h3>
              <div className="text-4xl font-black text-white mb-2">
                {formatPrice(TIER_CONFIGS.professional.price_monthly)}
                <span className="text-lg font-normal text-white/80">/mês</span>
              </div>
              <p className="text-sm text-white/80">
                ou {formatPrice(TIER_CONFIGS.professional.price_yearly)}/ano (economize 17%)
              </p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-start gap-2 text-sm">
                <span className="text-white mt-0.5">✓</span>
                <span className="text-white font-semibold">Orçamentos ilimitados</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-white mt-0.5">✓</span>
                <span className="text-white font-semibold">Clientes ilimitados</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-white mt-0.5">✓</span>
                <span className="text-white font-semibold">Até 3 empresas</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-white mt-0.5">✓</span>
                <span className="text-white font-semibold">Histórico completo</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-white mt-0.5">✓</span>
                <span className="text-white font-semibold">Dashboard de analytics</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-white mt-0.5">✓</span>
                <span className="text-white font-semibold">Exportação de dados</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-white mt-0.5">✓</span>
                <span className="text-white font-semibold">Suporte prioritário</span>
              </li>
            </ul>

            <Link
              href="/checkout/professional"
              className="block w-full bg-white hover:bg-slate-100 text-orange-600 font-black py-3 px-6 rounded-lg text-center transition-all shadow-lg"
            >
              Começar Agora
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border-2 border-purple-200 dark:border-purple-900 p-8 flex flex-col">
            <div className="mb-6">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                Enterprise
              </h3>
              <div className="text-4xl font-black text-purple-600 dark:text-purple-400 mb-2">
                {formatPrice(TIER_CONFIGS.enterprise.price_monthly)}
                <span className="text-lg font-normal text-slate-600 dark:text-slate-400">/mês</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                ou {formatPrice(TIER_CONFIGS.enterprise.price_yearly)}/ano (economize 17%)
              </p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-slate-700 dark:text-slate-300">Tudo do Professional +</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-slate-700 dark:text-slate-300 font-semibold">Empresas ilimitadas</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-slate-700 dark:text-slate-300 font-semibold">White-label</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-slate-700 dark:text-slate-300">Multi-usuários (até 5)</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-slate-700 dark:text-slate-300">API access</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-slate-700 dark:text-slate-300">Suporte dedicado</span>
              </li>
            </ul>

            <Link
              href="/checkout/enterprise"
              className="block w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg text-center transition-all"
            >
              Começar Agora
            </Link>
          </div>

          {/* Lifetime Plan */}
          <div className="bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl shadow-2xl border-4 border-yellow-300 p-8 flex flex-col">
            <div className="mb-6">
              <h3 className="text-2xl font-black text-slate-900 mb-2 flex items-center gap-2">
                Lifetime
                <span className="text-2xl">💎</span>
              </h3>
              <div className="text-4xl font-black text-slate-900 mb-2">
                {formatPrice(TIER_CONFIGS.lifetime.price_yearly)}
                <span className="text-lg font-normal text-slate-700">/único</span>
              </div>
              <p className="text-sm text-slate-700 font-semibold">
                Acesso vitalício, sem mensalidade
              </p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-start gap-2 text-sm">
                <span className="text-slate-900 mt-0.5">✓</span>
                <span className="text-slate-900">Tudo do Enterprise +</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-slate-900 mt-0.5">✓</span>
                <span className="text-slate-900 font-bold">Acesso vitalício</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-slate-900 mt-0.5">✓</span>
                <span className="text-slate-900 font-bold">Todas atualizações futuras</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-slate-900 mt-0.5">✓</span>
                <span className="text-slate-900">Prioridade máxima</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-slate-900 mt-0.5">✓</span>
                <span className="text-slate-900">Participação no roadmap</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-slate-900 mt-0.5">✓</span>
                <span className="text-slate-900 font-bold">Sem mensalidade NUNCA</span>
              </li>
            </ul>

            <Link
              href="/checkout/lifetime"
              className="block w-full bg-slate-900 hover:bg-black text-white font-black py-3 px-6 rounded-lg text-center transition-all shadow-lg"
            >
              Garantir Acesso Vitalício
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="text-3xl font-black text-white text-center mb-12">
            Perguntas Frequentes
          </h2>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border-2 border-orange-200 dark:border-orange-900">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Posso cancelar a qualquer momento?
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Sim! Você pode cancelar sua assinatura a qualquer momento. Não há multas ou taxas de cancelamento.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border-2 border-orange-200 dark:border-orange-900">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Qual a diferença entre o plano FREE e o teste de R$ 2,99?
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                O plano <strong>FREE</strong> é 100% gratuito para sempre, com 5 orçamentos/mês que renovam automaticamente. Não precisa cartão de crédito.
                <br/><br/>
                O <strong>teste de R$ 2,99</strong> dá acesso completo ao plano Professional por 7 dias, incluindo orçamentos ilimitados, gestão de clientes e analytics. É ideal para quem quer experimentar todos os recursos profissionais antes de assinar.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border-2 border-orange-200 dark:border-orange-900">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Posso mudar de plano depois?
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças são aplicadas imediatamente.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border-2 border-orange-200 dark:border-orange-900">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Quais formas de pagamento são aceitas?
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Aceitamos cartão de crédito, PIX e boleto bancário através do Mercado Pago.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-black via-slate-900 to-black border-t-4 border-orange-500 py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400">
            © 2025 Precifica3D PRO - Todos os direitos reservados
          </p>
        </div>
      </div>
    </main>
  );
}
