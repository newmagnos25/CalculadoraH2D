/**
 * Sistema de Migração Automática
 * localStorage → Supabase
 *
 * Detecta dados antigos no localStorage e migra para Supabase automaticamente
 * Executa apenas uma vez por usuário
 */

import { createClient } from '@/lib/supabase/client';
import * as SupabaseStorage from './storage-supabase';
import { Filament, Addon, Printer, CompanySettings, ClientData } from './types';

// ============================================
// KEYS DO LOCALSTORAGE (legado)
// ============================================

const LEGACY_KEYS = {
  CUSTOM_FILAMENTS: 'bkl_custom_filaments',
  CUSTOM_ADDONS: 'bkl_custom_addons',
  CUSTOM_PRINTERS: 'bkl_custom_printers',
  COMPANY_SETTINGS: 'bkl_company_settings',
  CLIENTS: 'bkl_clients',
  MIGRATION_COMPLETED: 'bkl_migration_completed_v1',
};

// ============================================
// STATUS DA MIGRAÇÃO
// ============================================

export interface MigrationStatus {
  completed: boolean;
  timestamp?: string;
  stats?: {
    filaments: number;
    addons: number;
    printers: number;
    clients: number;
    companySettings: boolean;
  };
  errors?: string[];
}

/**
 * Verifica se a migração já foi realizada
 */
export function isMigrationCompleted(): boolean {
  if (typeof window === 'undefined') return true;
  const status = localStorage.getItem(LEGACY_KEYS.MIGRATION_COMPLETED);
  return status === 'true';
}

/**
 * Marca a migração como completa
 */
function markMigrationCompleted(stats: MigrationStatus['stats']): void {
  localStorage.setItem(LEGACY_KEYS.MIGRATION_COMPLETED, 'true');
  localStorage.setItem(
    'bkl_migration_stats',
    JSON.stringify({
      completed: true,
      timestamp: new Date().toISOString(),
      stats,
    })
  );
}

// ============================================
// FUNÇÕES DE LEITURA DO LOCALSTORAGE (legado)
// ============================================

function getLegacyFilaments(): Filament[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(LEGACY_KEYS.CUSTOM_FILAMENTS);
  return data ? JSON.parse(data) : [];
}

function getLegacyAddons(): Addon[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(LEGACY_KEYS.CUSTOM_ADDONS);
  return data ? JSON.parse(data) : [];
}

function getLegacyPrinters(): Printer[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(LEGACY_KEYS.CUSTOM_PRINTERS);
  return data ? JSON.parse(data) : [];
}

function getLegacyCompanySettings(): CompanySettings | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(LEGACY_KEYS.COMPANY_SETTINGS);
  return data ? JSON.parse(data) : null;
}

function getLegacyClients(): ClientData[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(LEGACY_KEYS.CLIENTS);
  return data ? JSON.parse(data) : [];
}

// ============================================
// DETECÇÃO DE DADOS LEGADOS
// ============================================

/**
 * Verifica se há dados no localStorage que precisam ser migrados
 */
export function hasLegacyData(): boolean {
  if (typeof window === 'undefined') return false;
  if (isMigrationCompleted()) return false;

  const filaments = getLegacyFilaments();
  const addons = getLegacyAddons();
  const printers = getLegacyPrinters();
  const companySettings = getLegacyCompanySettings();
  const clients = getLegacyClients();

  return (
    filaments.length > 0 ||
    addons.length > 0 ||
    printers.length > 0 ||
    companySettings !== null ||
    clients.length > 0
  );
}

// ============================================
// MIGRAÇÃO PRINCIPAL
// ============================================

/**
 * Executa a migração completa dos dados
 * Retorna estatísticas da migração
 */
