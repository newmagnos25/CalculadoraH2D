import { CalculationInput, CalculationResult } from './types';
import { getPrinterById, getFilamentById, getAddonById } from './storage';
import { energyTariffs } from '@/data/energy-tariffs';

/**
 * Arredonda valor SEMPRE PARA CIMA (ceiling)
 *
 * Exemplos:
 * - 127.25 → 128.00
 * - 52.12 → 53.00
 * - 99.01 → 100.00
 * - 23.99 → 24.00
 * - 4.50 → 5.00
 *
 * Lógica:
 * - Sempre arredonda para o INTEIRO ACIMA
 * - Garante que o preço sempre "fecha" um valor redondo
 * - Cliente paga um pouco mais, mas valor fica mais profissional
 */
export function smartRoundPrice(value: number): number {
  // Arredondar SEMPRE para cima para o inteiro mais próximo
  return Math.ceil(value);
}

/**
 * Engine de cálculo de custos para impressão 3D
 *
 * Calcula todos os custos envolvidos em uma impressão:
 * - Filamento (baseado no peso e preço por kg)
 * - Energia elétrica (baseado no tempo e consumo da impressora)
 * - Mão de obra (baseado no tempo)
 * - Depreciação da máquina
 * - Custos fixos (aluguel, internet, etc)
 * - Adereços e inserções (parafusos, ímãs, etc)
 * - Pós-processamento (lixamento, pintura, etc)
 * - Margem de lucro
 */
export async function calculatePrintCost(input: CalculationInput): Promise<CalculationResult> {
  // 1. Buscar dados (inclui default + customizados do localStorage)
  const printer = await getPrinterById(input.printerId);
  const filament = getFilamentById(input.filamentId);
  const tariff = energyTariffs.find(t => t.distributor === input.energyTariffId);

  if (!printer) throw new Error('Impressora não encontrada');
  if (!filament) throw new Error('Filamento não encontrado');
  if (!tariff) throw new Error('Tarifa de energia não encontrada');

  // 2. Calcular custo do filamento
  const filamentCost = (input.weight / 1000) * filament.pricePerKg;

  // 3. Calcular custo de energia
  // Consumo médio durante impressão (em kWh)
  const printTimeHours = input.printTime / 60;
  const energyConsumptionKwh = (printer.powerConsumption.printing / 1000) * printTimeHours;
  const energyCost = energyConsumptionKwh * tariff.pricePerKwh;

  // 4. Calcular mão de obra
  const laborCost = input.laborCostPerHour
    ? (input.laborCostPerHour * printTimeHours)
    : 0;

  // 5. Depreciação da máquina
  const depreciation = input.depreciation || 0;

  // 6. Custos fixos
  const fixedCosts = input.fixedCosts || 0;

  // 7. Calcular custos de adereços
  let addonsCost = 0;
  if (input.addons && input.addons.length > 0) {
    for (const addonInput of input.addons) {
      const addon = getAddonById(addonInput.addonId);
      if (addon) {
        addonsCost += addon.pricePerUnit * addonInput.quantity;
      }
    }
  }

  // 8. Calcular custos de pós-processamento
  let postProcessingCost = 0;
  if (input.postProcessing && input.postProcessing.length > 0) {
    postProcessingCost = input.postProcessing.reduce((sum, pp) => sum + pp.cost, 0);
  }

  // 9. Custo total (sem lucro) - arredondar cada componente
  const roundedFilamentCost = Math.round(filamentCost * 100) / 100;
  const roundedEnergyCost = Math.round(energyCost * 100) / 100;
  const roundedLaborCost = Math.round(laborCost * 100) / 100;
  const roundedDepreciation = Math.round(depreciation * 100) / 100;
  const roundedFixedCosts = Math.round(fixedCosts * 100) / 100;
  const roundedAddonsCost = Math.round(addonsCost * 100) / 100;
  const roundedPostProcessingCost = Math.round(postProcessingCost * 100) / 100;

  const totalCost =
    roundedFilamentCost +
    roundedEnergyCost +
    roundedLaborCost +
    roundedDepreciation +
    roundedFixedCosts +
    roundedAddonsCost +
    roundedPostProcessingCost;

  // 10. Calcular margem de lucro
  const profitMargin = input.profitMargin || 0;
  const profitValue = Math.round((totalCost * profitMargin / 100) * 100) / 100;

  // 11. Preço final COM arredondamento inteligente
  const rawFinalPrice = totalCost + profitValue;
  const finalPrice = smartRoundPrice(rawFinalPrice);

  // 12. Calcular breakdown (composição do preço)
  const breakdown = [
    {
      item: 'Filamento',
      value: roundedFilamentCost,
      percentage: (roundedFilamentCost / totalCost) * 100,
    },
    {
      item: 'Energia',
      value: roundedEnergyCost,
      percentage: (roundedEnergyCost / totalCost) * 100,
    },
  ];

  if (roundedLaborCost > 0) {
    breakdown.push({
      item: 'Mão de obra',
      value: roundedLaborCost,
      percentage: (roundedLaborCost / totalCost) * 100,
    });
  }

  if (roundedDepreciation > 0) {
    breakdown.push({
      item: 'Depreciação',
      value: roundedDepreciation,
      percentage: (roundedDepreciation / totalCost) * 100,
    });
  }

  if (roundedFixedCosts > 0) {
    breakdown.push({
      item: 'Custos fixos',
      value: roundedFixedCosts,
      percentage: (roundedFixedCosts / totalCost) * 100,
    });
  }

  if (roundedAddonsCost > 0) {
    breakdown.push({
      item: 'Adereços',
      value: roundedAddonsCost,
      percentage: (roundedAddonsCost / totalCost) * 100,
    });
  }

  if (roundedPostProcessingCost > 0) {
    breakdown.push({
      item: 'Pós-processamento',
      value: roundedPostProcessingCost,
      percentage: (roundedPostProcessingCost / totalCost) * 100,
    });
  }

  return {
    costs: {
      filament: roundedFilamentCost,
      energy: roundedEnergyCost,
      labor: roundedLaborCost,
      depreciation: roundedDepreciation,
      fixedCosts: roundedFixedCosts,
      addons: roundedAddonsCost,
      postProcessing: roundedPostProcessingCost,
      total: Math.round(totalCost * 100) / 100,
    },
    profitMargin,
    profitValue,
    finalPrice,
    breakdown,
  };
}

/**
 * Formata valor em reais
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formata porcentagem
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Calcula estimativa de energia baseado no peso
 * Útil quando não se tem o tempo exato de impressão
 */
export function estimatePrintTime(weightGrams: number, printerSpeed: number = 60): number {
  // Estimativa simplificada: ~1g por minuto em velocidade média
  // Esta fórmula pode ser ajustada com dados reais
  const baseTimeMinutes = weightGrams / printerSpeed * 60;
  return Math.round(baseTimeMinutes);
}
