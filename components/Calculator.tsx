'use client';

import { useState } from 'react';
import { printers } from '@/data/printers';
import { filaments } from '@/data/filaments';
import { energyTariffs, getStates, getTariffsByState } from '@/data/energy-tariffs';
import { addons, addonCategories } from '@/data/addons';
import { calculatePrintCost, formatCurrency, formatPercentage } from '@/lib/calculator';
import { CalculationInput, CalculationResult } from '@/lib/types';

export default function Calculator() {
  // Estados do formulário
  const [printerId, setPrinterId] = useState(printers[0].id);
  const [filamentId, setFilamentId] = useState(filaments[0].id);
  const [weight, setWeight] = useState(50);
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

  const handleCalculate = () => {
    const input: CalculationInput = {
      printerId,
      filamentId,
      weight,
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
    setResult(calculatedResult);
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Formulário */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
          Dados da Impressão
        </h2>

        {/* Impressora */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
            Impressora
          </label>
          <select
            value={printerId}
            onChange={e => setPrinterId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          >
            {printers.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filamento */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
            Filamento
          </label>
          <select
            value={filamentId}
            onChange={e => setFilamentId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          >
            {filaments.map(f => (
              <option key={f.id} value={f.id}>
                {f.brand} - {f.type} (R$ {f.pricePerKg.toFixed(2)}/kg)
              </option>
            ))}
          </select>
        </div>

        {/* Peso e Tempo */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              Peso (g)
            </label>
            <input
              type="number"
              value={weight}
              onChange={e => setWeight(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              Tempo (min)
            </label>
            <input
              type="number"
              value={printTime}
              onChange={e => setPrintTime(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Energia */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
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
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          >
            {getStates().map(state => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
            Distribuidora de Energia
          </label>
          <select
            value={energyTariffId}
            onChange={e => setEnergyTariffId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          >
            {stateTariffs.map(t => (
              <option key={t.distributor} value={t.distributor}>
                {t.distributor} (R$ {t.pricePerKwh.toFixed(3)}/kWh)
              </option>
            ))}
          </select>
        </div>

        {/* Custos Adicionais */}
        <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
          <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
            Custos Adicionais
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                Mão de obra (R$/h)
              </label>
              <input
                type="number"
                step="0.1"
                value={laborCost}
                onChange={e => setLaborCost(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                Depreciação (R$)
              </label>
              <input
                type="number"
                step="0.1"
                value={depreciation}
                onChange={e => setDepreciation(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                Custos fixos (R$)
              </label>
              <input
                type="number"
                step="0.1"
                value={fixedCosts}
                onChange={e => setFixedCosts(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                Margem de lucro (%)
              </label>
              <input
                type="number"
                step="1"
                value={profitMargin}
                onChange={e => setProfitMargin(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Adereços */}
        <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
          <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
            Adereços e Inserções
          </h3>

          <div className="mb-4">
            <select
              onChange={e => {
                if (e.target.value) {
                  addAddon(e.target.value);
                  e.target.value = '';
                }
              }}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              <option value="">+ Adicionar item</option>
              {Object.entries(addonCategories).map(([key, label]) => (
                <optgroup key={key} label={label}>
                  {addons
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

          {selectedAddons.length > 0 && (
            <div className="space-y-2">
              {selectedAddons.map(sa => {
                const addon = addons.find(a => a.id === sa.id);
                return addon ? (
                  <div key={sa.id} className="flex items-center gap-2">
                    <span className="flex-1 text-sm text-slate-700 dark:text-slate-300">
                      {addon.name}
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={sa.quantity}
                      onChange={e => updateAddonQuantity(sa.id, Number(e.target.value))}
                      className="w-20 px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                    />
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {addon.unit}
                    </span>
                  </div>
                ) : null;
              })}
            </div>
          )}
        </div>

        {/* Botão Calcular */}
        <button
          onClick={handleCalculate}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Calcular Preço
        </button>
      </div>

      {/* Resultados */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Resultado</h2>

        {result ? (
          <div className="space-y-4">
            {/* Preço Final Destaque */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-lg p-6 text-center">
              <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                Preço Final
              </div>
              <div className="text-4xl font-bold text-blue-700 dark:text-blue-300">
                {formatCurrency(result.finalPrice)}
              </div>
            </div>

            {/* Breakdown de Custos */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <h3 className="text-lg font-semibold mb-3 text-slate-900 dark:text-white">
                Composição de Custos
              </h3>
              <div className="space-y-2">
                {result.breakdown.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">{item.item}</span>
                    <div className="flex gap-3">
                      <span className="font-medium text-slate-900 dark:text-white">
                        {formatCurrency(item.value)}
                      </span>
                      <span className="text-slate-500 dark:text-slate-500 w-12 text-right">
                        {formatPercentage(item.percentage)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total e Lucro */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-slate-900 dark:text-white">
                  Custo Total
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {formatCurrency(result.costs.total)}
                </span>
              </div>
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span className="font-semibold">
                  Lucro ({formatPercentage(result.profitMargin)})
                </span>
                <span className="font-semibold">{formatCurrency(result.profitValue)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 dark:text-slate-500">
            Preencha os dados e clique em "Calcular Preço"
          </div>
        )}
      </div>
    </div>
  );
}
