'use client';

import { useState } from 'react';
import Link from 'next/link';
import HeaderUser from '@/components/HeaderUser';
import AccountSettings from '@/components/AccountSettings';
import CompanySettings from '@/components/CompanySettings';
import ClientManager from '@/components/ClientManager';
import PrinterManager from '@/components/PrinterManager';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'account' | 'company' | 'clients' | 'printers'>('account');

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-orange-50/30 dark:from-black dark:via-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-black via-slate-900 to-black border-b-4 border-orange-500 shadow-2xl sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center border-2 border-amber-300 shadow-lg shadow-orange-500/50">
                <svg className="w-7 h-7 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-black text-white">Precifica3D</h1>
                <p className="text-orange-400 text-xs font-bold">PRO</p>
              </div>
            </Link>
            <HeaderUser />
          </div>
        </div>
      </header>

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
