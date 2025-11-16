'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DebugPagamentoPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testCredentials = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/debug-checkout');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const createTestPreference = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/debug-checkout', {
        method: 'POST',
      });
      const data = await response.json();

      if (data.error) {
        setError(JSON.stringify(data, null, 2));
      } else {
        setResult(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6 text-orange-500 hover:text-orange-400 transition-colors">
            ← Voltar para Home
          </Link>
          <h1 className="text-4xl font-black text-white mb-4">
            🔍 Debug - Mercado Pago
          </h1>
          <p className="text-xl text-orange-300">
            Teste as credenciais e veja o que está acontecendo
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 mb-8 border-2 border-orange-500">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">
            Testes Disponíveis
          </h2>

          <div className="space-y-4">
            <button
              onClick={testCredentials}
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-400 text-white font-bold py-3 px-6 rounded-lg transition-all"
            >
              {loading ? '⏳ Testando...' : '1. Verificar Credenciais (GET)'}
            </button>

            <button
              onClick={createTestPreference}
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-slate-400 text-white font-bold py-3 px-6 rounded-lg transition-all"
            >
              {loading ? '⏳ Criando...' : '2. Criar Preferência de Teste (POST)'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 mb-8 border-2 border-red-500">
            <h3 className="text-xl font-black text-red-900 dark:text-red-100 mb-3">
              ❌ Erro
            </h3>
            <pre className="text-sm text-slate-700 dark:text-slate-300 overflow-x-auto bg-white dark:bg-slate-800 p-4 rounded">
              {error}
            </pre>
          </div>
        )}

        {result && (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 mb-8 border-2 border-green-500">
            <h3 className="text-xl font-black text-green-900 dark:text-green-100 mb-3">
              ✅ Resultado
            </h3>
            <pre className="text-sm text-slate-700 dark:text-slate-300 overflow-x-auto bg-white dark:bg-slate-800 p-4 rounded max-h-96">
              {JSON.stringify(result, null, 2)}
            </pre>

            {result.init_point && (
              <div className="mt-4">
                <a
                  href={result.init_point}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg"
                >
                  🚀 Abrir Checkout do Mercado Pago
                </a>
              </div>
            )}
          </div>
        )}

        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6">
          <h3 className="text-xl font-black text-white mb-3">
            📋 Como Usar
          </h3>
          <ol className="space-y-2 text-white">
            <li><strong>1.</strong> Clique em "Verificar Credenciais" para ver se as variáveis de ambiente estão configuradas</li>
            <li><strong>2.</strong> Clique em "Criar Preferência de Teste" para testar a criação de um pagamento</li>
            <li><strong>3.</strong> Se funcionar, clique em "Abrir Checkout" e teste com os cartões</li>
            <li><strong>4.</strong> Se der erro, copie a mensagem de erro e me mande</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
