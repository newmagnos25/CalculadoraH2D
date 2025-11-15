// Tipos principais da aplicação

export interface Printer {
  id: string;
  name: string;
  brand: string;
  buildVolume: {
    x: number;
    y: number;
    z: number;
  };
  powerConsumption: {
    idle: number; // Watts
    heating: number; // Watts
    printing: number; // Watts médio
  };
  maxTemp: {
    hotend: number; // °C
    bed: number; // °C
  };
  features: string[];
}

export interface Filament {
  id: string;
  brand: string;
  type: string; // PLA, PETG, ABS, TPU, ASA, etc
  pricePerKg: number; // R$
  density: number; // g/cm³
  printTemp: {
    min: number;
    max: number;
  };
  bedTemp: {
    min: number;
    max: number;
  };
  colors?: string[];
}

export interface EnergyTariff {
  state: string;
  distributor: string;
  pricePerKwh: number; // R$
  updated: string; // data da atualização
}

export interface Addon {
  id: string;
  name: string;
  category: 'insert' | 'screw' | 'magnet' | 'elastic' | 'glue' | 'tape' | 'other';
  pricePerUnit: number; // R$
  unit: 'un' | 'g' | 'ml' | 'm';
}

export interface CalculationInput {
  // Impressora
  printerId: string;

  // Filamento
  filamentId: string;
  weight: number; // gramas

  // Tempo de impressão
  printTime: number; // minutos

  // Energia
  energyTariffId: string;

  // Custos adicionais
  addons: {
    addonId: string;
    quantity: number;
  }[];

  // Configurações de negócio
  laborCostPerHour?: number; // R$/hora
  depreciation?: number; // R$ por impressão
  fixedCosts?: number; // R$ por impressão (aluguel, internet, etc)
  profitMargin?: number; // % (ex: 30 = 30%)

  // Pós-processamento
  postProcessing?: {
    description: string;
    cost: number; // R$
  }[];
}

export interface CalculationResult {
  costs: {
    filament: number;
    energy: number;
    labor: number;
    depreciation: number;
    fixedCosts: number;
    addons: number;
    postProcessing: number;
    total: number;
  };
  profitMargin: number;
  profitValue: number;
  finalPrice: number;
  breakdown: {
    item: string;
    value: number;
    percentage: number;
  }[];
}

export interface CompanySettings {
  name: string;
  tradeName?: string; // Nome fantasia
  cnpj?: string; // Tax ID
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string; // Base64 encoded image
  invoicePrefix: string; // Ex: "INV-2025-"
  invoiceCounter: number; // Contador para numeração automática
  paymentTerms: string; // Condições de pagamento padrão
  bankDetails?: string; // Dados bancários para pagamento
  legalNotes?: string; // Observações legais/termos
}

export interface ClientData {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  cpfCnpj?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  notes?: string;
  createdAt: string;
}

export type ProjectStatus =
  | 'quote'        // Orçamento
  | 'approved'     // Aprovado
  | 'production'   // Em Produção
  | 'completed'    // Concluído
  | 'cancelled';   // Cancelado

export interface FileAttachment {
  id: string;
  name: string;
  type: 'model' | 'image' | 'document'; // model = STL/GCODE/3MF, image = photos, document = outros
  mimeType: string;
  size: number; // bytes
  data: string; // base64 encoded
  uploadedAt: string;
}

export interface QuoteData {
  quoteNumber: string;
  date: string;
  validUntil: string;
  clientId?: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  discount?: number;
  total: number;
  notes?: string;
  calculation?: CalculationResult; // Link to detailed calculation
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  projectStatus?: ProjectStatus; // Status do projeto
  attachments?: FileAttachment[]; // Arquivos anexados ao projeto
}
