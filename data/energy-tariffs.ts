import { EnergyTariff } from '@/lib/types';

// Tarifas de energia elétrica no Brasil (Novembro 2024)
// Valores médios residenciais COM tributos inclusos
// Fonte: ANEEL - Ranking das Tarifas de Energia (Nov/2024)
// Atualizado: 17/11/2024

export const energyTariffs: EnergyTariff[] = [
  // Região Norte (valores atualizados Nov/2024)
  {
    state: 'PA',
    distributor: 'Equatorial Pará',
    pricePerKwh: 0.95,
    updated: '2024-11',
  },
  {
    state: 'AM',
    distributor: 'Amazonas Energia',
    pricePerKwh: 0.89,
    updated: '2024-11',
  },
  {
    state: 'RO',
    distributor: 'Energisa Rondônia',
    pricePerKwh: 0.74,
    updated: '2024-11',
  },
  {
    state: 'AC',
    distributor: 'Energisa Acre',
    pricePerKwh: 0.77,
    updated: '2024-11',
  },
  {
    state: 'RR',
    distributor: 'Boa Vista Energia',
    pricePerKwh: 0.71,
    updated: '2024-11',
  },
  {
    state: 'AP',
    distributor: 'CEA',
    pricePerKwh: 0.73,
    updated: '2024-11',
  },
  {
    state: 'TO',
    distributor: 'Energisa Tocantins',
    pricePerKwh: 0.72,
    updated: '2024-11',
  },

  // Região Nordeste
  {
    state: 'MA',
    distributor: 'Equatorial Maranhão',
    pricePerKwh: 0.81,
    updated: '2025-01',
  },
  {
    state: 'PI',
    distributor: 'Equatorial Piauí',
    pricePerKwh: 0.74,
    updated: '2025-01',
  },
  {
    state: 'CE',
    distributor: 'Enel Ceará',
    pricePerKwh: 0.72,
    updated: '2025-01',
  },
  {
    state: 'RN',
    distributor: 'Cosern',
    pricePerKwh: 0.67,
    updated: '2025-01',
  },
  {
    state: 'PB',
    distributor: 'Energisa Paraíba',
    pricePerKwh: 0.588,
    updated: '2025-01',
  },
  {
    state: 'PE',
    distributor: 'Neoenergia Pernambuco',
    pricePerKwh: 0.69,
    updated: '2025-01',
  },
  {
    state: 'AL',
    distributor: 'Equatorial Alagoas',
    pricePerKwh: 0.78,
    updated: '2025-01',
  },
  {
    state: 'SE',
    distributor: 'Energisa Sergipe',
    pricePerKwh: 0.71,
    updated: '2025-01',
  },
  {
    state: 'BA',
    distributor: 'Neoenergia Coelba',
    pricePerKwh: 0.73,
    updated: '2025-01',
  },

  // Região Centro-Oeste
  {
    state: 'MT',
    distributor: 'Energisa Mato Grosso',
    pricePerKwh: 0.76,
    updated: '2025-01',
  },
  {
    state: 'MS',
    distributor: 'Energisa Mato Grosso do Sul',
    pricePerKwh: 0.82,
    updated: '2025-01',
  },
  {
    state: 'GO',
    distributor: 'Enel Goiás',
    pricePerKwh: 0.73,
    updated: '2025-01',
  },
  {
    state: 'DF',
    distributor: 'Neoenergia Brasília',
    pricePerKwh: 0.68,
    updated: '2025-01',
  },

  // Região Sudeste
  {
    state: 'SP',
    distributor: 'Enel São Paulo',
    pricePerKwh: 0.75,
    updated: '2025-01',
  },
  {
    state: 'SP',
    distributor: 'CPFL Paulista',
    pricePerKwh: 0.73,
    updated: '2025-01',
  },
  {
    state: 'RJ',
    distributor: 'Light',
    pricePerKwh: 0.78,
    updated: '2025-01',
  },
  {
    state: 'RJ',
    distributor: 'Enel Rio',
    pricePerKwh: 0.76,
    updated: '2025-01',
  },
  {
    state: 'MG',
    distributor: 'Cemig',
    pricePerKwh: 0.71,
    updated: '2025-01',
  },
  {
    state: 'ES',
    distributor: 'EDP Espírito Santo',
    pricePerKwh: 0.70,
    updated: '2025-01',
  },

  // Região Sul
  {
    state: 'PR',
    distributor: 'Copel',
    pricePerKwh: 0.65,
    updated: '2025-01',
  },
  {
    state: 'PR',
    distributor: 'Cocel',
    pricePerKwh: 0.41, // Mais barata do Brasil!
    updated: '2025-01',
  },
  {
    state: 'SC',
    distributor: 'Celesc',
    pricePerKwh: 0.67,
    updated: '2025-01',
  },
  {
    state: 'RS',
    distributor: 'RGE',
    pricePerKwh: 0.72,
    updated: '2025-01',
  },
  {
    state: 'RS',
    distributor: 'CEEE-D',
    pricePerKwh: 0.70,
    updated: '2025-01',
  },
];

// Valor médio nacional (aproximado)
export const AVERAGE_TARIFF = 0.72;

// Helper para buscar tarifa por estado
export function getTariffsByState(state: string): EnergyTariff[] {
  return energyTariffs.filter(t => t.state === state);
}

// Helper para buscar todos os estados únicos
export function getStates(): string[] {
  return Array.from(new Set(energyTariffs.map(t => t.state))).sort();
}
