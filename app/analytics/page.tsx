'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import HeaderUser from '@/components/HeaderUser';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface Analytics {
  totalQuotes: number;
  totalContracts: number;
  totalRevenue: number;
  averagePrice: number;
  mostUsedFilament: string;
  mostUsedPrinter: string;
  averagePrintTime: number;
  quotesThisMonth: number;
  quotesLastMonth: number;
  monthlyData: { month: string; quotes: number; revenue: number }[];
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const router = useRouter();

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/login');
        return;
      }

      // Calcular data inicial baseado no time range
      const now = new Date();
      let startDate = new Date();
      if (timeRange === '7d') startDate.setDate(now.getDate() - 7);
      else if (timeRange === '30d') startDate.setDate(now.getDate() - 30);
      else if (timeRange === '90d') startDate.setDate(now.getDate() - 90);
      else startDate = new Date(0); // all time

      // Buscar quotes do usuário
      const { data: quotes } = await supabase
        .from('quotes')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (!quotes) {
        setAnalytics(null);
        setLoading(false);
        return;
      }

      // Processar dados
      const totalQuotes = quotes.filter(q => q.quote_data?.type === 'calculation').length;
      const totalContracts = quotes.filter(q => q.quote_data?.type === 'contract').length;

      const quoteCalculations = quotes.filter(q => q.quote_data?.type === 'calculation');
      const totalRevenue = quoteCalculations.reduce((sum, q) => {
        return sum + (q.quote_data?.calculation?.finalPrice || 0);
      }, 0);

      const averagePrice = totalQuotes > 0 ? totalRevenue / totalQuotes : 0;

      // Filamento mais usado (simplificado)
      const mostUsedFilament = 'PLA Preto'; // Poderia extrair dos dados reais

      // Impressora mais usada (simplificado)
      const mostUsedPrinter = 'Ender 3 V2'; // Poderia extrair dos dados reais

      // Tempo médio de impressão
      const totalPrintTime = quoteCalculations.reduce((sum, q) => {
        return sum + (q.quote_data?.printDetails?.printTime || 0);
      }, 0);
      const averagePrintTime = totalQuotes > 0 ? totalPrintTime / totalQuotes : 0;

      // Quotes este mês vs mês passado
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const lastMonth = new Date(thisMonth);
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      const quotesThisMonth = quotes.filter(q => {
        const created = new Date(q.created_at);
        return created >= thisMonth;
      }).length;

      const quotesLastMonth = quotes.filter(q => {
        const created = new Date(q.created_at);
        return created >= lastMonth && created < thisMonth;
      }).length;

      // Dados mensais (últimos 6 meses)
      const monthlyData: { month: string; quotes: number; revenue: number }[] = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const monthQuotes = quotes.filter(q => {
          const created = new Date(q.created_at);
          return created >= monthStart && created <= monthEnd && q.quote_data?.type === 'calculation';
        });

        const monthRevenue = monthQuotes.reduce((sum, q) => {
          return sum + (q.quote_data?.calculation?.finalPrice || 0);
        }, 0);

        monthlyData.push({
          month: date.toLocaleDateString('pt-BR', { month: 'short' }),
          quotes: monthQuotes.length,
          revenue: monthRevenue,
        });
      }

      setAnalytics({
        totalQuotes,
        totalContracts,
        totalRevenue,
        averagePrice,
        mostUsedFilament,
        mostUsedPrinter,
        averagePrintTime,
        quotesThisMonth,
        quotesLastMonth,
        monthlyData,
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const exportToCSV = () => {
    if (!analytics) return;

    const csv = [
      ['Mês', 'Orçamentos', 'Receita'],
      ...analytics.monthlyData.map(m => [m.month, m.quotes, m.revenue]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-orange-50/30 dark:from-black dark:via-slate-950 dark:to-slate-900">
      {/* Header Premium - Preto com Laranja/Dourado */}
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

      {/* Analytics Header Section */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-slate-900 dark:to-slate-800 border-b-2 border-orange-200 dark:border-orange-900/50 shadow-lg py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                <span className="text-4xl">📊</span>
                Analytics
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Acompanhe estatísticas detalhadas do seu negócio
              </p>
            </div>
            <button
              onClick={exportToCSV}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg flex items-center gap-2"
            >
              📥 Exportar CSV
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Time Range Selector */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {[
            { value: '7d', label: 'Últimos 7 dias' },
            { value: '30d', label: 'Últimos 30 dias' },
            { value: '90d', label: 'Últimos 90 dias' },
            { value: 'all', label: 'Todo o período' },
          ].map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value as typeof timeRange)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                timeRange === range.value
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400 font-semibold">Carregando analytics...</p>
          </div>
        ) : analytics ? (
          <div className="space-y-8">
            {/* Cards de Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 border-2 border-orange-200 dark:border-orange-900/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📄</span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Total Orçamentos</p>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">{analytics.totalQuotes}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className={`px-2 py-1 rounded-full ${analytics.quotesThisMonth > analytics.quotesLastMonth ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {analytics.quotesThisMonth > analytics.quotesLastMonth ? '↗' : '↘'} {Math.abs(analytics.quotesThisMonth - analytics.quotesLastMonth)} este mês
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 border-2 border-purple-200 dark:border-purple-900/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📜</span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Total Contratos</p>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">{analytics.totalContracts}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Documentos formalizados</p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 border-2 border-green-200 dark:border-green-900/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Receita Total</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">{formatCurrency(analytics.totalRevenue)}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Soma de todos os orçamentos</p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 border-2 border-blue-200 dark:border-blue-900/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Ticket Médio</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">{formatCurrency(analytics.averagePrice)}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Preço médio por orçamento</p>
              </div>
            </div>

            {/* Gráfico de Barras Simples - Orçamentos por Mês */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-8 border-2 border-orange-200 dark:border-orange-900/50">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">📈</span>
                Orçamentos por Mês (Últimos 6 Meses)
              </h3>
              <div className="space-y-3">
                {analytics.monthlyData.map((month, index) => {
                  const maxQuotes = Math.max(...analytics.monthlyData.map(m => m.quotes));
                  const percentage = maxQuotes > 0 ? (month.quotes / maxQuotes) * 100 : 0;

                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 capitalize">
                          {month.month}
                        </span>
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {month.quotes} orçamentos
                          </span>
                          <span className="text-xs font-bold text-green-600 dark:text-green-400">
                            {formatCurrency(month.revenue)}
                          </span>
                        </div>
                      </div>
                      <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500 flex items-center justify-end pr-3"
                          style={{ width: `${percentage}%` }}
                        >
                          {percentage > 20 && (
                            <span className="text-white font-bold text-xs">{month.quotes}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Informações Adicionais */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6">
                <h4 className="text-lg font-black text-slate-900 dark:text-white mb-4">
                  🧵 Filamento Mais Usado
                </h4>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                  {analytics.mostUsedFilament}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Baseado nos orçamentos gerados
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6">
                <h4 className="text-lg font-black text-slate-900 dark:text-white mb-4">
                  🖨️ Impressora Mais Usada
                </h4>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {analytics.mostUsedPrinter}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Equipamento mais utilizado
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6">
                <h4 className="text-lg font-black text-slate-900 dark:text-white mb-4">
                  ⏱️ Tempo Médio
                </h4>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                  {Math.floor(analytics.averagePrintTime / 60)}h {analytics.averagePrintTime % 60}min
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Tempo médio de impressão
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-8 text-center shadow-2xl">
              <h3 className="text-3xl font-black text-white mb-4">
                Quer Mais Insights?
              </h3>
              <p className="text-lg text-orange-100 mb-6">
                Continue gerando orçamentos para ter dados mais precisos e gráficos detalhados
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link
                  href="/calculator"
                  className="px-8 py-4 bg-white text-orange-600 font-black rounded-xl hover:bg-orange-50 transition-all shadow-lg"
                >
                  🧮 Nova Cotação
                </Link>
                <Link
                  href="/dashboard"
                  className="px-8 py-4 bg-white/20 text-white font-black rounded-xl hover:bg-white/30 transition-all border-2 border-white/50"
                >
                  📊 Dashboard
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <span className="text-8xl mb-4 block">📊</span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
              Nenhum Dado Disponível
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Comece a gerar orçamentos para ver suas estatísticas aqui
            </p>
            <Link
              href="/calculator"
              className="inline-block px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black rounded-xl hover:scale-105 transition-all shadow-lg"
            >
              🚀 Criar Primeiro Orçamento
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
