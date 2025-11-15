'use client';

import { useState } from 'react';
import Link from 'next/link';
import CompanySettings from '@/components/CompanySettings';
import ClientManager from '@/components/ClientManager';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'company' | 'clients'>('company');

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-orange-50/30 dark:from-black dark:via-slate-950 dark:to-slate-900">
      {/* Header Premium */}
      <div className="bg-gradient-to-r from-black via-slate-900 to-black border-b-4 border-orange-500 shadow-2xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center border-2 border-amber-300 shadow-lg shadow-orange-500/50">
                  <svg className="w-7 h-7 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                    Configurações
                  </h1>
                  <p className="text-orange-200 text-sm">Voltar para Calculadora</p>
                </div>
              </Link>
            </div>
            <div className="text-right">
              <div className="text-orange-300 text-xs uppercase tracking-widest font-semibold">Powered by</div>
              <div className="text-xl font-black bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent drop-shadow-md">
                BKreativeLab
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-900 border-b-2 border-orange-200 dark:border-orange-900/50 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('company')}
              className={`px-6 py-4 font-bold text-sm transition-all border-b-4 ${
                activeTab === 'company'
                  ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Dados da Empresa
              </div>
            </button>
            <button
              onClick={() => setActiveTab('clients')}
              className={`px-6 py-4 font-bold text-sm transition-all border-b-4 ${
                activeTab === 'clients'
                  ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Gerenciar Clientes
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'company' && (
            <CompanySettings />
          )}

          {activeTab === 'clients' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border-2 border-blue-200 dark:border-blue-900 p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Gerenciar Clientes</h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Adicione e gerencie seus clientes para facilitar a geração de orçamentos
                </p>
              </div>
              <ClientManager showAsList={true} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
