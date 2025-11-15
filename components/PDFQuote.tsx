'use client';

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { CompanySettings, ClientData, CalculationResult } from '@/lib/types';
import { formatCurrency } from '@/lib/calculator';

// Estilos do PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginBottom: 20,
    borderBottom: '3 solid #F97316',
    paddingBottom: 15,
  },
  logoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  logo: {
    width: 80,
    height: 80,
    objectFit: 'contain',
  },
  companyInfo: {
    textAlign: 'right',
    fontSize: 9,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F97316',
    marginBottom: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 20,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#F97316',
    marginBottom: 8,
    borderBottom: '1 solid #FED7AA',
    paddingBottom: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    fontSize: 9,
    color: '#6B7280',
  },
  value: {
    fontSize: 9,
    color: '#1F2937',
    fontWeight: 'bold',
  },
  table: {
    marginTop: 10,
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#FED7AA',
    padding: 8,
    fontWeight: 'bold',
    fontSize: 9,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #E5E7EB',
    padding: 8,
    fontSize: 9,
  },
  col1: { width: '50%' },
  col2: { width: '15%', textAlign: 'right' },
  col3: { width: '15%', textAlign: 'right' },
  col4: { width: '20%', textAlign: 'right', fontWeight: 'bold' },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 10,
    fontSize: 9,
  },
  breakdownLabel: {
    color: '#6B7280',
  },
  breakdownValue: {
    color: '#1F2937',
  },
  totalBox: {
    backgroundColor: '#FFF7ED',
    border: '2 solid #F97316',
    borderRadius: 5,
    padding: 15,
    marginTop: 15,
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 12,
    color: '#F97316',
    marginBottom: 5,
  },
  totalValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#EA580C',
    textAlign: 'center',
  },
  notes: {
    fontSize: 8,
    color: '#6B7280',
    lineHeight: 1.4,
    marginTop: 10,
    padding: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#9CA3AF',
    borderTop: '1 solid #E5E7EB',
    paddingTop: 10,
  },
  validUntil: {
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 5,
    fontSize: 9,
    color: '#92400E',
    marginBottom: 15,
    textAlign: 'center',
  },
});

interface PDFQuoteProps {
  company: CompanySettings;
  client: ClientData | null;
  calculation: CalculationResult;
  quoteNumber: string;
  date: string;
  validUntil: string;
  notes?: string;
  printDetails: {
    printer: string;
    filaments: string;
    weight: number;
    printTime: number;
  };
}

