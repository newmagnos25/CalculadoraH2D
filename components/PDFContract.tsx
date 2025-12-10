'use client';

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { CompanySettings, ClientData, FileAttachment } from '@/lib/types';
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
    marginBottom: 8,
  },
  contractNumber: {
    fontSize: 9,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 10,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: brandColor,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  paragraph: {
    fontSize: 8,
    lineHeight: 1.4,
    textAlign: 'justify',
    marginBottom: 6,
    color: '#374151',
  },
  bold: {
    fontWeight: 'bold',
  },
  clause: {
    fontSize: 8,
    lineHeight: 1.4,
    textAlign: 'justify',
    marginBottom: 8,
    color: '#374151',
  },
  clauseTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1F2937',
  },
  highlight: {
    backgroundColor: '#FEF3C7',
    padding: 6,
    borderRadius: 4,
    marginVertical: 6,
  },
  table: {
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #E5E7EB',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  tableLabel: {
    width: '40%',
    fontSize: 9,
    color: '#6B7280',
  },
  tableValue: {
    width: '60%',
    fontSize: 9,
    color: '#1F2937',
    fontWeight: 'bold',
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
  attachmentsSection: {
    marginTop: 10,
    marginBottom: 10,
    breakInside: 'avoid',
  },
  attachmentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  attachmentItem: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    border: '1 solid #E5E7EB',
    borderRadius: 4,
    padding: 6,
    marginBottom: 6,
  },
  attachmentImage: {
    width: '100%',
    height: 100,
    objectFit: 'cover',
    borderRadius: 4,
    marginBottom: 4,
  },
  attachmentLabel: {
    fontSize: 7,
    color: '#6B7280',
    marginTop: 3,
    textAlign: 'center',
  },
  attachmentTypeBadge: {
    fontSize: 6,
    color: '#FFFFFF',
    backgroundColor: brandColor,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
    textAlign: 'center',
    marginBottom: 3,
  },
});

interface PDFContractProps {
  company: CompanySettings;
  client: ClientData;
  contractNumber: string;
  date: string;
  totalValue: number;
  description: string;
  deliveryDays?: number;
  attachments?: FileAttachment[];
}

