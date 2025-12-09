'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/calculator')}
            className="mb-4 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">📦 Termo de Consignação</h1>
          <p className="text-white/70">Gere termos de consignação profissionais para seus clientes</p>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border-2 ${
            message.type === 'success'
              ? 'bg-green-50 border-green-500 text-green-800'
              : 'bg-red-50 border-red-500 text-red-800'
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
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Cliente (Obrigatório)
          </h2>
          <ClientManager selectedClientId={selectedClientId} onClientSelect={handleSelectClient} />
        </div>

        {/* Items */}
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Itens Consignados
            </h2>
            <button
              onClick={addItem}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Adicionar Item
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-gray-700">Item {index + 1}</h3>
                  {items.length > 1 && (
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Descrição</label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder="Ex: Miniatura de dragão impresso em PLA"
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Quantidade</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Preço Unit. (R$)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-3 text-right">
                  <span className="text-sm text-gray-600">Total: </span>
                  <span className="text-lg font-bold text-blue-600">
                    R$ {item.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t-2 border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-gray-900">Valor Total da Consignação:</span>
              <span className="text-3xl font-bold text-blue-600">R$ {calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Conditions */}
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Condições da Consignação
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Prazo para Devolução (dias)</label>
              <input
                type="number"
                min="1"
                value={returnDeadlineDays}
                onChange={(e) => setReturnDeadlineDays(parseInt(e.target.value) || 30)}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Comissão do Cliente (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={commissionPercent}
                onChange={(e) => setCommissionPercent(parseFloat(e.target.value) || 0)}
                placeholder="Deixe 0 se não houver comissão"
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Condições de Pagamento</label>
            <textarea
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Observações Adicionais (Opcional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Adicione informações extras sobre a consignação..."
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Usage Banner */}
        {!loadingSubscription && subscription && subscription.tier && (
          <div className={`mb-6 p-4 rounded-lg border-2 ${
            subscription.allowed
              ? 'bg-green-50 border-green-500'
              : 'bg-red-50 border-red-500'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900">
                  📊 Plano {subscription.tier.toUpperCase()}:
                </span>
                <span className="text-gray-700">
                  {subscription.is_unlimited ? (
                    <>Documentos <strong>ilimitados</strong></>
                  ) : (
                    <>
                      <strong>{subscription.current}</strong> de <strong>{subscription.max}</strong> documentos usados
                      {subscription.remaining !== null && subscription.remaining > 0 && (
                        <span className="ml-2 text-green-600 font-semibold">
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

        <p className="mt-4 text-center text-white/60 text-sm">
          💡 O termo de consignação será salvo automaticamente no seu histórico
        </p>
      </div>
    </div>
  );
}
