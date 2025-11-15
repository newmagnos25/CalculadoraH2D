'use client';

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { CompanySettings, ClientData, CalculationResult } from '@/lib/types';
import { formatCurrency } from '@/lib/calculator';

// Estilos do PDF - Mais clean e profissional
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
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  logo: {
    width: 70,
    height: 70,
    objectFit: 'contain',
  },
  companyInfo: {
    textAlign: 'right',
    fontSize: 8,
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F97316',
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 20,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 11,
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
  validUntil: {
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 5,
    fontSize: 9,
    color: '#92400E',
    marginBottom: 15,
    textAlign: 'center',
  },
  serviceBox: {
    backgroundColor: '#FFF7ED',
    border: '2 solid #FDBA74',
    borderRadius: 5,
    padding: 15,
    marginTop: 10,
    marginBottom: 15,
  },
  serviceTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#EA580C',
    marginBottom: 8,
  },
  serviceDesc: {
    fontSize: 9,
    color: '#1F2937',
    lineHeight: 1.5,
  },
  specGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  specItem: {
    width: '48%',
  },
  specLabel: {
    fontSize: 8,
    color: '#78716C',
    marginBottom: 2,
  },
  specValue: {
    fontSize: 9,
    color: '#1F2937',
    fontWeight: 'bold',
  },
  totalBox: {
    backgroundColor: '#F97316',
    border: '3 solid #EA580C',
    borderRadius: 8,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 11,
    color: '#FFF',
    marginBottom: 8,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  totalValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  paymentBox: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 5,
    marginBottom: 15,
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
    fontSize: 7,
    color: '#9CA3AF',
    borderTop: '1 solid #E5E7EB',
    paddingTop: 10,
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

        {/* Descrição do Serviço */}
        <View style={styles.serviceBox}>
          <Text style={styles.serviceTitle}>SERVIÇO DE IMPRESSÃO 3D</Text>
          <Text style={styles.serviceDesc}>
            Serviço especializado de manufatura aditiva (impressão 3D) com acabamento profissional,
            utilizando equipamentos de alta precisão e materiais de qualidade premium.
          </Text>

          {/* Especificações Técnicas */}
          <View style={{ marginTop: 12, paddingTop: 12, borderTop: '1 solid #FDBA74' }}>
            <Text style={[styles.label, { marginBottom: 6, fontSize: 8, fontWeight: 'bold' }]}>
              ESPECIFICAÇÕES TÉCNICAS:
            </Text>

            <View style={styles.specGrid}>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Equipamento:</Text>
                <Text style={styles.specValue}>{printDetails.printer}</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Tempo de Produção:</Text>
                <Text style={styles.specValue}>{formatTime(printDetails.printTime)}</Text>
              </View>
            </View>

            <View style={[styles.specGrid, { marginTop: 6 }]}>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Material Utilizado:</Text>
                <Text style={styles.specValue}>{printDetails.filaments}</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Peso do Material:</Text>
                <Text style={styles.specValue}>{printDetails.weight}g</Text>
              </View>
            </View>
          </View>
        </View>

        {/* VALOR TOTAL - Destaque máximo */}
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Valor Total do Serviço</Text>
          <Text style={styles.totalValue}>{formatCurrency(calculation.finalPrice)}</Text>
        </View>

        {/* Condições de Pagamento */}
        <View style={styles.paymentBox}>
          <Text style={[styles.sectionTitle, { marginBottom: 6 }]}>CONDIÇÕES DE PAGAMENTO</Text>
          <Text style={{ fontSize: 9, lineHeight: 1.4 }}>{company.paymentTerms}</Text>
          {company.bankDetails && (
            <View style={{ marginTop: 6 }}>
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
          <Text style={{ marginTop: 2 }}>CalculadoraH2D PRO by BKreativeLab</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PDFQuote;