export const PDFContract: React.FC<PDFContractProps> = ({
  company,
  client,
  contractNumber,
  date,
  totalValue,
  description,
  deliveryDays = 7,
  attachments,
}) => {
  // Criar estilos dinâmicos baseados na cor da marca da empresa
  const styles = createStyles(company.brandColor || '#F97316');

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getAttachmentTypeLabel = (type: FileAttachment['type']): string => {
    const labels = {
      model: 'Modelo 3D',
      image: 'Imagem',
      video: 'Vídeo',
      document: 'Documento',
    };
    return labels[type];
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
              {company.cnpj && <Text>CNPJ: {company.cnpj}</Text>}
              <Text>{company.address}, {company.city} - {company.state}</Text>
              <Text>{company.phone} | {company.email}</Text>
            </View>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>CONTRATO DE PRESTAÇÃO DE SERVIÇOS</Text>
        <Text style={styles.title}>IMPRESSÃO 3D</Text>
        <Text style={styles.contractNumber}>Contrato Nº {contractNumber}</Text>

        {/* Partes */}
        <View style={styles.section}>
          <Text style={styles.paragraph}>
            Pelo presente instrumento particular, de um lado:
          </Text>

          <View style={styles.highlight}>
            <Text style={[styles.paragraph, styles.bold]}>CONTRATANTE:</Text>
            <Text style={styles.paragraph}>
              {client.name}
              {client.cpfCnpj && `, inscrito(a) no CPF/CNPJ sob nº ${client.cpfCnpj}`}
              {client.address && `, com endereço em ${client.address}, ${client.city} - ${client.state}`}
              {client.email && `, e-mail: ${client.email}`}
              {client.phone && `, telefone: ${client.phone}`}
            </Text>
          </View>

          <Text style={styles.paragraph}>E de outro lado:</Text>

          <View style={styles.highlight}>
            <Text style={[styles.paragraph, styles.bold]}>CONTRATADA:</Text>
            <Text style={styles.paragraph}>
              {company.name}
              {company.cnpj && `, inscrita no CNPJ sob nº ${company.cnpj}`}
              , com sede em {company.address}, {company.city} - {company.state}
              , telefone: {company.phone}, e-mail: {company.email}
            </Text>
          </View>
        </View>

        {/* Cláusulas */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>CLÁUSULA PRIMEIRA - DO OBJETO</Text>
          <Text style={styles.clause}>
            O presente contrato tem por objeto a prestação de serviços de impressão 3D pela CONTRATADA ao CONTRATANTE,
            conforme especificações técnicas descritas abaixo:
          </Text>
          <Text style={styles.clause}>
            {description}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.clauseTitle}>CLÁUSULA SEGUNDA - DO VALOR E FORMA DE PAGAMENTO</Text>
          <Text style={styles.clause}>
            O CONTRATANTE pagará à CONTRATADA o valor total de <Text style={styles.bold}>{formatCurrency(totalValue)}</Text>
            {' '}pelos serviços prestados.
          </Text>
          <Text style={styles.clause}>
            Forma de pagamento: {company.paymentTerms}
          </Text>
          {company.bankDetails && (
            <Text style={styles.clause}>
              Dados bancários: {company.bankDetails}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.clauseTitle}>CLÁUSULA TERCEIRA - DO PRAZO DE ENTREGA</Text>
          <Text style={styles.clause}>
            A CONTRATADA se compromete a entregar o serviço em até <Text style={styles.bold}>{deliveryDays} (
            {deliveryDays === 1 ? 'um dia' :
             deliveryDays === 7 ? 'sete dias' :
             deliveryDays === 15 ? 'quinze dias' :
             deliveryDays === 30 ? 'trinta dias' :
             `${deliveryDays} dias`}) úteis</Text> a partir da data de confirmação do pagamento.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.clauseTitle}>CLÁUSULA QUARTA - DAS RESPONSABILIDADES</Text>
          <Text style={styles.clause}>
            4.1. A CONTRATADA se responsabiliza pela qualidade técnica da impressão, seguindo as melhores práticas
            e utilizando materiais de qualidade.
          </Text>
          <Text style={styles.clause}>
            4.2. O CONTRATANTE se responsabiliza por fornecer arquivos em formato adequado (.STL, .OBJ, .3MF) e
            com especificações técnicas viáveis para impressão 3D.
          </Text>
          <Text style={styles.clause}>
            4.3. A CONTRATADA não se responsabiliza por falhas decorrentes de arquivos inadequados ou com
            especificações impossíveis de serem atendidas.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.clauseTitle}>CLÁUSULA QUINTA - DA GARANTIA</Text>
          <Text style={styles.clause}>
            A CONTRATADA garante a qualidade da impressão por um período de 30 (trinta) dias corridos após a entrega,
            desde que o produto seja utilizado conforme recomendações técnicas.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.clauseTitle}>CLÁUSULA SEXTA - DO CANCELAMENTO</Text>
          <Text style={styles.clause}>
            Em caso de cancelamento por parte do CONTRATANTE após o início da impressão, será cobrado 50% do valor
            total do serviço a título de ressarcimento de custos.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.clauseTitle}>CLÁUSULA SÉTIMA - DO FORO</Text>
          <Text style={styles.clause}>
            As partes elegem o foro da comarca de {company.city}/{company.state} para dirimir quaisquer dúvidas
            oriundas do presente contrato.
          </Text>
        </View>

        {company.legalNotes && (
          <View style={styles.section}>
            <Text style={styles.clauseTitle}>OBSERVAÇÕES ADICIONAIS</Text>
            <Text style={styles.clause}>{company.legalNotes}</Text>
          </View>
        )}

        {/* Data e Local */}
        <Text style={[styles.paragraph, { marginTop: 20, textAlign: 'center' }]}>
          {company.city}/{company.state}, {formatDate(date)}
        </Text>

        {/* Assinaturas */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureLabel}>CONTRATANTE</Text>
              <Text style={[styles.signatureLabel, { marginTop: 3 }]}>{client.name}</Text>
              {client.cpfCnpj && (
                <Text style={styles.signatureLabel}>{client.cpfCnpj}</Text>
              )}
            </View>
          </View>

          <View style={styles.signatureBox}>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureLabel}>CONTRATADA</Text>
              <Text style={[styles.signatureLabel, { marginTop: 3 }]}>{company.name}</Text>
              {company.cnpj && (
                <Text style={styles.signatureLabel}>{company.cnpj}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Anexos do Projeto */}
        {attachments && attachments.length > 0 && (
          <View style={styles.attachmentsSection}>
            <Text style={styles.sectionTitle}>📎 ANEXOS DO PROJETO</Text>
            <View style={styles.attachmentsGrid}>
              {attachments.map((attachment, index) => {
                const dataUrl = `data:${attachment.mimeType};base64,${attachment.data}`;
                const isImage = attachment.type === 'image';
                const isVideo = attachment.type === 'video';

                return (
                  <View key={attachment.id || index} style={styles.attachmentItem}>
                    <Text style={styles.attachmentTypeBadge}>
                      {getAttachmentTypeLabel(attachment.type)}
                    </Text>

                    {/* Exibir imagem */}
                    {isImage && (
                      <Image
                        src={dataUrl}
                        style={styles.attachmentImage}
                      />
                    )}

                    {/* Para vídeos, mostrar placeholder */}
                    {isVideo && (
                      <View style={[styles.attachmentImage, { backgroundColor: '#1F2937', justifyContent: 'center', alignItems: 'center' }]}>
                        <Text style={{ color: '#FFFFFF', fontSize: 8, textAlign: 'center' }}>
                          🎥 Vídeo{'\n'}{attachment.name}
                        </Text>
                      </View>
                    )}

                    {/* Para modelos 3D e documentos */}
                    {!isImage && !isVideo && (
                      <View style={[styles.attachmentImage, { backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' }]}>
                        <Text style={{ color: '#6B7280', fontSize: 8, textAlign: 'center' }}>
                          {attachment.type === 'model' ? '📦' : '📄'} {'\n'}
                          {attachment.name}
                        </Text>
                      </View>
                    )}

                    <Text style={styles.attachmentLabel}>
                      {attachment.name}
                    </Text>
                    <Text style={[styles.attachmentLabel, { fontSize: 6, marginTop: 1 }]}>
                      {formatFileSize(attachment.size)}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Este documento possui validade jurídica quando assinado por ambas as partes</Text>
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

export default PDFContract;
