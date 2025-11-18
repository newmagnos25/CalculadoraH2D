'use client';

import { useState } from 'react';

export default function AdminActivatePage() {
  const [activeTab, setActiveTab] = useState<'confirm' | 'activate'>('confirm');

  // Confirm Email States
  const [confirmEmail, setConfirmEmail] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmResult, setConfirmResult] = useState<any>(null);

  // Activate Plan States
  const [email, setEmail] = useState('');
  const [tier, setTier] = useState('test');
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Shared
  const [adminSecret, setAdminSecret] = useState('admin-secret-2024');

  const handleConfirmEmail = async () => {
    setConfirmLoading(true);
    setConfirmResult(null);

    try {
      const response = await fetch('/api/admin/confirm-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminSecret}`
        },
        body: JSON.stringify({
          email: confirmEmail
        })
      });

      const data = await response.json();
      setConfirmResult({
        success: response.ok,
        data,
        status: response.status
      });
    } catch (error: any) {
      setConfirmResult({
        success: false,
        error: error.message
      });
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleActivate = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/admin/activate-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminSecret}`
        },
        body: JSON.stringify({
          user_email: email,
          tier,
          days: parseInt(days.toString())
        })
      });

      const data = await response.json();
      setResult({
        success: response.ok,
        data,
        status: response.status
      });
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border-2 border-orange-500 shadow-2xl">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
            🔧 Admin: Gerenciar Contas
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Confirme emails e ative planos manualmente
          </p>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b-2 border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('confirm')}
              className={`px-6 py-3 font-bold transition-all relative ${
                activeTab === 'confirm'
                  ? 'text-orange-500'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              ✉️ Confirmar Email
              {activeTab === 'confirm' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('activate')}
              className={`px-6 py-3 font-bold transition-all relative ${
                activeTab === 'activate'
                  ? 'text-orange-500'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              🎯 Ativar Plano
              {activeTab === 'activate' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
              )}
            </button>
          </div>

          {/* Tab Content: Confirm Email */}
          {activeTab === 'confirm' && (
            <div className="space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 font-semibold">
                  ⚠️ Use esta função quando o email de confirmação do Supabase não chegar.
                  Confirme manualmente para permitir que o usuário faça login.
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Email do Usuário
                </label>
                <input
                  type="email"
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Senha Admin
                </label>
                <input
                  type="password"
                  value={adminSecret}
                  onChange={(e) => setAdminSecret(e.target.value)}
                  placeholder="admin-secret-2024"
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:outline-none"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Senha padrão: admin-secret-2024
                </p>
              </div>

              <button
                onClick={handleConfirmEmail}
                disabled={confirmLoading || !confirmEmail}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-slate-400 disabled:to-slate-500 text-white font-black py-4 px-6 rounded-lg transition-all shadow-lg disabled:cursor-not-allowed"
              >
                {confirmLoading ? '⏳ Confirmando...' : '✅ Confirmar Email'}
              </button>

              {confirmResult && (
                <div className={`mt-6 p-4 rounded-lg border-2 ${
                  confirmResult.success
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-500'
                }`}>
                  <h3 className={`font-bold mb-2 ${
                    confirmResult.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                  }`}>
                    {confirmResult.success ? '✅ Sucesso!' : '❌ Erro'}
                  </h3>
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(confirmResult.data || confirmResult.error, null, 2)}
                  </pre>
                </div>
              )}

              <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border-2 border-blue-500">
                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">
                  ℹ️ Como Confirmar Email
                </h3>
                <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                  <li><strong>1.</strong> Usuário cria conta mas não recebe email de confirmação</li>
                  <li><strong>2.</strong> Digite o email EXATO que ele usou para cadastrar</li>
                  <li><strong>3.</strong> Digite a senha admin</li>
                  <li><strong>4.</strong> Clique em "Confirmar Email"</li>
                  <li><strong>5.</strong> Pronto! O usuário já pode fazer login normalmente</li>
                </ol>
              </div>
            </div>
          )}

          {/* Tab Content: Activate Plan */}
          {activeTab === 'activate' && (
            <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Email do Usuário
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemplo.com"
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:outline-none"
              />
            </div>

            {/* Tier */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Plano
              </label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:outline-none"
              >
                <option value="test">Teste (R$ 2,99)</option>
                <option value="starter">Starter (R$ 19,90)</option>
                <option value="professional">Professional (R$ 49,90)</option>
                <option value="enterprise">Enterprise (R$ 99,90)</option>
                <option value="lifetime">Lifetime (R$ 1.497,00)</option>
              </select>
            </div>

            {/* Days */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Dias de Acesso
              </label>
              <input
                type="number"
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                min="1"
                max="36500"
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:outline-none"
              />
              <p className="text-xs text-slate-500 mt-1">
                Para plano teste: 7 dias | Para mensal: 30 dias | Para anual: 365 dias
              </p>
            </div>

            {/* Admin Secret */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Senha Admin
              </label>
              <input
                type="password"
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                placeholder="admin-secret-2024"
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:outline-none"
              />
              <p className="text-xs text-slate-500 mt-1">
                Senha padrão: admin-secret-2024 (mude no .env depois)
              </p>
            </div>

              {/* Button */}
              <button
                onClick={handleActivate}
                disabled={loading || !email}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:from-slate-400 disabled:to-slate-500 text-white font-black py-4 px-6 rounded-lg transition-all shadow-lg disabled:cursor-not-allowed"
              >
                {loading ? '⏳ Ativando...' : '✅ Ativar Plano'}
              </button>

              {/* Result */}
              {result && (
                <div className={`mt-6 p-4 rounded-lg border-2 ${
                  result.success
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-500'
                }`}>
                  <h3 className={`font-bold mb-2 ${
                    result.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                  }`}>
                    {result.success ? '✅ Sucesso!' : '❌ Erro'}
                  </h3>
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(result.data || result.error, null, 2)}
                  </pre>
                </div>
              )}

              {/* Info Card */}
              <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border-2 border-blue-500">
                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">
                  ℹ️ Como Ativar Plano
                </h3>
                <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                  <li><strong>1.</strong> Digite o email exato que a pessoa usou para criar conta</li>
                  <li><strong>2.</strong> Escolha o plano (test = R$ 2,99)</li>
                  <li><strong>3.</strong> Configure os dias (7 para teste)</li>
                  <li><strong>4.</strong> Clique em "Ativar Plano"</li>
                  <li><strong>5.</strong> Se der sucesso, a pessoa já pode usar!</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
