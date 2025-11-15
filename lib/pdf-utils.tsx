import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { CompanySettings, ClientData, CalculationResult, ProjectStatus } from './types';
import PDFQuote from '@/components/PDFQuote';
import PDFContract from '@/components/PDFContract';

export interface GenerateQuotePDFParams {
  company: CompanySettings;
  client: ClientData | null;
  calculation: CalculationResult;
  quoteNumber: string;
  date: string;
  validUntil: string;
  notes?: string;
  projectStatus?: ProjectStatus;
  printDetails: {
    printer: string;
    filaments: string;
    filamentColors?: { name: string; color: string; weight: number }[]; // Cores dos filamentos
    weight: number;
    printTime: number;
  };
}

export interface GenerateContractPDFParams {
  company: CompanySettings;
  client: ClientData;
  contractNumber: string;
  date: string;
  totalValue: number;
  description: string;
  deliveryDays?: number;
}

/**
 * Gera e faz download do PDF de orçamento
 */
export async function generateAndDownloadQuote(params: GenerateQuotePDFParams) {
  try {
    const blob = await pdf(<PDFQuote {...params} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Orcamento_${params.quoteNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Erro ao gerar PDF de orçamento:', error);
    return false;
  }
}

/**
 * Gera e faz download do PDF de contrato
 */
export async function generateAndDownloadContract(params: GenerateContractPDFParams) {
  try {
    const blob = await pdf(<PDFContract {...params} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Contrato_${params.contractNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Erro ao gerar PDF de contrato:', error);
    return false;
  }
}

/**
 * Gera Blob do PDF de orçamento (sem fazer download)
 */
export async function generateQuoteBlob(params: GenerateQuotePDFParams): Promise<Blob | null> {
  try {
    const blob = await pdf(<PDFQuote {...params} />).toBlob();
    return blob;
  } catch (error) {
    console.error('Erro ao gerar blob do orçamento:', error);
    return null;
  }
}

/**
 * Gera Blob do PDF de contrato (sem fazer download)
 */
export async function generateContractBlob(params: GenerateContractPDFParams): Promise<Blob | null> {
  try {
    const blob = await pdf(<PDFContract {...params} />).toBlob();
    return blob;
  } catch (error) {
    console.error('Erro ao gerar blob do contrato:', error);
    return null;
  }
}

/**
 * Formata data para validade do orçamento (7 dias a partir de hoje)
 */
export function getDefaultValidityDate(daysFromNow: number = 7): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
}

/**
 * Formata data atual
 */
export function getCurrentDate(): string {
  return new Date().toISOString();
}
