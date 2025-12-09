'use client';

/**
 * AutoMigration Component
 * Detecta dados legados e migra automaticamente para Supabase
 * Executa apenas uma vez por usuário
 */

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  autoMigrateIfNeeded,
  hasLegacyData,
  getLegacyDataStats,
  type MigrationStatus,
} from '@/lib/migration';

export default function AutoMigration() {
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'checking' | 'migrating' | 'completed' | 'error'>('idle');
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkAndMigrate() {
      try {
        setMigrationStatus('checking');

        // Verificar autenticação
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          // Usuário não autenticado - não fazer nada
          setMigrationStatus('idle');
          return;
        }

        // Verificar se há dados legados
        const hasData = hasLegacyData();

        if (!hasData) {
          // Sem dados para migrar
          setMigrationStatus('completed');
          return;
        }

        // Mostrar estatísticas antes da migração
        const legacyStats = getLegacyDataStats();
        console.log('📦 Dados legados detectados:', legacyStats);

        // Executar migração automática
        setMigrationStatus('migrating');
        const result = await autoMigrateIfNeeded();

        if (result.status?.completed) {
          console.log('✅ Migração concluída com sucesso!');
          console.log('📊 Estatísticas:', result.status.stats);
          setStats(result.status.stats);
          setMigrationStatus('completed');

          // Recarregar página após 2 segundos para atualizar dados
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else if (result.status?.errors) {
          console.error('❌ Erro durante migração:', result.status.errors);
          setError(result.status.errors.join(', '));
          setMigrationStatus('error');
        }
      } catch (err) {
        console.error('❌ Erro no AutoMigration:', err);
        setError(String(err));
        setMigrationStatus('error');
      }
    }

    // Executar verificação após 1 segundo (dar tempo para auth carregar)
    const timer = setTimeout(() => {
      checkAndMigrate();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Não renderizar nada se estiver idle ou completed silenciosamente
  if (migrationStatus === 'idle' || migrationStatus === 'completed') {
    return null;
  }

  // Mostrar loading durante checking/migrating
  if (migrationStatus === 'checking' || migrationStatus === 'migrating') {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white px-6 py-4 rounded-lg shadow-2xl border-2 border-blue-400 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <div>
            <p className="font-bold text-sm">
              {migrationStatus === 'checking' ? '🔍 Verificando dados...' : '🚀 Migrando para Supabase...'}
            </p>
            <p className="text-xs opacity-90">Não feche esta janela</p>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar erro
  if (migrationStatus === 'error') {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-red-600 text-white px-6 py-4 rounded-lg shadow-2xl border-2 border-red-400 max-w-md">
        <div className="flex items-center gap-3 mb-2">
          <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-bold text-sm">❌ Erro na migração</p>
        </div>
        <p className="text-xs opacity-90 ml-9">{error}</p>
        <button
          onClick={() => setMigrationStatus('idle')}
          className="mt-3 ml-9 text-xs underline hover:no-underline"
        >
          Fechar
        </button>
      </div>
    );
  }

  return null;
}
