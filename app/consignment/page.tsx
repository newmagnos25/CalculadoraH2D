'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { getCompanySettings, getClients, getNextInvoiceNumber, incrementInvoiceCounter } from '@/lib/storage';
import { generateAndDownloadConsignment, getCurrentDate } from '@/lib/pdf-utils';
import { useSubscription } from '@/lib/hooks/useSubscription';
import { showMotivationalPopup } from '@/lib/motivational-popups';
import ClientManager from '@/components/ClientManager';
import { ConsignmentItem } from '@/components/PDFConsignment';
import { ClientData } from '@/lib/types';

export default function ConsignmentPage() {
  const router = useRouter();
  const { subscription, loading: loadingSubscription, refresh: refreshSubscription } = useSubscription();

  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Items
  const [items, setItems] = useState<ConsignmentItem[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0, totalPrice: 0 }
  ]);

  // Conditions
  const [returnDeadlineDays, setReturnDeadlineDays] = useState(30);
  const [commissionPercent, setCommissionPercent] = useState(0);
  const [paymentTerms, setPaymentTerms] = useState('Pagamento à vista no momento da venda dos itens consignados');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    // Verificar autenticação
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login?redirect=/consignment');
      }
    };
    checkAuth();
  }, [router]);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSelectClient = (client: ClientData | null) => {
    if (client) {
      setSelectedClientId(client.id);
    }
  };

  const addItem = () => {
    const newId = (items.length + 1).toString();
    setItems([...items, { id: newId, description: '', quantity: 1, unitPrice: 0, totalPrice: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof ConsignmentItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        // Recalcular total quando quantidade ou preço mudar
        if (field === 'quantity' || field === 'unitPrice') {
          updated.totalPrice = updated.quantity * updated.unitPrice;
        }
        return updated;
      }
      return item;
    }));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const handleGenerateConsignment = async () => {
    // Verificar limite
    if (!subscription) {
      showMessage('error', 'Carregando informações da assinatura...');
      return;
    }

    if (!subscription.allowed) {
      router.push('/upgrade');
      return;
    }

    const company = getCompanySettings();
    if (!company || !company.name) {
      showMessage('error', 'Configure os dados da empresa primeiro');
      return;
    }

    const clients = getClients();
    const client = selectedClientId ? clients.find(c => c.id === selectedClientId) : null;

    if (!client) {
      showMessage('error', 'Selecione um cliente para gerar o termo de consignação');
      return;
    }

    // Validar itens
    const invalidItems = items.filter(item => !item.description || item.quantity <= 0 || item.unitPrice <= 0);
    if (invalidItems.length > 0) {
      showMessage('error', 'Preencha todos os itens corretamente (descrição, quantidade e preço)');
      return;
    }

    setIsGenerating(true);

    try {
      const consignmentNumber = getNextInvoiceNumber();
      const date = getCurrentDate();

      const success = await generateAndDownloadConsignment({
        company,
        client,
        consignmentNumber,
        date,
        items,
        conditions: {
          returnDeadlineDays,
          commissionPercent: commissionPercent > 0 ? commissionPercent : undefined,
          paymentTerms,
          notes: notes || undefined,
        },
      });

      if (success) {
        // Salvar no Supabase
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          await supabase.from('quotes').insert({
            user_id: user.id,
            quote_data: {
              consignmentNumber,
              date,
              client: { name: client.name, email: client.email },
              items,
              conditions: { returnDeadlineDays, commissionPercent, paymentTerms, notes },
              type: 'consignment',
            },
          });
        }

        incrementInvoiceCounter();
        await refreshSubscription();
        showMessage('success', `Termo de Consignação ${consignmentNumber} gerado com sucesso!`);

        // Mostrar popup motivacional
        if (subscription && !subscription.is_unlimited) {
          const newRemaining = (subscription.remaining || 0) - 1;
          showMotivationalPopup(newRemaining, subscription.max || 0);
        }

        // Limpar formulário após 2 segundos
        setTimeout(() => {
          setItems([{ id: '1', description: '', quantity: 1, unitPrice: 0, totalPrice: 0 }]);
          setSelectedClientId('');
          setNotes('');
        }, 2000);
      } else {
        showMessage('error', 'Erro ao gerar termo de consignação. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro:', error);
      showMessage('error', 'Erro ao gerar termo de consignação. Verifique os dados.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-orange-50/30 dark:from-black dark:via-slate-950 dark:to-slate-900">
      {/* Header Premium - PADRÃO IGUAL À CALCULADORA */}
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
                  📦 Termo de Consignação
                </p>
              </div>
            </Link>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/calculator"
                className="flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-3 bg-white hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-orange-600 dark:text-orange-400 font-black text-xs sm:text-sm transition-all shadow-lg border-2 border-orange-400 dark:border-orange-500 hover:scale-105 hover:shadow-xl hover:border-orange-500 dark:hover:border-orange-400"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">Voltar</span>
                <span className="sm:hidden">←</span>
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-3 bg-white hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-orange-600 dark:text-orange-400 font-black text-xs sm:text-sm transition-all shadow-lg border-2 border-orange-400 dark:border-orange-500 hover:scale-105 hover:shadow-xl hover:border-orange-500 dark:hover:border-orange-400"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="hidden xs:inline">⚙️</span>
                <span className="hidden sm:inline">Configurações</span>
                <span className="sm:hidden">Config</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Message Alert */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg border-2 ${
              message.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-800 dark:text-green-200'
                : 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-800 dark:text-red-200'
            }`}>
              <div className="flex items-center gap-2">
                {message.type === 'success' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <span className="font-semibold">{message.text}</span>
              </div>
            </div>
          )}

          {/* Client Selection */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-300 dark:border-blue-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Cliente (Obrigatório)
            </h2>
            <ClientManager selectedClientId={selectedClientId} onClientSelect={handleSelectClient} />
          </div>

          {/* Items */}
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl p-6 mb-6 border-2 border-orange-200 dark:border-orange-900/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Itens Consignados
              </h2>
              <button
                onClick={addItem}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-lg transition-all flex items-center gap-2 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Adicionar Item
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="border-2 border-gray-200 dark:border-slate-700 rounded-lg p-4 hover:border-orange-300 dark:hover:border-orange-700 transition-colors bg-white dark:bg-slate-800">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-gray-700 dark:text-gray-300">Item {index + 1}</h3>
                    {items.length > 1 && (
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Descrição</label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        placeholder="Ex: Miniatura de dragão impresso em PLA"
                        className="w-full px-3 py-2 border-2 border-gray-300 dark:border-slate-600 rounded-lg focus:border-orange-500 dark:focus:border-orange-500 focus:outline-none bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Quantidade</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border-2 border-gray-300 dark:border-slate-600 rounded-lg focus:border-orange-500 dark:focus:border-orange-500 focus:outline-none bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Preço Unit. (R$)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border-2 border-gray-300 dark:border-slate-600 rounded-lg focus:border-orange-500 dark:focus:border-orange-500 focus:outline-none bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="mt-3 text-right">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total: </span>
                    <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                      R$ {item.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t-2 border-gray-200 dark:border-slate-700">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900 dark:text-white">Valor Total da Consignação:</span>
                <span className="text-3xl font-bold text-orange-600 dark:text-orange-400">R$ {calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Conditions */}
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl p-6 mb-6 border-2 border-purple-200 dark:border-purple-900/50">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Condições da Consignação
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Prazo para Devolução (dias)</label>
                <input
                  type="number"
                  min="1"
                  value={returnDeadlineDays}
                  onChange={(e) => setReturnDeadlineDays(parseInt(e.target.value) || 30)}
                  className="w-full px-3 py-2 border-2 border-gray-300 dark:border-slate-600 rounded-lg focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Comissão do Cliente (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={commissionPercent}
                  onChange={(e) => setCommissionPercent(parseFloat(e.target.value) || 0)}
                  placeholder="Deixe 0 se não houver comissão"
                  className="w-full px-3 py-2 border-2 border-gray-300 dark:border-slate-600 rounded-lg focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Condições de Pagamento</label>
              <textarea
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-slate-600 rounded-lg focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Observações Adicionais (Opcional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Adicione informações extras sobre a consignação..."
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-slate-600 rounded-lg focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Usage Banner */}
          {!loadingSubscription && subscription && subscription.tier && (
            <div className={`mb-6 p-4 rounded-lg border-2 ${
              subscription.allowed
                ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                : 'bg-red-50 dark:bg-red-900/20 border-red-500'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 dark:text-white">
                    📊 Plano {subscription.tier.toUpperCase()}:
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {subscription.is_unlimited ? (
                      <>Documentos <strong>ilimitados</strong></>
                    ) : (
                      <>
                        <strong>{subscription.current}</strong> de <strong>{subscription.max}</strong> documentos usados
                        {subscription.remaining !== null && subscription.remaining > 0 && (
                          <span className="ml-2 text-green-600 dark:text-green-400 font-semibold">
                            ({subscription.remaining} restantes)
                          </span>
                        )}
                      </>
                    )}
                  </span>
                </div>
                {!subscription.is_unlimited && subscription.remaining !== null && subscription.remaining === 0 && (
                  <button
                    onClick={() => router.push('/upgrade')}
                    className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded text-sm transition-all"
                  >
                    Fazer Upgrade
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerateConsignment}
            disabled={isGenerating || !selectedClientId}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 text-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {isGenerating ? 'Gerando PDF...' : 'Gerar Termo de Consignação (PDF)'}
          </button>

          <p className="mt-4 text-center text-slate-500 dark:text-slate-400 text-sm">
            💡 O termo de consignação será salvo automaticamente no seu histórico
          </p>
        </div>

        {/* Footer Premium - PADRÃO IGUAL À CALCULADORA */}
        <footer className="mt-16 pt-12 pb-8 bg-gradient-to-r from-black via-slate-900 to-black border-t-4 border-orange-500 rounded-t-2xl">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">Precifica3D</span>
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Sistema profissional de precificação para impressão 3D com suporte completo para impressoras Bambu Lab.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-orange-400 mb-3 uppercase tracking-wider text-sm">Funcionalidades</h3>
                <ul className="text-sm text-slate-300 space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
                    Orçamentos e contratos
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
                    Termos de consignação
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
                    Gestão de clientes
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
                    Cálculo preciso de custos
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-amber-400 mb-3 uppercase tracking-wider text-sm">Informações</h3>
                <ul className="text-sm text-slate-300 space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"></div>
                    Dados de energia: 01/2025
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"></div>
                    5 modelos Bambu Lab
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"></div>
                    32 distribuidoras Brasil
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"></div>
                    40+ itens de adereços
                  </li>
                </ul>
              </div>
            </div>
            <div className="text-center pt-8 border-t border-orange-900/50">
              <p className="text-sm text-slate-300 mb-2">
                © 2025 <strong className="text-transparent bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text font-black">Precifica3D PRO</strong> - Calculadora Profissional para Impressão 3D
              </p>
              <p className="text-xs text-orange-300/60">
                Todos os direitos reservados
              </p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
