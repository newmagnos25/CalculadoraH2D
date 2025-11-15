import { CalculationInput, CalculationResult } from './types';
import { getPrinterById, getFilamentById, getAddonById } from './storage';
import { energyTariffs } from '@/data/energy-tariffs';

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
export function calculatePrintCost(input: CalculationInput): CalculationResult {
  // 1. Buscar dados (inclui default + customizados do localStorage)
  const printer = getPrinterById(input.printerId);
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

  // 9. Custo total (sem lucro)
  const totalCost =
    filamentCost +
    energyCost +
    laborCost +
    depreciation +
    fixedCosts +
    addonsCost +
    postProcessingCost;

  // 10. Calcular margem de lucro
  const profitMargin = input.profitMargin || 0;
  const profitValue = (totalCost * profitMargin) / 100;

  // 11. Preço final
  const finalPrice = totalCost + profitValue;

  // 12. Calcular breakdown (composição do preço)
  const breakdown = [
    {
      item: 'Filamento',
      value: filamentCost,
      percentage: (filamentCost / totalCost) * 100,
    },
    {
      item: 'Energia',
      value: energyCost,
      percentage: (energyCost / totalCost) * 100,
    },
  ];

  if (laborCost > 0) {
    breakdown.push({
      item: 'Mão de obra',
      value: laborCost,
      percentage: (laborCost / totalCost) * 100,
    });
  }

  if (depreciation > 0) {
    breakdown.push({
      item: 'Depreciação',
      value: depreciation,
      percentage: (depreciation / totalCost) * 100,
    });
  }

  if (fixedCosts > 0) {
    breakdown.push({
      item: 'Custos fixos',
      value: fixedCosts,
      percentage: (fixedCosts / totalCost) * 100,
    });
  }

  if (addonsCost > 0) {
    breakdown.push({
      item: 'Adereços',
      value: addonsCost,
      percentage: (addonsCost / totalCost) * 100,
    });
  }

  if (postProcessingCost > 0) {
    breakdown.push({
      item: 'Pós-processamento',
      value: postProcessingCost,
      percentage: (postProcessingCost / totalCost) * 100,
    });
  }

  return {
    costs: {
      filament: filamentCost,
      energy: energyCost,
      labor: laborCost,
      depreciation,
      fixedCosts,
      addons: addonsCost,
      postProcessing: postProcessingCost,
      total: totalCost,
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
