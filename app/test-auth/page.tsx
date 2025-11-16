'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function TestAuthPage() {
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const testConnection = async () => {
    setStatus('Testando conexão...');
    setError('');

    try {
      const supabase = createClient();

      // Verificar variáveis de ambiente
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      setStatus(`URL: ${url}\nKey: ${key ? 'Configurada ✓' : 'NÃO configurada ✗'}`);

      // Tentar pegar sessão atual
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        setError(`Erro ao pegar sessão: ${sessionError.message}`);
        return;
      }

      setStatus(prev => prev + `\n\nSessão: ${session ? 'Logado ✓' : 'Não logado'}`);

      // Testar signup com email fake
      setStatus(prev => prev + '\n\nTestando signup...');
      const testEmail = `test-${Date.now()}@test.com`;
      const { data, error: signupError } = await supabase.auth.signUp({
        email: testEmail,
        password: '123456',
      });

      if (signupError) {
        setError(`Erro no signup: ${signupError.message}`);
        return;
      }

      setStatus(prev => prev + `\n\n✅ SUCESSO! Conexão com Supabase OK!\nEmail de teste: ${testEmail}`);

    } catch (err: any) {
      setError(`Erro inesperado: ${err.message}`);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-white mb-8">
          🔧 Teste de Autenticação
        </h1>

        <button
          onClick={testConnection}
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg mb-8"
        >
          Testar Conexão com Supabase
        </button>

        {status && (
          <div className="bg-slate-800 rounded-lg p-6 mb-4">
            <h2 className="text-green-400 font-bold mb-2">Status:</h2>
            <pre className="text-white whitespace-pre-wrap">{status}</pre>
          </div>
        )}

        {error && (
          <div className="bg-red-900/50 border-2 border-red-500 rounded-lg p-6">
            <h2 className="text-red-400 font-bold mb-2">Erro:</h2>
            <pre className="text-white whitespace-pre-wrap">{error}</pre>
          </div>
        )}

        <div className="bg-blue-900/50 border-2 border-blue-500 rounded-lg p-6 mt-8">
          <h2 className="text-blue-400 font-bold mb-4">ℹ️ Instruções:</h2>
          <ol className="text-white space-y-2 list-decimal list-inside">
            <li>Clique no botão "Testar Conexão"</li>
            <li>Aguarde o resultado</li>
            <li>Se der erro, tire screenshot e me mostre</li>
            <li>Se funcionar, o problema está na Vercel (variáveis de ambiente)</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
