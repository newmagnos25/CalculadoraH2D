'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useSubscription } from '@/lib/hooks/useSubscription';

export default function AccountSettings() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const { subscription, refresh } = useSubscription();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/auth/login');
      return;
    }

    setUser(user);
    setFullName(user.user_metadata?.full_name || '');
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    const supabase = createClient();

    // Atualizar metadata do usuário
    const { error: authError } = await supabase.auth.updateUser({
      data: { full_name: fullName }
    });

    if (authError) {
      setMessage({ type: 'error', text: 'Erro ao atualizar dados: ' + authError.message });
      setSaving(false);
      return;
    }

    // Atualizar na tabela profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', user?.id);

    if (profileError) {
      setMessage({ type: 'error', text: 'Erro ao atualizar perfil: ' + profileError.message });
      setSaving(false);
      return;
    }

    setMessage({ type: 'success', text: 'Dados atualizados com sucesso!' });
    setSaving(false);

    // Reload user data
    setTimeout(() => {
      loadUserData();
      window.location.reload();
    }, 1500);
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Tem certeza que deseja cancelar sua assinatura? Você perderá acesso aos recursos premium.')) {
      return;
    }

    setCanceling(true);
    setMessage(null);

    const supabase = createClient();

    // Cancelar via RPC function (vamos criar depois)
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'canceled',
        canceled_at: new Date().toISOString()
      })
      .eq('user_id', user?.id);

    if (error) {
      setMessage({ type: 'error', text: 'Erro ao cancelar assinatura: ' + error.message });
      setCanceling(false);
      return;
    }

    setMessage({ type: 'success', text: 'Assinatura cancelada. Você ainda tem acesso até o fim do período pago.' });
    setCanceling(false);

    // Recarregar subscription
    setTimeout(() => {
      refresh();
      window.location.reload();
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600 dark:text-slate-400">Carregando...</div>
      </div>
    );
  }

  const tierColors: { [key: string]: string } = {
    free: 'from-slate-500 to-slate-600',
    test: 'from-yellow-500 to-yellow-600',
    starter: 'from-blue-500 to-blue-600',
    professional: 'from-purple-500 to-purple-600',
    enterprise: 'from-orange-500 to-orange-600',
    lifetime: 'from-green-500 to-green-600',
  };

  const tierColor = subscription ? tierColors[subscription.tier] || 'from-slate-500 to-slate-600' : 'from-slate-500 to-slate-600';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg border-2 ${
            message.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-800 dark:text-green-200'
              : 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-800 dark:text-red-200'
          }`}>
            {message.type === 'success' ? '✅' : '❌'} {message.text}
          </div>
        )}

        {/* Personal Info */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border-2 border-orange-200 dark:border-orange-900 p-6">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">
            👤 Informações Pessoais
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:outline-none"
                placeholder="Seu nome"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                E-mail
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 cursor-not-allowed"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                ℹ️ O e-mail não pode ser alterado
              </p>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:from-slate-500 disabled:to-slate-600 text-white font-black py-3 px-6 rounded-lg transition-all shadow-lg disabled:cursor-not-allowed"
            >
              {saving ? 'Salvando...' : '💾 Salvar Alterações'}
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Subscription Info */}
        {subscription && (
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border-2 border-orange-200 dark:border-orange-900 p-6">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">
              💎 Minha Assinatura
            </h3>

            <div className={`bg-gradient-to-r ${tierColor} rounded-lg p-4 text-white mb-4`}>
              <div className="text-center mb-3">
                <div className="text-3xl mb-2">
                  {subscription.tier === 'free' && '🆓'}
                  {subscription.tier === 'test' && '🧪'}
                  {subscription.tier === 'starter' && '⭐'}
                  {subscription.tier === 'professional' && '💎'}
                  {subscription.tier === 'enterprise' && '🏢'}
                  {subscription.tier === 'lifetime' && '♾️'}
                </div>
                <div className="text-xl font-black">
                  {subscription.tier.toUpperCase()}
                </div>
              </div>

              {!subscription.is_unlimited && (
                <div className="bg-white/20 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold">Orçamentos:</span>
                    <span className="text-lg font-black">
                      {subscription.current} / {subscription.max}
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-white rounded-full h-2 transition-all"
                      style={{ width: `${subscription.max ? Math.min((subscription.current / subscription.max) * 100, 100) : 0}%` }}
                    />
                  </div>
                </div>
              )}

              {subscription.is_unlimited && (
                <div className="bg-white/20 rounded-lg p-3 text-center">
                  <div className="text-2xl font-black">♾️</div>
                  <div className="text-xs font-bold">Ilimitado</div>
                </div>
              )}
            </div>

            {subscription.tier === 'free' && (
              <Link
                href="/pricing"
                className="block w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-black py-3 px-6 rounded-lg transition-all shadow-lg text-center text-sm"
              >
                ⚡ Fazer Upgrade
              </Link>
            )}

            {subscription.tier !== 'free' && (
              <div className="space-y-3">
                <div className="text-center text-xs text-slate-600 dark:text-slate-400">
                  Obrigado por ser um usuário {subscription.tier.toUpperCase()}!
                </div>
                <button
                  onClick={handleCancelSubscription}
                  disabled={canceling}
                  className="w-full px-4 py-2 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {canceling ? '⏳ Cancelando...' : '❌ Cancelar Assinatura'}
                </button>
                <p className="text-xs text-center text-slate-500 dark:text-slate-400">
                  Você manterá acesso até o fim do período pago
                </p>
              </div>
            )}
          </div>
        )}

        {/* Quick Stats */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border-2 border-blue-200 dark:border-blue-900 p-6">
          <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">
            📊 Estatísticas
          </h3>

          {subscription && (
            <div className="space-y-3">
              {!subscription.is_unlimited && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400 text-sm">Usados:</span>
                    <span className="text-slate-900 dark:text-white font-bold">
                      {subscription.current}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400 text-sm">Restantes:</span>
                    <span className="text-orange-600 dark:text-orange-400 font-bold">
                      {subscription.remaining}
                    </span>
                  </div>
                </>
              )}

              {subscription.is_unlimited && (
                <div className="text-center py-2">
                  <span className="text-green-600 dark:text-green-400 font-bold">
                    ♾️ Ilimitados
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border-2 border-purple-200 dark:border-purple-900 p-6">
          <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">
            🔗 Acesso Rápido
          </h3>

          <div className="space-y-2">
            <Link
              href="/calculator"
              className="block px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg text-sm font-semibold transition-all"
            >
              🧮 Calculadora
            </Link>
            <Link
              href="/pricing"
              className="block px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg text-sm font-semibold transition-all"
            >
              💎 Ver Planos
            </Link>
            {subscription && subscription.tier === 'free' && (
              <Link
                href="/upgrade"
                className="block px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-lg text-sm font-bold transition-all text-center"
              >
                ⚡ Fazer Upgrade
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
