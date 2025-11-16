'use client';

export default function TestePagamentoPage() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copiado! Cole no formulário do Mercado Pago.');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white mb-4">
            🧪 Guia de Teste de Pagamento
          </h1>
          <p className="text-xl text-orange-300">
            Use os dados abaixo para testar o pagamento no Mercado Pago
          </p>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-6 mb-8 border-4 border-red-300">
          <h2 className="text-2xl font-black text-white mb-3 flex items-center gap-2">
            ⚠️ IMPORTANTE: Não use dinheiro real!
          </h2>
          <p className="text-white text-lg">
            Você está em <strong>MODO TESTE</strong>. Apenas cartões de teste funcionam.
            Se tentar usar cartão real, não vai funcionar e pode gerar problemas.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 mb-8 border-2 border-orange-500">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">
            📋 Dados para Copiar e Colar
          </h2>

          <div className="space-y-4">
            {/* Email */}
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  E-mail:
                </label>
                <button
                  onClick={() => copyToClipboard('test_user@testuser.com')}
                  className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded text-sm font-bold"
                >
                  📋 Copiar
                </button>
              </div>
              <code className="text-lg text-orange-600 dark:text-orange-400 font-mono">
                test_user@testuser.com
              </code>
            </div>

            {/* Cartão */}
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Número do Cartão:
                </label>
                <button
                  onClick={() => copyToClipboard('5031433215406351')}
                  className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded text-sm font-bold"
                >
                  📋 Copiar
                </button>
              </div>
              <code className="text-lg text-orange-600 dark:text-orange-400 font-mono">
                5031 4332 1540 6351
              </code>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                (Pode colar com ou sem espaços)
              </p>
            </div>

            {/* Nome - CRÍTICO */}
            <div className="p-4 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 rounded-lg border-4 border-green-500">
              <div className="flex items-center justify-between mb-2">
                <label className="font-black text-green-900 dark:text-green-100 text-lg">
                  ⚠️ Nome do Titular (MUITO IMPORTANTE!):
                </label>
                <button
                  onClick={() => copyToClipboard('APRO')}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-black text-base"
                >
                  📋 Copiar APRO
                </button>
              </div>
              <code className="text-2xl text-green-700 dark:text-green-300 font-mono font-black">
                APRO
              </code>
              <div className="mt-3 p-3 bg-white dark:bg-slate-800 rounded">
                <p className="text-sm text-slate-700 dark:text-slate-300 font-bold mb-2">
                  🎯 O nome define o resultado:
                </p>
                <ul className="space-y-1 text-sm">
                  <li className="text-green-600">✅ APRO = Pagamento aprovado</li>
                  <li className="text-red-600">❌ OTHE = Pagamento rejeitado</li>
                  <li className="text-yellow-600">⏳ CONT = Pagamento pendente</li>
                </ul>
              </div>
            </div>

            {/* Vencimento */}
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Vencimento:
                </label>
                <button
                  onClick={() => copyToClipboard('11/30')}
                  className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded text-sm font-bold"
                >
                  📋 Copiar
                </button>
              </div>
              <code className="text-lg text-orange-600 dark:text-orange-400 font-mono">
                11/30
              </code>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-bold">
                ⚠️ NÃO é 11/25! É 11/30!
              </p>
            </div>

            {/* CVV */}
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Código de Segurança (CVV):
                </label>
                <button
                  onClick={() => copyToClipboard('123')}
                  className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded text-sm font-bold"
                >
                  📋 Copiar
                </button>
              </div>
              <code className="text-lg text-orange-600 dark:text-orange-400 font-mono">
                123
              </code>
            </div>

            {/* CPF */}
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  CPF:
                </label>
                <button
                  onClick={() => copyToClipboard('12345678909')}
                  className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded text-sm font-bold"
                >
                  📋 Copiar
                </button>
              </div>
              <code className="text-lg text-orange-600 dark:text-orange-400 font-mono">
                12345678909
              </code>
            </div>

            {/* Parcelas */}
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-2">
                Parcelas:
              </label>
              <code className="text-lg text-orange-600 dark:text-orange-400 font-mono">
                1x (à vista)
              </code>
            </div>
          </div>
        </div>

        {/* Checklist */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-black text-white mb-4">
            ✅ Checklist Antes de Clicar "Pagar"
          </h2>
          <div className="space-y-2 text-white">
            <div className="flex items-start gap-2">
              <span className="text-xl">☑️</span>
              <span>Preencheu o e-mail</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xl">☑️</span>
              <span>Número do cartão: 5031 4332 1540 6351</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-2xl">⚠️</span>
              <span className="font-black text-xl">Nome: APRO (4 letras maiúsculas)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xl">☑️</span>
              <span>Vencimento: 11/30 (NÃO 11/25!)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xl">☑️</span>
              <span>CVV: 123</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xl">☑️</span>
              <span>CPF: 12345678909</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xl">☑️</span>
              <span>Parcelas: 1x</span>
            </div>
          </div>
        </div>

        {/* Botão para pricing */}
        <div className="text-center">
          <a
            href="/pricing"
            className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-black py-4 px-8 rounded-xl text-lg transition-all shadow-lg"
          >
            🚀 Ir para Página de Preços
          </a>
          <p className="text-slate-400 mt-4 text-sm">
            Esta aba vai ficar aberta para você copiar os dados durante o teste
          </p>
        </div>
      </div>
    </main>
  );
}
