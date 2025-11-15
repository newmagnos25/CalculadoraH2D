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