export async function migrateLocalStorageToSupabase(): Promise<MigrationStatus> {
  const errors: string[] = [];
  const stats = {
    filaments: 0,
    addons: 0,
    printers: 0,
    clients: 0,
    companySettings: false,
  };

  try {
    // Verificar autenticação
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Usuário não autenticado. Faça login para migrar seus dados.');
    }

    console.log('🔄 Iniciando migração localStorage → Supabase...');
    console.log('👤 Usuário:', user.email);

    // 1. Migrar Filamentos
    console.log('📦 Migrando filamentos...');
    const legacyFilaments = getLegacyFilaments();
    for (const filament of legacyFilaments) {
      try {
        await SupabaseStorage.saveCustomFilament(filament);
        stats.filaments++;
      } catch (err) {
        const error = `Erro ao migrar filamento ${filament.brand} ${filament.type}: ${err}`;
        console.error(error);
        errors.push(error);
      }
    }
    console.log(`✅ ${stats.filaments}/${legacyFilaments.length} filamentos migrados`);

    // 2. Migrar Adereços
    console.log('🎨 Migrando adereços...');
    const legacyAddons = getLegacyAddons();
    for (const addon of legacyAddons) {
      try {
        await SupabaseStorage.saveCustomAddon(addon);
        stats.addons++;
      } catch (err) {
        const error = `Erro ao migrar adereço ${addon.name}: ${err}`;
        console.error(error);
        errors.push(error);
      }
    }
    console.log(`✅ ${stats.addons}/${legacyAddons.length} adereços migrados`);

    // 3. Migrar Impressoras
    console.log('🖨️ Migrando impressoras...');
    const legacyPrinters = getLegacyPrinters();
    for (const printer of legacyPrinters) {
      try {
        await SupabaseStorage.saveCustomPrinter(printer);
        stats.printers++;
      } catch (err) {
        const error = `Erro ao migrar impressora ${printer.name}: ${err}`;
        console.error(error);
        errors.push(error);
      }
    }
    console.log(`✅ ${stats.printers}/${legacyPrinters.length} impressoras migradas`);

    // 4. Migrar Configurações da Empresa
    console.log('🏢 Migrando configurações da empresa...');
    const legacyCompanySettings = getLegacyCompanySettings();
    if (legacyCompanySettings) {
      try {
        await SupabaseStorage.saveCompanySettings(legacyCompanySettings);
        stats.companySettings = true;
        console.log('✅ Configurações da empresa migradas');
      } catch (err) {
        const error = `Erro ao migrar configurações da empresa: ${err}`;
        console.error(error);
        errors.push(error);
      }
    }

    // 5. Migrar Clientes
    console.log('👥 Migrando clientes...');
    const legacyClients = getLegacyClients();
    for (const client of legacyClients) {
      try {
        await SupabaseStorage.saveClient(client);
        stats.clients++;
      } catch (err) {
        const error = `Erro ao migrar cliente ${client.name}: ${err}`;
        console.error(error);
        errors.push(error);
      }
    }
    console.log(`✅ ${stats.clients}/${legacyClients.length} clientes migrados`);

    // 6. Marcar migração como completa
    markMigrationCompleted(stats);

    // 7. Limpar localStorage (opcional - mantemos por segurança temporariamente)
    console.log('💾 Dados migrados com sucesso! localStorage mantido como backup.');

    console.log('✅ MIGRAÇÃO COMPLETA!');
    console.log('📊 Resumo:', stats);

    return {
      completed: true,
      timestamp: new Date().toISOString(),
      stats,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    console.error('❌ Erro durante migração:', error);
    return {
      completed: false,
      errors: [String(error), ...errors],
    };
  }
}

// ============================================
// LIMPEZA DO LOCALSTORAGE (OPCIONAL)
// ============================================

/**
 * Remove dados legados do localStorage
 * CUIDADO: Use apenas após confirmar que migração foi bem-sucedida!
 */
export function clearLegacyLocalStorage(): void {
  if (typeof window === 'undefined') return;

  const keys = [
    LEGACY_KEYS.CUSTOM_FILAMENTS,
    LEGACY_KEYS.CUSTOM_ADDONS,
    LEGACY_KEYS.CUSTOM_PRINTERS,
    LEGACY_KEYS.COMPANY_SETTINGS,
    LEGACY_KEYS.CLIENTS,
  ];

  for (const key of keys) {
    localStorage.removeItem(key);
  }

  console.log('🧹 localStorage legado limpo');
}

// ============================================
// FUNÇÃO DE CONVENIÊNCIA
// ============================================

/**
 * Verifica e executa migração automaticamente se necessário
 * Retorna true se migração foi executada (ou já estava completa)
 */
export async function autoMigrateIfNeeded(): Promise<{
  migrationExecuted: boolean;
  status?: MigrationStatus;
}> {
  // Já migrado
  if (isMigrationCompleted()) {
    return { migrationExecuted: false };
  }

  // Não há dados para migrar
  if (!hasLegacyData()) {
    markMigrationCompleted({
      filaments: 0,
      addons: 0,
      printers: 0,
      clients: 0,
      companySettings: false,
    });
    return { migrationExecuted: false };
  }

  // Executar migração
  console.log('🔄 Dados legados detectados. Iniciando migração automática...');
  const status = await migrateLocalStorageToSupabase();

  return {
    migrationExecuted: true,
    status,
  };
}

// ============================================
// UTILITÁRIOS DE DIAGNÓSTICO
// ============================================

/**
 * Retorna estatísticas dos dados legados
 */
export function getLegacyDataStats() {
  return {
    filaments: getLegacyFilaments().length,
    addons: getLegacyAddons().length,
    printers: getLegacyPrinters().length,
    clients: getLegacyClients().length,
    companySettings: getLegacyCompanySettings() !== null,
    migrationCompleted: isMigrationCompleted(),
  };
}

/**
 * Reseta o status de migração (para testes)
 */
export function resetMigrationStatus(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(LEGACY_KEYS.MIGRATION_COMPLETED);
  localStorage.removeItem('bkl_migration_stats');
  console.log('🔄 Status de migração resetado');
}
