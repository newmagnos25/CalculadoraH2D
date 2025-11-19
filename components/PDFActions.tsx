'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CalculationResult, ClientData, ProjectStatus, FileAttachment } from '@/lib/types';
import { getCompanySettings, getClients, getNextInvoiceNumber, incrementInvoiceCounter } from '@/lib/storage';
import { generateAndDownloadQuote, generateAndDownloadContract, getCurrentDate, getDefaultValidityDate } from '@/lib/pdf-utils';
import { createClient } from '@/lib/supabase/client';
import { useSubscription } from '@/lib/hooks/useSubscription';
import { showMotivationalPopup } from '@/lib/motivational-popups';
import ClientManager from './ClientManager';
import { StatusSelector } from './StatusBadge';
import AttachmentManager from './AttachmentManager';
import Collapse from './Collapse';

interface PDFActionsProps {
  calculation: CalculationResult;
  printDetails: {
    itemDescription?: string;
    quantity?: number;
    dimensions?: string;
    productImage?: string;
    printer: string;
    filaments: string;
    filamentColors?: { name: string; color: string; weight: number }[];
    weight: number;
    printTime: number;
  };
  quoteId?: string | null; // Se tiver ID, PDF é grátis (já calculado)
}

export default function PDFActions({ calculation, printDetails, quoteId }: PDFActionsProps) {
  const router = useRouter();
  const { subscription, loading: loadingSubscription, refresh: refreshSubscription } = useSubscription();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [showClientManager, setShowClientManager] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string, showSettingsButton?: boolean } | null>(null);
  const [projectStatus, setProjectStatus] = useState<ProjectStatus>('quote');
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);

  const handleSelectClient = (client: ClientData | null) => {
    if (client) {
      setSelectedClientId(client.id);
      setShowClientManager(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string, showSettingsButton?: boolean) => {
    setMessage({ type, text, showSettingsButton });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleGenerateQuote = async () => {
    // Se já tem quoteId (já calculou), PDF é GRÁTIS - só verificar empresa
    const isPDFFree = !!quoteId;

    // Verificar limite apenas se não for PDF grátis
    if (!isPDFFree) {
      if (!subscription) {
        showMessage('error', 'Carregando informações da assinatura...');
        return;
      }

      if (!subscription.allowed) {
        // Redirecionar para upgrade
        router.push('/upgrade');
        return;
      }
    }

    const company = getCompanySettings();
    if (!company || !company.name) {
      showMessage('error', 'Configure os dados da empresa primeiro para gerar documentos', true);
      return;
    }

    setIsGenerating(true);

    try {
      const clients = getClients();
      const client = selectedClientId ? clients.find(c => c.id === selectedClientId) || null : null;

      const quoteNumber = getNextInvoiceNumber();
      const date = getCurrentDate();
      const validUntil = getDefaultValidityDate(7); // 7 dias

      const success = await generateAndDownloadQuote({
        company,
        client,
        calculation,
        quoteNumber,
        date,
        validUntil,
        projectStatus,
        printDetails,
      });

      if (success) {
        // Só salvar no banco e gastar crédito se não for PDF grátis
        if (!isPDFFree) {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();

          if (user) {
            await supabase.from('quotes').insert({
              user_id: user.id,
              quote_data: {
                calculation,
                printDetails,
                quoteNumber,
                date,
                client: client ? { name: client.name, email: client.email } : null,
                type: 'pdf_only', // PDF gerado sem cálculo prévio
              },
            });
          }

          await refreshSubscription(); // Atualizar contador

          // Mostrar popup motivacional após consumir crédito
          if (subscription && !subscription.is_unlimited) {
            const newRemaining = (subscription.remaining || 0) - 1;
            showMotivationalPopup(newRemaining, subscription.max || 0);
          }
        }

        incrementInvoiceCounter();

        const successMessage = isPDFFree
          ? `✅ PDF ${quoteNumber} gerado GRÁTIS (orçamento já calculado)!`
          : `✅ PDF ${quoteNumber} gerado! 1 crédito consumido.`;
        showMessage('success', successMessage);
      } else {
        showMessage('error', 'Erro ao gerar orçamento. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro:', error);
      showMessage('error', 'Erro ao gerar orçamento. Verifique os dados.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateContract = async () => {
    // Verificar limite primeiro (contratos também contam como documentos)
    if (!subscription) {
      showMessage('error', 'Carregando informações da assinatura...');
      return;
    }

    if (!subscription.allowed) {
      // Redirecionar para upgrade
      router.push('/upgrade');
      return;
    }

    const company = getCompanySettings();
    if (!company || !company.name) {
      showMessage('error', 'Configure os dados da empresa primeiro para gerar documentos', true);
      return;
    }

    const clients = getClients();
    const client = selectedClientId ? clients.find(c => c.id === selectedClientId) : null;

    if (!client) {
      showMessage('error', 'Selecione um cliente para gerar o contrato');
      return;
    }

    setIsGenerating(true);

    try {
      const contractNumber = getNextInvoiceNumber();
      const date = getCurrentDate();

      // Montar descrição com as novas informações
      let description = 'Serviço de impressão 3D\n';
      if (printDetails.itemDescription) {
        description += `Item: ${printDetails.itemDescription}\n`;
      }
      if (printDetails.quantity && printDetails.quantity > 1) {
        description += `Quantidade: ${printDetails.quantity} unidades\n`;
      }
      if (printDetails.dimensions) {
        description += `Dimensões: ${printDetails.dimensions}\n`;
      }
      description += `Impressora: ${printDetails.printer}\n`;
      description += `Filamento(s): ${printDetails.filaments}\n`;
      description += `Peso total: ${printDetails.weight}g\n`;
      description += `Tempo de impressão: ${Math.floor(printDetails.printTime / 60)}h ${printDetails.printTime % 60}min`;

      const success = await generateAndDownloadContract({
        company,
        client,
        contractNumber,
        date,
        totalValue: calculation.finalPrice,
        description,
        deliveryDays: 7,
      });

      if (success) {
        // Salvar no Supabase também para contar no limite
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          await supabase.from('quotes').insert({
            user_id: user.id,
            quote_data: {
              calculation,
              printDetails,
              contractNumber,
              date,
              client: { name: client.name, email: client.email },
              type: 'contract',
            },
          });
        }

        incrementInvoiceCounter();
        await refreshSubscription(); // Atualizar contador
        showMessage('success', `Contrato ${contractNumber} gerado com sucesso!`);

        // Mostrar popup motivacional após consumir crédito
        if (subscription && !subscription.is_unlimited) {
          const newRemaining = (subscription.remaining || 0) - 1;
          showMotivationalPopup(newRemaining, subscription.max || 0);
        }
      } else {
        showMessage('error', 'Erro ao gerar contrato. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro:', error);
      showMessage('error', 'Erro ao gerar contrato. Verifique os dados.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mt-6 space-y-4">
      {/* Message Alert */}
      {message && (
        <div className={`p-4 rounded-lg border-2 ${
          message.type === 'success'
            ? 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-800 dark:text-green-200'
            : 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-800 dark:text-red-200'
        }`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1">
              {message.type === 'success' ? (
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span className="font-semibold text-sm">{message.text}</span>
            </div>
            {message.showSettingsButton && (
              <button
                onClick={() => router.push('/settings')}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white font-bold rounded-lg text-sm transition-all whitespace-nowrap flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Configurar Agora
              </button>
            )}
          </div>
        </div>
      )}

      {/* Project Status */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/40 dark:to-gray-900/40 border-2 border-slate-300 dark:border-slate-700 rounded-lg p-4">
        <StatusSelector value={projectStatus} onChange={setProjectStatus} />
      </div>

      {/* Client Selection */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-300 dark:border-blue-800 rounded-lg p-4">
        <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Cliente (Opcional para Orçamento, Obrigatório para Contrato)
        </h3>

        {!showClientManager ? (
          <ClientManager selectedClientId={selectedClientId} onClientSelect={handleSelectClient} />
        ) : (
          <ClientManager selectedClientId={selectedClientId} onClientSelect={handleSelectClient} />
        )}
      </div>

      {/* File Attachments */}
      <Collapse
        title="📎 Anexos do Projeto (Opcional)"
        defaultOpen={false}
        variant="technical"
      >
        <AttachmentManager
          attachments={attachments}
          onChange={setAttachments}
          maxSizeMB={10}
        />
      </Collapse>

      {/* Usage Banner */}
      {!loadingSubscription && subscription && subscription.tier && (
        <div className={`p-4 rounded-lg border-2 ${
          subscription.allowed
            ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
            : 'bg-red-50 dark:bg-red-900/20 border-red-500'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white">
                📊 Plano {subscription.tier.toUpperCase()}:
              </span>
              <span className="text-slate-700 dark:text-slate-300">
                {subscription.is_unlimited ? (
                  <>Orçamentos <strong>ilimitados</strong></>
                ) : (
                  <>
                    <strong>{subscription.current}</strong> de <strong>{subscription.max}</strong> orçamentos usados este mês
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

      {/* PDF Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={handleGenerateQuote}
          disabled={isGenerating}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold rounded-lg shadow-lg transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {isGenerating ? 'Gerando...' : 'Gerar Orçamento (PDF)'}
        </button>

        <button
          onClick={handleGenerateContract}
          disabled={isGenerating || !selectedClientId}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold rounded-lg shadow-lg transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {isGenerating ? 'Gerando...' : 'Gerar Contrato (PDF)'}
        </button>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
        💡 Configure os dados da empresa em Configurações antes de gerar documentos
      </p>
    </div>
  );
}
