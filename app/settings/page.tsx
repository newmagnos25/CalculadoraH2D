'use client';

import { useState } from 'react';
import Link from 'next/link';
import AccountSettings from '@/components/AccountSettings';
import CompanySettings from '@/components/CompanySettings';
import ClientManager from '@/components/ClientManager';
import PrinterManager from '@/components/PrinterManager';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'account' | 'company' | 'clients' | 'printers'>('account');

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-orange-50/30 dark:from-black dark:via-slate-950 dark:to-slate-900">
      {/* Header Premium */}
      <div className="bg-gradient-to-r from-black via-slate-900 to-black border-b-4 border-orange-500 shadow-2xl">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Link href="/calculator" className="flex items-center gap-4 hover:opacity-80 transition-opacity cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center border-2 border-amber-300 shadow-lg shadow-orange-500/50">
                <svg className="w-10 h-10 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
                    Precifica3D
                  </h1>
                  <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full text-xs font-black border-2 border-amber-300 text-white shadow-lg">
                    PRO
                  </span>
                </div>
                <p className="text-orange-200 text-xs sm:text-sm md:text-base font-medium">
                  ⚙️ Configurações
                </p>
              </div>
            </Link>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/calculator"
                className="flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-3 bg-white hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-orange-600 dark:text-orange-400 font-black text-xs sm:text-sm transition-all shadow-lg border-2 border-orange-400 dark:border-orange-500 hover:scale-105 hover:shadow-xl hover:border-orange-500 dark:hover:border-orange-400"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden xs:inline">←</span>
                <span className="hidden sm:inline">Calculadora</span>
                <span className="sm:hidden">Calc</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-900 border-b-2 border-blue-200 dark:border-blue-900/50 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex gap-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('account')}
              className={`px-6 py-4 font-bold text-sm transition-all border-b-4 whitespace-nowrap ${
                activeTab === 'account'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Minha Conta
              </div>
            </button>
            <button
              onClick={() => setActiveTab('company')}
              className={`px-6 py-4 font-bold text-sm transition-all border-b-4 whitespace-nowrap ${
                activeTab === 'company'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400'
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
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Gerenciar Clientes
              </div>
            </button>
            <button
              onClick={() => setActiveTab('printers')}
              className={`px-6 py-4 font-bold text-sm transition-all border-b-4 ${
                activeTab === 'printers'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
                Impressoras
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'account' && (
            <AccountSettings />
          )}

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

          {activeTab === 'printers' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border-2 border-blue-200 dark:border-blue-800 p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Gerenciar Impressoras</h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Adicione e gerencie suas impressoras 3D customizadas
                </p>
              </div>
              <PrinterManager showAsList={true} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
