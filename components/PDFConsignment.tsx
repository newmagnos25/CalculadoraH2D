'use client';

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { CompanySettings, ClientData } from '@/lib/types';
import { formatCurrency } from '@/lib/calculator';

// Função para criar estilos dinâmicos baseados na cor da marca
const createStyles = (brandColor: string = '#F97316') => StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginBottom: 10,
    borderBottom: `2 solid ${brandColor}`,
    paddingBottom: 8,
  },
  logoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  logo: {
    width: 50,
    height: 50,
    objectFit: 'contain',
  },
  companyInfo: {
    textAlign: 'right',
    fontSize: 7,
  },
  companyName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: brandColor,
    marginBottom: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 9,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 10,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: brandColor,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  paragraph: {
    fontSize: 8,
    lineHeight: 1.4,
    textAlign: 'justify',
    marginBottom: 5,
    color: '#374151',
  },
  bold: {
    fontWeight: 'bold',
  },
  highlight: {
    backgroundColor: '#FEF3C7',
    padding: 6,
    borderRadius: 4,
    marginVertical: 5,
  },
  table: {
    marginVertical: 10,
    border: '1 solid #E5E7EB',
    borderRadius: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: brandColor,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableHeaderText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #E5E7EB',
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
  },
  tableRowAlt: {
    backgroundColor: '#F9FAFB',
  },
  tableCell: {
    fontSize: 8,
    color: '#374151',
  },
  tableCellBold: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  totalRow: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderTop: `2 solid ${brandColor}`,
  },
  conditionsBox: {
    backgroundColor: '#FFF7ED',
    border: `1 solid ${brandColor}`,
    borderRadius: 4,
    padding: 8,
    marginVertical: 8,
  },
  conditionItem: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'flex-start',
  },
  conditionBullet: {
    fontSize: 9,
    color: brandColor,
    marginRight: 5,
    fontWeight: 'bold',
  },
  conditionText: {
    fontSize: 8,
    lineHeight: 1.4,
    color: '#374151',
    flex: 1,
  },
  signatureSection: {
    marginTop: 20,
    marginBottom: 10,
  },
  signatureBox: {
    marginTop: 30,
    paddingTop: 10,
  },
  signatureLine: {
    borderTop: '1 solid #1F2937',
    width: '60%',
    marginHorizontal: 'auto',
    paddingTop: 4,
  },
  signatureLabel: {
    fontSize: 8,
    textAlign: 'center',
    color: '#6B7280',
  },
  footer: {
    position: 'absolute',
    bottom: 15,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 6,
    color: '#9CA3AF',
    borderTop: '1 solid #E5E7EB',
    paddingTop: 6,
  },
  warningBox: {
    backgroundColor: '#FEE2E2',
    border: '1 solid #EF4444',
    borderRadius: 4,
    padding: 8,
    marginVertical: 8,
  },
  warningText: {
    fontSize: 8,
    color: '#991B1B',
    lineHeight: 1.4,
  },
});

export interface ConsignmentItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  itemImage?: string;
}

interface PDFConsignmentProps {
  company: CompanySettings;
  client: ClientData;
  consignmentNumber: string;
  date: string;
  items: ConsignmentItem[];
  conditions: {
    returnDeadlineDays: number; // Prazo para devolução
    commissionPercent?: number; // Percentual de comissão (se houver)
    paymentTerms: string; // Condições de pagamento dos itens vendidos
    notes?: string; // Observações adicionais
  };
}

