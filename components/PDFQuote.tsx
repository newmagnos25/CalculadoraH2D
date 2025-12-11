'use client';

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { CompanySettings, ClientData, CalculationResult, ProjectStatus, FileAttachment } from '@/lib/types';
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
    marginBottom: 12,
    borderBottom: `2 solid ${brandColor}`,
    paddingBottom: 10,
  },
  logoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 9,
    color: '#6B7280',
    marginBottom: 10,
  },
  section: {
    marginBottom: 7,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: brandColor,
    marginBottom: 6,
    borderBottom: '1 solid #FED7AA',
    paddingBottom: 2,
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
    padding: 5,
    borderRadius: 4,
    fontSize: 8,
    color: '#92400E',
    marginBottom: 8,
    textAlign: 'center',
  },
  statusBadge: {
    backgroundColor: '#DBEAFE',
    padding: 4,
    borderRadius: 4,
    fontSize: 8,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 6,
    textAlign: 'center',
    border: '1 solid #BFDBFE',
  },
  serviceBox: {
    backgroundColor: '#FFF7ED',
    border: '1 solid #FDBA74',
    borderRadius: 4,
    padding: 7,
    marginTop: 4,
    marginBottom: 7,
    breakInside: 'avoid',
  },
  serviceTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: brandColor,
    marginBottom: 6,
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
  colorsSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTop: '1 solid #E5E7EB',
  },
  colorsLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 6,
  },
  colorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  colorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
    border: '1 solid #E5E7EB',
  },
  colorBox: {
    width: 12,
    height: 12,
    borderRadius: 2,
    border: '1 solid #9CA3AF',
  },
  colorText: {
    fontSize: 7,
    color: '#374151',
  },
  totalBox: {
    backgroundColor: brandColor,
    border: `2 solid ${brandColor}`,
    borderRadius: 6,
    padding: 10,
    marginTop: 6,
    marginBottom: 6,
    // Evita quebra de página no meio do box
    breakInside: 'avoid',
  },
  totalLabel: {
    fontSize: 9,
    color: '#FFF',
    marginBottom: 4,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  paymentBox: {
    backgroundColor: '#F9FAFB',
    padding: 6,
    borderRadius: 4,
    marginBottom: 6,
    breakInside: 'avoid',
  },
  notes: {
    fontSize: 7,
    color: '#6B7280',
    lineHeight: 1.3,
    marginTop: 6,
    padding: 6,
    backgroundColor: '#F9FAFB',
    borderRadius: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
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

interface PDFQuoteProps {
  company: CompanySettings;
  client: ClientData | null;
  calculation: CalculationResult;
  quoteNumber: string;
  date: string;
  validUntil: string;
  notes?: string;
  projectStatus?: ProjectStatus;
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
  attachments?: FileAttachment[];
}

export const PDFQuote: React.FC<PDFQuoteProps> = ({
  company,
  client,
  calculation,
  quoteNumber,
  date,
  validUntil,
  notes,
  projectStatus,
  printDetails,
  attachments,
}) => {
  // Criar estilos dinâmicos baseados na cor da marca da empresa
  const styles = createStyles(company.brandColor || '#F97316');

  const getStatusLabel = (status?: ProjectStatus): string => {
    if (!status) return 'Orçamento';
    const labels: Record<ProjectStatus, string> = {
      quote: 'Orçamento',
      approved: 'Aprovado',
      production: 'Em Produção',
      completed: 'Concluído',
      cancelled: 'Cancelado',
    };
    return labels[status];
  };
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR');
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
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

        {/* Status do Projeto */}
        {projectStatus && (
          <View style={styles.statusBadge}>
            <Text>Status: {getStatusLabel(projectStatus)}</Text>
          </View>
        )}

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

          {/* Descrição do Item + Imagem */}
          {printDetails.itemDescription && (
            <View style={{ marginTop: 12, paddingTop: 12, borderTop: '1 solid #FDBA74' }}>
              <Text style={[styles.label, { marginBottom: 4, fontSize: 8, fontWeight: 'bold' }]}>
                ITEM:
              </Text>
              <Text style={[styles.specValue, { fontSize: 9, marginBottom: 8, color: '#1F2937' }]}>
                {printDetails.itemDescription}
              </Text>

              <View style={{ flexDirection: 'row', gap: 12 }}>
                {/* Informações */}
                <View style={{ flex: 1 }}>
                  <View style={styles.specGrid}>
                    {printDetails.quantity && printDetails.quantity > 1 && (
                      <View style={styles.specItem}>
                        <Text style={styles.specLabel}>Quantidade:</Text>
                        <Text style={styles.specValue}>{printDetails.quantity} unidades</Text>
                      </View>
                    )}
                    {printDetails.dimensions && (
                      <View style={styles.specItem}>
                        <Text style={styles.specLabel}>Dimensões:</Text>
                        <Text style={styles.specValue}>{printDetails.dimensions}</Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Imagem do Produto */}
                {printDetails.productImage && (
                  <View style={{ width: 80, height: 80 }}>
                    <Image
                      src={printDetails.productImage}
                      style={{ width: '100%', height: '100%', objectFit: 'contain', border: '1 solid #FDBA74', borderRadius: 4 }}
                    />
                  </View>
                )}
              </View>
            </View>
          )}

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
                <Text style={styles.specLabel}>Material Utilizado:</Text>
                <Text style={styles.specValue}>{printDetails.filaments}</Text>
              </View>
            </View>

            {/* Cores dos Filamentos */}
            {printDetails.filamentColors && printDetails.filamentColors.length > 0 && (
              <View style={styles.colorsSection}>
                <Text style={styles.colorsLabel}>CORES DOS FILAMENTOS:</Text>
                <View style={styles.colorsContainer}>
                  {printDetails.filamentColors.map((fil, idx) => (
                    <View key={idx} style={styles.colorItem}>
                      <View style={[styles.colorBox, { backgroundColor: fil.color }]} />
                      <Text style={styles.colorText}>{fil.name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
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
          <View style={styles.notes} wrap={false}>
            {notes && <Text style={{ marginBottom: 5 }}>Observações: {notes}</Text>}
            {company.legalNotes && <Text>{company.legalNotes}</Text>}
          </View>
        )}

        {/* Anexos do Projeto */}
        {attachments && attachments.length > 0 && (
          <View style={styles.attachmentsSection} wrap={false}>
            <Text style={styles.sectionTitle}>ANEXOS DO PROJETO</Text>
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
                        <Text style={{ color: '#FFFFFF', fontSize: 8, textAlign: 'center', fontWeight: 'bold' }}>
                          VIDEO{'\n'}{attachment.name}
                        </Text>
                      </View>
                    )}

                    {/* Para modelos 3D e documentos */}
                    {!isImage && !isVideo && (
                      <View style={[styles.attachmentImage, { backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' }]}>
                        <Text style={{ color: '#6B7280', fontSize: 8, textAlign: 'center', fontWeight: 'bold' }}>
                          {attachment.type === 'model' ? 'MODELO 3D' : 'DOCUMENTO'}{'\n'}
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
          <Text>
            © {new Date().getFullYear()} {company.tradeName || company.name} - Orçamento gerado em {formatDate(date)}
          </Text>
          <Text style={{ marginTop: 4, fontSize: 7, color: '#6B7280' }}>
            Sistema desenvolvido por BKreativeLab | WhatsApp: (41) 99734-0818
          </Text>
          <Text style={{ marginTop: 1, fontSize: 6, color: '#9CA3AF' }}>
            Precifica3D PRO - Gestão Profissional de Orçamentos para Impressão 3D
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default PDFQuote;
