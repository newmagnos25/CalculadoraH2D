'use client';

import { useState, useEffect } from 'react';
import { CalculationResult, ClientData, ProjectStatus } from '@/lib/types';
import { getCompanySettings, getClients, getNextInvoiceNumber, incrementInvoiceCounter } from '@/lib/storage';
import { generateAndDownloadQuote, generateAndDownloadContract, getCurrentDate, getDefaultValidityDate } from '@/lib/pdf-utils';
import ClientManager from './ClientManager';
import { StatusSelector } from './StatusBadge';

interface PDFActionsProps {
  calculation: CalculationResult;
  printDetails: {
    printer: string;
    filaments: string;
    weight: number;
    printTime: number;
  };
}

export default function PDFActions({ calculation, printDetails }: PDFActionsProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [showClientManager, setShowClientManager] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [projectStatus, setProjectStatus] = useState<ProjectStatus>('quote');

  const handleSelectClient = (client: ClientData | null) => {
    if (client) {
      setSelectedClientId(client.id);
      setShowClientManager(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleGenerateQuote = async () => {
    const company = getCompanySettings();
    if (!company || !company.name) {
      showMessage('error', 'Configure os dados da empresa primeiro em Configurações');
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
        incrementInvoiceCounter();
        showMessage('success', `Orçamento ${quoteNumber} gerado com sucesso!`);
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
    const company = getCompanySettings();
    if (!company || !company.name) {
      showMessage('error', 'Configure os dados da empresa primeiro em Configurações');
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

      const description = `Serviço de impressão 3D\nImpressora: ${printDetails.printer}\nFilamento(s): ${printDetails.filaments}\nPeso: ${printDetails.weight}g\nTempo de impressão: ${Math.floor(printDetails.printTime / 60)}h ${printDetails.printTime % 60}min`;

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
        incrementInvoiceCounter();
        showMessage('success', `Contrato ${contractNumber} gerado com sucesso!`);
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
            <span className="font-semibold text-sm">{message.text}</span>
          </div>
        </div>
      )}

      {/* Project Status */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-2 border-orange-300 dark:border-orange-800 rounded-lg p-4">
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