export const PDFConsignment: React.FC<PDFConsignmentProps> = ({
  company,
  client,
  consignmentNumber,
  date,
  items,
  conditions,
}) => {
  const styles = createStyles(company.brandColor || '#F97316');

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const calculateReturnDate = (startDate: string, days: number) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const totalValue = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

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
              {company.cnpj && <Text>CNPJ: {company.cnpj}</Text>}
              <Text>{company.address}, {company.city} - {company.state}</Text>
              <Text>{company.phone} | {company.email}</Text>
            </View>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>TERMO DE CONSIGNAÇÃO</Text>
        <Text style={styles.subtitle}>Nº {consignmentNumber}</Text>

        {/* Warning Box */}
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            ⚠️ IMPORTANTE: Este documento registra a entrega de mercadorias em regime de consignação.
            O consignatário não adquire propriedade dos itens, apenas custódia temporária.
          </Text>
        </View>

        {/* Partes */}
        <View style={styles.section}>
          <Text style={styles.paragraph}>
            Pelo presente termo de consignação, de um lado:
          </Text>

          <View style={styles.highlight}>
            <Text style={[styles.paragraph, styles.bold]}>CONSIGNANTE (Proprietário):</Text>
            <Text style={styles.paragraph}>
              {company.name}
              {company.cnpj && `, inscrita no CNPJ sob nº ${company.cnpj}`}
              , com sede em {company.address}, {company.city} - {company.state}
              , telefone: {company.phone}, e-mail: {company.email}
            </Text>
          </View>

          <Text style={styles.paragraph}>E de outro lado:</Text>

          <View style={styles.highlight}>
            <Text style={[styles.paragraph, styles.bold]}>CONSIGNATÁRIO (Depositário):</Text>
            <Text style={styles.paragraph}>
              {client.name}
              {client.cpfCnpj && `, inscrito(a) no CPF/CNPJ sob nº ${client.cpfCnpj}`}
              {client.address && `, com endereço em ${client.address}, ${client.city} - ${client.state}`}
              {client.email && `, e-mail: ${client.email}`}
              {client.phone && `, telefone: ${client.phone}`}
            </Text>
          </View>
        </View>

        {/* Data e Prazos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PRAZOS</Text>
          <View style={styles.paragraph}>
            <Text style={styles.bold}>Data de Entrega: </Text>
            <Text>{formatDate(date)}</Text>
          </View>
          <View style={styles.paragraph}>
            <Text style={styles.bold}>Prazo para Devolução ou Pagamento: </Text>
            <Text>{calculateReturnDate(date, conditions.returnDeadlineDays)} ({conditions.returnDeadlineDays} dias)</Text>
          </View>
        </View>

        {/* Lista de Itens */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ITENS CONSIGNADOS</Text>

          <View style={styles.table}>
            {/* Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { width: '50%' }]}>Descrição</Text>
              <Text style={[styles.tableHeaderText, { width: '15%', textAlign: 'center' }]}>Qtd.</Text>
              <Text style={[styles.tableHeaderText, { width: '17.5%', textAlign: 'right' }]}>Preço Unit.</Text>
              <Text style={[styles.tableHeaderText, { width: '17.5%', textAlign: 'right' }]}>Total</Text>
            </View>

            {/* Rows */}
            {items.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.tableRow,
                  index % 2 === 1 ? styles.tableRowAlt : {}
                ]}
              >
                <Text style={[styles.tableCell, { width: '50%' }]}>{item.description}</Text>
                <Text style={[styles.tableCellBold, { width: '15%', textAlign: 'center' }]}>{item.quantity}</Text>
                <Text style={[styles.tableCell, { width: '17.5%', textAlign: 'right' }]}>{formatCurrency(item.unitPrice)}</Text>
                <Text style={[styles.tableCellBold, { width: '17.5%', textAlign: 'right' }]}>{formatCurrency(item.totalPrice)}</Text>
              </View>
            ))}

            {/* Total */}
            <View style={styles.totalRow}>
              <Text style={[styles.tableCellBold, { width: '50%' }]}>TOTAL</Text>
              <Text style={[styles.tableCellBold, { width: '15%', textAlign: 'center' }]}>{totalQuantity}</Text>
              <Text style={[styles.tableCellBold, { width: '17.5%' }]}></Text>
              <Text style={[styles.tableCellBold, { width: '17.5%', textAlign: 'right' }]}>{formatCurrency(totalValue)}</Text>
            </View>
          </View>
        </View>

        {/* Condições */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONDIÇÕES DA CONSIGNAÇÃO</Text>

          <View style={styles.conditionsBox}>
            <View style={styles.conditionItem}>
              <Text style={styles.conditionBullet}>1.</Text>
              <Text style={styles.conditionText}>
                <Text style={styles.bold}>PROPRIEDADE:</Text> Os itens relacionados permanecem de propriedade exclusiva do CONSIGNANTE
                até que sejam vendidos e integralmente pagos pelo CONSIGNATÁRIO.
              </Text>
            </View>

            <View style={styles.conditionItem}>
              <Text style={styles.conditionBullet}>2.</Text>
              <Text style={styles.conditionText}>
                <Text style={styles.bold}>PRAZO:</Text> O CONSIGNATÁRIO terá o prazo de {conditions.returnDeadlineDays} dias corridos
                para vender os itens consignados ou devolvê-los em perfeito estado ao CONSIGNANTE.
              </Text>
            </View>

            <View style={styles.conditionItem}>
              <Text style={styles.conditionBullet}>3.</Text>
              <Text style={styles.conditionText}>
                <Text style={styles.bold}>RESPONSABILIDADE:</Text> O CONSIGNATÁRIO é responsável pela guarda, conservação
                e segurança dos itens consignados, devendo devolvê-los em perfeito estado caso não sejam vendidos.
              </Text>
            </View>

            <View style={styles.conditionItem}>
              <Text style={styles.conditionBullet}>4.</Text>
              <Text style={styles.conditionText}>
                <Text style={styles.bold}>PAGAMENTO:</Text> {conditions.paymentTerms}
                {conditions.commissionPercent && conditions.commissionPercent > 0 && (
                  <> O CONSIGNATÁRIO terá direito a uma comissão de {conditions.commissionPercent}% sobre
                  o valor dos itens vendidos.</>
                )}
              </Text>
            </View>

            <View style={styles.conditionItem}>
              <Text style={styles.conditionBullet}>5.</Text>
              <Text style={styles.conditionText}>
                <Text style={styles.bold}>DEVOLUÇÃO:</Text> Ao final do prazo, o CONSIGNATÁRIO deverá devolver os itens
                não vendidos ou efetuar o pagamento integral dos mesmos.
              </Text>
            </View>

            <View style={styles.conditionItem}>
              <Text style={styles.conditionBullet}>6.</Text>
              <Text style={styles.conditionText}>
                <Text style={styles.bold}>PERDAS E DANOS:</Text> Em caso de perda, furto, roubo ou dano aos itens consignados,
                o CONSIGNATÁRIO deverá ressarcir integralmente o CONSIGNANTE pelo valor total dos itens.
              </Text>
            </View>
          </View>
        </View>

        {/* Observações */}
        {conditions.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>OBSERVAÇÕES ADICIONAIS</Text>
            <Text style={styles.paragraph}>{conditions.notes}</Text>
          </View>
        )}

        {/* Acordo */}
        <View style={styles.section}>
          <Text style={styles.paragraph}>
            Ambas as partes estão de acordo com os termos estabelecidos neste documento e o assinam em duas vias
            de igual teor e forma.
          </Text>
        </View>

        {/* Data e Local */}
        <Text style={[styles.paragraph, { marginTop: 15, textAlign: 'center' }]}>
          {company.city}/{company.state}, {formatDate(date)}
        </Text>

        {/* Assinaturas */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureLabel}>CONSIGNANTE (Proprietário)</Text>
              <Text style={[styles.signatureLabel, { marginTop: 3 }]}>{company.name}</Text>
              {company.cnpj && (
                <Text style={styles.signatureLabel}>{company.cnpj}</Text>
              )}
            </View>
          </View>

          <View style={styles.signatureBox}>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureLabel}>CONSIGNATÁRIO (Depositário)</Text>
              <Text style={[styles.signatureLabel, { marginTop: 3 }]}>{client.name}</Text>
              {client.cpfCnpj && (
                <Text style={styles.signatureLabel}>{client.cpfCnpj}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Este termo possui validade jurídica quando assinado por ambas as partes</Text>
          <Text style={{ marginTop: 4, fontSize: 7, color: '#6B7280' }}>
            Sistema desenvolvido por BKreativeLab | WhatsApp: (41) 99734-0818
          </Text>
          <Text style={{ marginTop: 1, fontSize: 6, color: '#9CA3AF' }}>
            Precifica3D PRO - Gestão Profissional de Orçamentos e Contratos para Impressão 3D
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default PDFConsignment;
