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
    <main className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50/30 dark:from-black dark:via-slate-950 dark:to-slate-900">
      {/* Header Premium */}
      <div className="bg-gradient-to-r from-black via-slate-900 to-black border-b-4 border-blue-500 shadow-2xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                href="/calculator"
                className="group flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-white hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl border-2 border-blue-400 dark:border-blue-500 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center border-2 border-indigo-300 shadow-lg shadow-blue-500/50 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">← Voltar</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 hidden sm:block">Calculadora</p>
                </div>
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white">
                  Configurações
                </h1>
                <p className="text-blue-200 text-xs sm:text-sm">Gerencie suas configurações</p>
              </div>
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
