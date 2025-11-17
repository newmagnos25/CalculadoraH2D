'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TIER_CONFIGS, SubscriptionTier } from '@/lib/types/database';

interface CheckoutPageProps {
  params: Promise<{
    tier: string;
  }>;
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const resolvedParams = use(params);
  const tier = resolvedParams.tier as SubscriptionTier;
  const router = useRouter();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tierConfig = TIER_CONFIGS[tier];

  // Redirect if invalid tier
  useEffect(() => {
    if (!tierConfig) {
      router.push('/pricing');
    }
  }, [tierConfig, router]);

  if (!tierConfig) {
    return null;
  }

  const price = billingCycle === 'monthly' ? tierConfig.price_monthly : tierConfig.price_yearly;
  const savings = billingCycle === 'yearly'
    ? ((tierConfig.price_monthly * 12) - tierConfig.price_yearly).toFixed(2)
    : 0;

  const handleCheckout = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // Call API to create Mercado Pago preference
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier,
          billing_cycle: billingCycle,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar pagamento');
      }

      // Redirect to Mercado Pago checkout
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        throw new Error('Link de pagamento não gerado');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Erro ao processar pagamento');
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/pricing" className="inline-block mb-6 text-orange-500 hover:text-orange-400 transition-colors">
            ← Voltar para Planos
          </Link>
          <h1 className="text-4xl font-black text-white mb-2">
            Finalizar Assinatura
          </h1>
          <p className="text-slate-400">
            Você está quase lá! Complete sua assinatura do plano {tierConfig.name}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Plan Details */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border-2 border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">
              Resumo do Pedido
            </h2>

            {/* Plan Name */}
            <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold text-slate-700 dark:text-slate-300">
                  Plano {tierConfig.name}
                </span>
                <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-sm font-bold">
                  {tier === 'professional' && '🔥 Mais Popular'}
                  {tier === 'lifetime' && '💎 Melhor Valor'}
                  {tier === 'starter' && '🚀 Starter'}
                  {tier === 'enterprise' && '⭐ Enterprise'}
                </span>
              </div>
            </div>

            {/* Billing Cycle Selector */}
            {tier !== 'lifetime' && (
              <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                  Ciclo de Cobrança
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      billingCycle === 'monthly'
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                        : 'border-slate-300 dark:border-slate-700 hover:border-orange-300'
                    }`}
                  >
                    <div className="text-sm font-bold text-slate-900 dark:text-white">Mensal</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      R$ {tierConfig.price_monthly.toFixed(2)}/mês
                    </div>
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`p-4 rounded-lg border-2 transition-all relative ${
                      billingCycle === 'yearly'
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                        : 'border-slate-300 dark:border-slate-700 hover:border-orange-300'
                    }`}
                  >
                    <div className="absolute -top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                      Economize 17%
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">Anual</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      R$ {tierConfig.price_yearly.toFixed(2)}/ano
                    </div>
                  </button>
                </div>
                {billingCycle === 'yearly' && (
                  <div className="mt-3 text-sm text-green-600 dark:text-green-400 font-semibold">
                    💰 Você economiza R$ {savings} por ano!
                  </div>
                )}
              </div>
            )}

            {/* Features List */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                O que está incluído:
              </h3>
              <ul className="space-y-2">
                {tierConfig.max_quotes !== undefined ? (
                  <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Até {tierConfig.max_quotes} orçamentos/mês</span>
                  </li>
                ) : (
                  <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span className="font-semibold">Orçamentos ilimitados</span>
                  </li>
                )}
                {tierConfig.max_clients !== undefined ? (
                  <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Até {tierConfig.max_clients} clientes</span>
                  </li>
                ) : (
                  <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span className="font-semibold">Clientes ilimitados</span>
                  </li>
                )}
                {tierConfig.features.quote_history && (
                  <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Histórico completo de orçamentos</span>
                  </li>
                )}
                {tierConfig.features.dashboard && (
                  <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Dashboard de analytics</span>
                  </li>
                )}
                {tierConfig.features.white_label && (
                  <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span className="font-semibold">White-label (sem marca)</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Total */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold text-slate-900 dark:text-white">Total</span>
                <span className="text-2xl font-black text-orange-600 dark:text-orange-400">
                  R$ {price.toFixed(2)}
                </span>
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {tier === 'lifetime' ? 'Pagamento único' : `Cobrado ${billingCycle === 'monthly' ? 'mensalmente' : 'anualmente'}`}
              </div>
            </div>
          </div>

          {/* Right Column - Payment */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border-2 border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">
              Pagamento
            </h2>

            {/* Payment Methods */}
            <div className="mb-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Você será redirecionado para o <strong>Mercado Pago</strong> para finalizar o pagamento de forma segura.
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border-2 border-blue-200 dark:border-blue-800 mb-4">
                <h3 className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-2">
                  💳 Formas de Pagamento Aceitas:
                </h3>
                <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <span>💳</span> Cartão de Crédito (até 12x)
                  </li>
                  <li className="flex items-center gap-2">
                    <span>⚡</span> PIX (aprovação instantânea)
                  </li>
                  <li className="flex items-center gap-2">
                    <span>📄</span> Boleto Bancário
                  </li>
                </ul>
              </div>

              {tier === 'professional' && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border-2 border-green-200 dark:border-green-800 mb-4">
                  <h3 className="text-sm font-bold text-green-900 dark:text-green-100 mb-1">
                    🎉 Teste Grátis por 7 Dias
                  </h3>
                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    Você não será cobrado agora. Teste gratuitamente por 7 dias e cancele quando quiser!
                  </p>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-200">
                  ❌ {error}
                </p>
              </div>
            )}

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:from-slate-400 disabled:to-slate-500 text-white font-black py-4 px-6 rounded-lg transition-all shadow-lg disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processando...
                </span>
              ) : (
                'Ir para Pagamento'
              )}
            </button>

            {/* Security Info */}
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-start gap-3 text-xs text-slate-600 dark:text-slate-400">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div>
                  <p className="font-semibold mb-1">Pagamento 100% Seguro</p>
                  <p>Seus dados são protegidos pelo Mercado Pago com criptografia SSL de 256 bits</p>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="mt-4 text-xs text-center text-slate-500 dark:text-slate-500">
              Ao continuar, você concorda com nossos{' '}
              <Link href="/terms" className="text-orange-500 hover:underline">
                Termos de Serviço
              </Link>{' '}
              e{' '}
              <Link href="/privacy" className="text-orange-500 hover:underline">
                Política de Privacidade
              </Link>
            </div>
          </div>
        </div>

        {/* Guarantee Section */}
        <div className="mt-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-black text-white mb-3">
            🛡️ Garantia de 30 Dias
          </h3>
          <p className="text-white/90 max-w-2xl mx-auto">
            Se você não estiver satisfeito com o Precifica3D PRO, devolvemos 100% do seu dinheiro.
            Sem perguntas, sem complicação.
          </p>
        </div>
      </div>
    </main>
  );
}
