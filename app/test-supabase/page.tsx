'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function TestSupabasePage() {
  const [status, setStatus] = useState<any>({
    configured: false,
    connected: false,
    error: null,
    url: '',
    hasKey: false,
  });

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Check env vars
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      setStatus((prev: any) => ({
        ...prev,
        url: url || 'NOT SET',
        hasKey: !!key,
        configured: !!url && !!key,
      }));

      if (!url || !key) {
        setStatus((prev: any) => ({
          ...prev,
          error: 'Variáveis de ambiente não configuradas',
        }));
        return;
      }

      // Test connection
      const supabase = createClient();

      // Try to ping the database
      const { data, error } = await supabase.from('profiles').select('count').limit(1);

      if (error) {
        setStatus((prev: any) => ({
          ...prev,
          connected: false,
          error: error.message,
        }));
      } else {
        setStatus((prev: any) => ({
          ...prev,
          connected: true,
        }));
      }
    } catch (err: any) {
      setStatus((prev: any) => ({
        ...prev,
        error: err.message,
      }));
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-900 p-8">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl font-black text-white mb-6">
          🔧 Teste de Conexão Supabase
        </h1>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {status.configured ? '✅' : '❌'}
            </span>
            <div>
              <div className="font-bold text-slate-900 dark:text-white">
                Configuração
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {status.configured ? 'Variáveis configuradas' : 'Variáveis não configuradas'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {status.connected ? '✅' : '❌'}
            </span>
            <div>
              <div className="font-bold text-slate-900 dark:text-white">
                Conexão
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {status.connected ? 'Conectado ao Supabase' : 'Não conectado'}
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">
              Detalhes:
            </h3>
            <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded text-xs overflow-auto">
              {JSON.stringify(status, null, 2)}
            </pre>
          </div>

          {status.error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded p-4">
              <div className="font-bold text-red-800 dark:text-red-200 mb-1">
                ❌ Erro:
              </div>
              <div className="text-sm text-red-700 dark:text-red-300">
                {status.error}
              </div>
            </div>
          )}

          <button
            onClick={testConnection}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-all"
          >
            🔄 Testar Novamente
          </button>
        </div>

        <div className="mt-6 bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-500 rounded-xl p-6">
          <h3 className="font-bold text-orange-900 dark:text-orange-200 mb-3">
            📋 Checklist de Configuração:
          </h3>
          <ul className="space-y-2 text-sm text-orange-800 dark:text-orange-300">
            <li>✓ Arquivo .env.local existe no projeto</li>
            <li>✓ NEXT_PUBLIC_SUPABASE_URL está definida</li>
            <li>✓ NEXT_PUBLIC_SUPABASE_ANON_KEY está definida</li>
            <li>⚠️ Execute o schema.sql no Supabase SQL Editor</li>
            <li>⚠️ Desabilite confirmação de email em Authentication &gt; Providers &gt; Email</li>
            <li>⚠️ Reinicie o servidor dev (npm run dev)</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