export const PDFQuote: React.FC<PDFQuoteProps> = ({
  company,
  client,
  calculation,
  quoteNumber,
  date,
  validUntil,
  notes,
  printDetails,
}) => {
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR');
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoSection}>
            <View>
              {company.logo && (
                <Image src={company.logo} style={styles.logo} />
              )}
            </View>
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>{company.tradeName || company.name}</Text>
              <Text>{company.name}</Text>
              {company.cnpj && <Text>CNPJ: {company.cnpj}</Text>}
              <Text>{company.address}</Text>
              <Text>{company.city} - {company.state}, {company.zipCode}</Text>
              <Text>{company.phone}</Text>
              <Text>{company.email}</Text>
              {company.website && <Text>{company.website}</Text>}
            </View>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>ORÇAMENTO</Text>
        <Text style={styles.subtitle}>Nº {quoteNumber}</Text>

        {/* Validade */}
        <View style={styles.validUntil}>
          <Text>Orçamento válido até {formatDate(validUntil)}</Text>
        </View>

        {/* Info do Orçamento */}
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={{ width: '50%' }}>
              <Text style={styles.label}>Data de Emissão</Text>
              <Text style={styles.value}>{formatDate(date)}</Text>
            </View>
            <View style={{ width: '50%', textAlign: 'right' }}>
              <Text style={styles.label}>Número do Orçamento</Text>
              <Text style={styles.value}>{quoteNumber}</Text>
            </View>
          </View>
        </View>

        {/* Dados do Cliente */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DADOS DO CLIENTE</Text>
          {client ? (
            <>
              <View style={styles.row}>
                <Text style={styles.label}>Nome/Razão Social:</Text>
                <Text style={styles.value}>{client.name}</Text>
              </View>
              {client.cpfCnpj && (
                <View style={styles.row}>
                  <Text style={styles.label}>CPF/CNPJ:</Text>
                  <Text style={styles.value}>{client.cpfCnpj}</Text>
                </View>
              )}
              {client.phone && (
                <View style={styles.row}>
                  <Text style={styles.label}>Telefone:</Text>
                  <Text style={styles.value}>{client.phone}</Text>
                </View>
              )}
              {client.email && (
                <View style={styles.row}>
                  <Text style={styles.label}>E-mail:</Text>
                  <Text style={styles.value}>{client.email}</Text>
                </View>
              )}
              {client.address && (
                <View style={styles.row}>
                  <Text style={styles.label}>Endereço:</Text>
                  <Text style={styles.value}>{client.address}, {client.city} - {client.state}</Text>
                </View>
              )}
            </>
          ) : (
            <Text style={styles.label}>Cliente não especificado</Text>
          )}
        </View>

        {/* Especificações da Impressão */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ESPECIFICAÇÕES DA IMPRESSÃO 3D</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Impressora:</Text>
            <Text style={styles.value}>{printDetails.printer}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Filamento(s):</Text>
            <Text style={styles.value}>{printDetails.filaments}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Peso Total:</Text>
            <Text style={styles.value}>{printDetails.weight}g</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tempo de Impressão:</Text>
            <Text style={styles.value}>{formatTime(printDetails.printTime)}</Text>
          </View>
        </View>

        {/* Detalhamento de Custos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DETALHAMENTO DE CUSTOS</Text>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.col1}>Descrição</Text>
              <Text style={styles.col4}>Valor</Text>
            </View>

            {calculation.breakdown.map((item, idx) => (
              <View key={idx} style={styles.tableRow}>
                <Text style={styles.col1}>{item.item}</Text>
                <Text style={styles.col4}>{formatCurrency(item.value)}</Text>
              </View>
            ))}

            <View style={[styles.tableRow, { backgroundColor: '#F9FAFB', marginTop: 10 }]}>
              <Text style={[styles.col1, { fontWeight: 'bold' }]}>Subtotal (Custos)</Text>
              <Text style={styles.col4}>{formatCurrency(calculation.costs.total)}</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.col1, { color: '#F97316' }]}>Lucro ({calculation.profitMargin}%)</Text>
              <Text style={[styles.col4, { color: '#F97316' }]}>{formatCurrency(calculation.profitValue)}</Text>
            </View>
          </View>
        </View>

        {/* Total */}
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>VALOR TOTAL DO ORÇAMENTO</Text>
          <Text style={styles.totalValue}>{formatCurrency(calculation.finalPrice)}</Text>
        </View>

        {/* Condições de Pagamento */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONDIÇÕES DE PAGAMENTO</Text>
          <Text style={{ fontSize: 9, lineHeight: 1.4 }}>{company.paymentTerms}</Text>
          {company.bankDetails && (
            <View style={{ marginTop: 8 }}>
              <Text style={[styles.label, { marginBottom: 3 }]}>Dados Bancários:</Text>
              <Text style={{ fontSize: 9, lineHeight: 1.4 }}>{company.bankDetails}</Text>
            </View>
          )}
        </View>

        {/* Observações */}
        {(notes || company.legalNotes) && (
          <View style={styles.notes}>
            {notes && <Text style={{ marginBottom: 5 }}>📝 {notes}</Text>}
            {company.legalNotes && <Text>{company.legalNotes}</Text>}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            © {new Date().getFullYear()} {company.tradeName || company.name} - Orçamento gerado em {formatDate(date)}
          </Text>
          <Text>CalculadoraH2D PRO by BKreativeLab - Precificação Profissional para Impressão 3D</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PDFQuote;
