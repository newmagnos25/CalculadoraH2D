'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency } from '@/lib/calculator';
import { generateAndDownloadQuote, generateAndDownloadContract } from '@/lib/pdf-utils';
import toast from 'react-hot-toast';

interface Quote {
  id: string;
  created_at: string;
  quote_data: {
    type: 'calculation' | 'contract';
    calculation?: any;
    printDetails?: any;
    contractDetails?: any;
  };
}

export default function DashboardPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'calculation' | 'contract'>('all');

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error('Você precisa estar logado para ver seus orçamentos');
        return;
      }

      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setQuotes(data || []);
    } catch (error) {
      console.error('Erro ao carregar orçamentos:', error);
      toast.error('Erro ao carregar orçamentos');
    } finally {
      setLoading(false);
    }
  };

  const handleRedownloadPDF = async (quote: Quote) => {
    try {
      const { quote_data } = quote;

      if (quote_data.type === 'calculation' && quote_data.calculation && quote_data.printDetails) {
        // Redownload de Orçamento
        const success = await generateAndDownloadQuote({
          company: {
            name: '',
            cnpj: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            phone: '',
            email: '',
            invoicePrefix: 'ORÇ-',
            invoiceCounter: 1,
            paymentTerms: 'À combinar',
          },
          client: null,
          calculation: quote_data.calculation,
          quoteNumber: `ORÇ-${quote.id.substring(0, 8).toUpperCase()}`,
          date: new Date(quote.created_at).toISOString(),
          validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          projectStatus: 'quote' as const,
          printDetails: quote_data.printDetails,
          attachments: [],
        });

        if (success) {
          toast.success('✅ PDF de orçamento baixado novamente!');
        } else {
          toast.error('Erro ao gerar PDF de orçamento');
        }
      } else if (quote_data.type === 'contract' && quote_data.contractDetails) {
        // Redownload de Contrato
        const success = await generateAndDownloadContract({
          company: quote_data.contractDetails.company || {
            name: '',
            cnpj: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            phone: '',
            email: '',
            invoicePrefix: 'CONT-',
            invoiceCounter: 1,
            paymentTerms: 'À combinar',
          },
          client: quote_data.contractDetails.client || {
            id: quote.id,
            name: '',
            email: '',
            phone: '',
            createdAt: quote.created_at,
          },
          contractNumber: `CONT-${quote.id.substring(0, 8).toUpperCase()}`,
          date: new Date(quote.created_at).toISOString(),
          totalValue: quote_data.contractDetails.totalValue || 0,
          description: quote_data.contractDetails.description || '',
          deliveryDays: quote_data.contractDetails.deliveryDays || 7,
          attachments: [],
        });

        if (success) {
          toast.success('✅ PDF de contrato baixado novamente!');
        } else {
          toast.error('Erro ao gerar PDF de contrato');
        }
      }
    } catch (error) {
      console.error('Erro ao redownload:', error);
      toast.error('Erro ao baixar PDF novamente');
    }
  };

  const filteredQuotes = quotes.filter(q => {
    if (filter === 'all') return true;
    return q.quote_data?.type === filter;
  });

  const calculations = quotes.filter(q => q.quote_data?.type === 'calculation');
  const contracts = quotes.filter(q => q.quote_data?.type === 'contract');

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-orange-50/30 dark:from-black dark:via-slate-950 dark:to-slate-900">
      {/* Header */}
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
                  📊 Meus Orçamentos
                </p>
              </div>
            </Link>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/calculator"
                className="flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-3 bg-white hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-orange-600 dark:text-orange-400 font-black text-xs sm:text-sm transition-all shadow-lg border-2 border-orange-400 dark:border-orange-500 hover:scale-105 hover:shadow-xl"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden sm:inline">Calculadora</span>
                <span className="sm:hidden">Calc</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Total */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border-2 border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">Total de Documentos</p>
                <p className="text-3xl font-black text-blue-600 dark:text-blue-400">{quotes.length}</p>
              </div>
            </div>
          </div>

          {/* Orçamentos */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border-2 border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">Orçamentos</p>
                <p className="text-3xl font-black text-orange-600 dark:text-orange-400">{calculations.length}</p>
              </div>
            </div>
          </div>

          {/* Contratos */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border-2 border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">Contratos</p>
                <p className="text-3xl font-black text-green-600 dark:text-green-400">{contracts.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-2 mb-6 border-2 border-slate-200 dark:border-slate-700 inline-flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              filter === 'all'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            Todos ({quotes.length})
          </button>
          <button
            onClick={() => setFilter('calculation')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              filter === 'calculation'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            Orçamentos ({calculations.length})
          </button>
          <button
            onClick={() => setFilter('contract')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              filter === 'contract'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            Contratos ({contracts.length})
          </button>
        </div>

        {/* Quotes List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600"></div>
          </div>
        ) : filteredQuotes.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-12 text-center border-2 border-dashed border-slate-300 dark:border-slate-700">
            <svg className="w-24 h-24 mx-auto text-slate-300 dark:text-slate-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-xl font-bold text-slate-600 dark:text-slate-400 mb-2">
              Nenhum documento encontrado
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mb-6">
              Crie seu primeiro orçamento na calculadora!
            </p>
            <Link
              href="/calculator"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-lg transition-all shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Criar Orçamento
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredQuotes.map((quote) => {
              const isCalculation = quote.quote_data?.type === 'calculation';
              const date = new Date(quote.created_at);
              const finalPrice = isCalculation
                ? quote.quote_data?.calculation?.finalPrice
                : quote.quote_data?.contractDetails?.totalValue;

              return (
                <div
                  key={quote.id}
                  className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border-2 transition-all hover:shadow-xl ${
                    isCalculation
                      ? 'border-orange-200 dark:border-orange-900/50 hover:border-orange-400'
                      : 'border-green-200 dark:border-green-900/50 hover:border-green-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isCalculation
                              ? 'bg-gradient-to-br from-orange-500 to-amber-500'
                              : 'bg-gradient-to-br from-green-500 to-emerald-500'
                          }`}
                        >
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isCalculation ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            )}
                          </svg>
                        </div>
                        <div>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-black ${
                              isCalculation
                                ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-2 border-orange-300 dark:border-orange-700'
                                : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-2 border-green-300 dark:border-green-700'
                            }`}
                          >
                            {isCalculation ? 'ORÇAMENTO' : 'CONTRATO'}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                        {isCalculation
                          ? quote.quote_data?.printDetails?.itemDescription || 'Sem descrição'
                          : quote.quote_data?.contractDetails?.description || 'Sem descrição'}
                      </h3>

                      <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 flex-wrap">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {date.toLocaleDateString('pt-BR')} às {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {finalPrice && (
                          <span className="flex items-center gap-1 font-bold text-green-600 dark:text-green-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formatCurrency(finalPrice)}
                          </span>
                        )}
                      </div>

                      {/* Details */}
                      {isCalculation && quote.quote_data?.printDetails && (
                        <div className="mt-3 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                          {quote.quote_data.printDetails.weight && (
                            <span>⚖️ {quote.quote_data.printDetails.weight}g</span>
                          )}
                          {quote.quote_data.printDetails.printTime && (
                            <span>⏱️ {Math.floor(quote.quote_data.printDetails.printTime / 60)}h {quote.quote_data.printDetails.printTime % 60}min</span>
                          )}
                          {quote.quote_data.printDetails.dimensions && (
                            <span>📏 {quote.quote_data.printDetails.dimensions}</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRedownloadPDF(quote)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg text-sm"
                        title="Baixar PDF novamente"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span className="hidden sm:inline">Baixar PDF</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
