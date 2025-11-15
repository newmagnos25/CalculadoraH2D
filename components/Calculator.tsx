'use client';

import { useState, useEffect } from 'react';
import { filaments } from '@/data/filaments';
import { energyTariffs, getStates, getTariffsByState } from '@/data/energy-tariffs';
import { addons, addonCategories } from '@/data/addons';
import { calculatePrintCost, formatCurrency, formatPercentage } from '@/lib/calculator';
import { CalculationInput, CalculationResult } from '@/lib/types';
import { getCustomFilaments, getCustomAddons, getAllPrinters, saveLastCalculation, getLastCalculation } from '@/lib/storage';
import FilamentManager from './FilamentManager';
import AddonManager from './AddonManager';
import PrinterManager from './PrinterManager';
import PDFActions from './PDFActions';

interface FilamentUsage {
  id: string;
  filamentId: string;
  weight: number;
  color?: string;
}

export default function Calculator() {
  // Filamentos, adereços e impressoras (padrão + customizados)
  const [allPrinters, setAllPrinters] = useState(getAllPrinters());
  const [allFilaments, setAllFilaments] = useState(filaments);
  const [allAddons, setAllAddons] = useState(addons);

  // Estados do formulário
  const [printerId, setPrinterId] = useState(allPrinters[0]?.id || '');
  const [filamentUsages, setFilamentUsages] = useState<FilamentUsage[]>([
    { id: '1', filamentId: filaments[0].id, weight: 50 }
  ]);
  const [printTime, setPrintTime] = useState(120);
  const [selectedState, setSelectedState] = useState('SP');
  const [energyTariffId, setEnergyTariffId] = useState('Enel São Paulo');
  const [laborCost, setLaborCost] = useState(0);
  const [depreciation, setDepreciation] = useState(1);
  const [fixedCosts, setFixedCosts] = useState(0.5);
  const [profitMargin, setProfitMargin] = useState(30);

  // Adereços selecionados
  const [selectedAddons, setSelectedAddons] = useState<{ id: string; quantity: number }[]>([]);

  // Resultado
  const [result, setResult] = useState<CalculationResult | null>(null);

  // Carregar dados customizados
  useEffect(() => {
    loadCustomData();
  }, []);

  const loadCustomData = () => {
    const customFilaments = getCustomFilaments();
    const customAddons = getCustomAddons();
    setAllFilaments([...filaments, ...customFilaments]);
    setAllAddons([...addons, ...customAddons]);
    setAllPrinters(getAllPrinters()); // Já combina printers default + custom
  };

  const handleCalculate = () => {
    // Calcular peso total e custo de filamento combinado
    let totalWeight = 0;
    let totalFilamentCost = 0;

    filamentUsages.forEach(usage => {
      const filament = allFilaments.find(f => f.id === usage.filamentId);
      if (filament) {
        totalWeight += usage.weight;
        totalFilamentCost += (usage.weight / 1000) * filament.pricePerKg;
      }
    });

    // Usar o primeiro filamento para o cálculo base (poderia ser melhorado)
    const input: CalculationInput = {
      printerId,
      filamentId: filamentUsages[0].filamentId,
      weight: totalWeight,
      printTime,
      energyTariffId,
      laborCostPerHour: laborCost,
      depreciation,
      fixedCosts,
      profitMargin,
      addons: selectedAddons.map(a => ({
        addonId: a.id,
        quantity: a.quantity,
      })),
    };

    const calculatedResult = calculatePrintCost(input);

    // Ajustar custo de filamento para usar o calculado manualmente
    calculatedResult.costs.filament = totalFilamentCost;
    calculatedResult.costs.total =
      totalFilamentCost +
      calculatedResult.costs.energy +
      calculatedResult.costs.labor +
      calculatedResult.costs.depreciation +
      calculatedResult.costs.fixedCosts +
      calculatedResult.costs.addons +
      calculatedResult.costs.postProcessing;

    calculatedResult.profitValue = (calculatedResult.costs.total * profitMargin) / 100;
    calculatedResult.finalPrice = calculatedResult.costs.total + calculatedResult.profitValue;

    // Recalcular breakdown
    calculatedResult.breakdown = [
      {
        item: 'Filamento',
        value: totalFilamentCost,
        percentage: (totalFilamentCost / calculatedResult.costs.total) * 100,
      },
      {
        item: 'Energia',
        value: calculatedResult.costs.energy,
        percentage: (calculatedResult.costs.energy / calculatedResult.costs.total) * 100,
      },
    ];

    if (calculatedResult.costs.labor > 0) {
      calculatedResult.breakdown.push({
        item: 'Mão de obra',
        value: calculatedResult.costs.labor,
        percentage: (calculatedResult.costs.labor / calculatedResult.costs.total) * 100,
      });
    }

    if (calculatedResult.costs.depreciation > 0) {
      calculatedResult.breakdown.push({
        item: 'Depreciação',
        value: calculatedResult.costs.depreciation,
        percentage: (calculatedResult.costs.depreciation / calculatedResult.costs.total) * 100,
      });
    }

    if (calculatedResult.costs.fixedCosts > 0) {
      calculatedResult.breakdown.push({
        item: 'Custos fixos',
        value: calculatedResult.costs.fixedCosts,
        percentage: (calculatedResult.costs.fixedCosts / calculatedResult.costs.total) * 100,
      });
    }

    if (calculatedResult.costs.addons > 0) {
      calculatedResult.breakdown.push({
        item: 'Adereços',
        value: calculatedResult.costs.addons,
        percentage: (calculatedResult.costs.addons / calculatedResult.costs.total) * 100,
      });
    }

    setResult(calculatedResult);
    saveLastCalculation({ input, result: calculatedResult });
  };

  const addFilamentUsage = () => {
    setFilamentUsages([
      ...filamentUsages,
      { id: Date.now().toString(), filamentId: filaments[0].id, weight: 10 }
    ]);
  };

  const removeFilamentUsage = (id: string) => {
    if (filamentUsages.length > 1) {
      setFilamentUsages(filamentUsages.filter(f => f.id !== id));
    }
  };

  const updateFilamentUsage = (id: string, updates: Partial<FilamentUsage>) => {
    setFilamentUsages(
      filamentUsages.map(f => f.id === id ? { ...f, ...updates } : f)
    );
  };

  const addAddon = (addonId: string) => {
    if (!selectedAddons.find(a => a.id === addonId)) {
      setSelectedAddons([...selectedAddons, { id: addonId, quantity: 1 }]);
    }
  };

  const updateAddonQuantity = (addonId: string, quantity: number) => {
    setSelectedAddons(
      selectedAddons.map(a =>
        a.id === addonId ? { ...a, quantity: Math.max(0, quantity) } : a
      ).filter(a => a.quantity > 0)
    );
  };

  const stateTariffs = getTariffsByState(selectedState);
  const totalWeight = filamentUsages.reduce((sum, f) => sum + f.weight, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Formulário */}
      <div className="space-y-6">
        {/* Card Principal */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 border-2 border-orange-200 dark:border-orange-900/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/30">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Nova Cotação
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">Configure os parâmetros da impressão</p>
            </div>
          </div>

          {/* Impressora */}
          <div className="mb-4">
            <PrinterManager
              selectedPrinterId={printerId}
              onPrinterSelect={(printer) => {
                if (printer) {
                  setPrinterId(printer.id);
                }
              }}
            />
          </div>

          {/* Filamentos/Cores */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Filamentos / Cores ({filamentUsages.length})
              </label>
              <button
                onClick={addFilamentUsage}
                className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium flex items-center gap-1 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Adicionar cor
              </button>
            </div>

            <div className="space-y-2">
              {filamentUsages.map((usage, idx) => (
                <div key={usage.id} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 border border-slate-200 dark:border-slate-600">
                  <div className="flex gap-2 items-center">
                    <div className="flex-1">
                      <select
                        value={usage.filamentId}
                        onChange={e => updateFilamentUsage(usage.id, { filamentId: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      >
                        {allFilaments.map(f => (
                          <option key={f.id} value={f.id}>
                            {f.brand} - {f.type} (R$ {f.pricePerKg.toFixed(2)}/kg)
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-24">
                      <input
                        type="number"
                        value={usage.weight}
                        onChange={e => updateFilamentUsage(usage.id, { weight: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                        placeholder="g"
                      />
                    </div>
                    {filamentUsages.length > 1 && (
                      <button
                        onClick={() => removeFilamentUsage(usage.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 p-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-2">
              <FilamentManager onSave={loadCustomData} />
            </div>

            <div className="mt-2 text-xs text-slate-700 dark:text-slate-300 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 px-3 py-2 rounded-md border border-orange-200 dark:border-orange-900/50">
              <strong className="text-orange-600 dark:text-orange-400">Peso total:</strong> {totalWeight}g
            </div>
          </div>

          {/* Tempo e Energia */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
              Tempo de Impressão (minutos)
            </label>
            <input
              type="number"
              value={printTime}
              onChange={e => setPrintTime(Number(e.target.value))}
              className="w-full px-4 py-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-800 transition-all"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              ≈ {Math.floor(printTime / 60)}h {printTime % 60}min
            </p>
          </div>

          {/* Energia */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                Estado
              </label>
              <select
                value={selectedState}
                onChange={e => {
                  setSelectedState(e.target.value);
                  const tariffs = getTariffsByState(e.target.value);
                  if (tariffs.length > 0) {
                    setEnergyTariffId(tariffs[0].distributor);
                  }
                }}
                className="w-full px-3 py-2 border-2 border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
              >
                {getStates().map(state => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                Distribuidora
              </label>
              <select
                value={energyTariffId}
                onChange={e => setEnergyTariffId(e.target.value)}
                className="w-full px-3 py-2 border-2 border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
              >
                {stateTariffs.map(t => (
                  <option key={t.distributor} value={t.distributor}>
                    R$ {t.pricePerKwh.toFixed(3)}/kWh
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Custos Adicionais - Compacto */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
            <details className="group">
              <summary className="cursor-pointer text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between mb-3">
                <span>Custos e Margens</span>
                <svg className="w-5 h-5 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-600 dark:text-slate-400">
                    Mão de obra (R$/h)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={laborCost}
                    onChange={e => setLaborCost(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-600 dark:text-slate-400">
                    Depreciação (R$)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={depreciation}
                    onChange={e => setDepreciation(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-600 dark:text-slate-400">
                    Custos fixos (R$)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={fixedCosts}
                    onChange={e => setFixedCosts(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-600 dark:text-slate-400">
                    Margem de lucro (%)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={profitMargin}
                    onChange={e => setProfitMargin(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </details>
          </div>
        </div>

        {/* Card de Adereços */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 border-2 border-amber-200 dark:border-amber-900/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/30">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Adereços e Inserções
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Parafusos, ímãs, insertos, etc</p>
            </div>
          </div>

          <div className="mb-3">
            <AddonManager onSave={loadCustomData} />
          </div>

          <div className="mb-3">
            <select
              onChange={e => {
                if (e.target.value) {
                  addAddon(e.target.value);
                  e.target.value = '';
                }
              }}
              className="w-full px-3 py-2 border-2 border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
            >
              <option value="">+ Selecione um item</option>
              {Object.entries(addonCategories).map(([key, label]) => (
                <optgroup key={key} label={label}>
                  {allAddons
                    .filter(a => a.category === key)
                    .map(a => (
                      <option key={a.id} value={a.id}>
                        {a.name} (R$ {a.pricePerUnit.toFixed(2)}/{a.unit})
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          </div>

          {selectedAddons.length > 0 ? (
            <div className="space-y-2">
              {selectedAddons.map(sa => {
                const addon = allAddons.find(a => a.id === sa.id);
                return addon ? (
                  <div key={sa.id} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-200 dark:border-slate-600">
                    <span className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                      {addon.name}
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={sa.quantity}
                      onChange={e => updateAddonQuantity(sa.id, Number(e.target.value))}
                      className="w-16 px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-center"
                    />
                    <span className="text-xs text-slate-500 dark:text-slate-400 w-8">
                      {addon.unit}
                    </span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white w-20 text-right">
                      {formatCurrency(addon.pricePerUnit * sa.quantity)}
                    </span>
                  </div>
                ) : null;
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-sm">
              Nenhum item adicionado
            </div>
          )}
        </div>

        {/* Botão Calcular */}
        <button
          onClick={handleCalculate}
          className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 text-white font-black py-4 px-6 rounded-xl shadow-2xl shadow-orange-500/50 hover:shadow-orange-600/60 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 border-2 border-amber-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Calcular Preço
        </button>
      </div>

      {/* Resultados */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 border-2 border-amber-200 dark:border-amber-900/50 sticky top-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/30">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Orçamento</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Resultado da precificação</p>
          </div>
        </div>

        {result ? (
          <div className="space-y-4">
            {/* Preço Final Destaque */}
            <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-900/20 dark:via-amber-900/20 dark:to-yellow-900/20 border-2 border-orange-300 dark:border-orange-700 rounded-xl p-6 text-center shadow-lg shadow-orange-200/50">
              <div className="text-sm font-semibold text-orange-600 dark:text-orange-400 mb-1 uppercase tracking-wide">
                Valor Total a Cobrar
              </div>
              <div className="text-5xl font-black bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-sm">
                {formatCurrency(result.finalPrice)}
              </div>
              <div className="mt-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                Inclui margem de {result.profitMargin}% de lucro
              </div>
            </div>

            {/* Breakdown de Custos */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <h3 className="text-sm font-bold mb-3 text-slate-900 dark:text-white uppercase tracking-wide">
                Composição de Custos
              </h3>
              <div className="space-y-2">
                {result.breakdown.map((item, idx) => (
                  <div key={idx} className="group">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        {item.item}
                      </span>
                      <div className="flex gap-3 items-center">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {formatCurrency(item.value)}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-500 w-12 text-right">
                          {formatPercentage(item.percentage)}
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 transition-all duration-500 shadow-sm"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total e Lucro */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Custo Total
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatCurrency(result.costs.total)}
                </span>
              </div>
              <div className="flex justify-between text-sm bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
                <span className="font-semibold text-green-700 dark:text-green-400">
                  Lucro ({formatPercentage(result.profitMargin)})
                </span>
                <span className="font-bold text-green-700 dark:text-green-400">
                  {formatCurrency(result.profitValue)}
                </span>
              </div>
            </div>

            {/* PDF Actions */}
            <PDFActions
              calculation={result}
              printDetails={{
                printer: allPrinters.find(p => p.id === printerId)?.name || 'Não especificada',
                filaments: filamentUsages.map(fu => {
                  const fil = allFilaments.find(f => f.id === fu.filamentId);
                  return fil ? `${fil.brand} ${fil.type} (${fu.weight}g)` : '';
                }).filter(Boolean).join(', '),
                weight: totalWeight,
                printTime: printTime,
              }}
            />
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Configure os parâmetros e clique em
            </p>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              "Calcular Preço"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
