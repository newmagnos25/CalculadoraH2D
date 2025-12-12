'use client';

import { useState } from 'react';
import Tooltip, { HelpIcon } from './Tooltip';

export interface PrintSettings {
  infill: number; // 0-100%
  hasSupport: boolean;
  hasBrimRaft: boolean;
  printSpeed: 'fast' | 'normal' | 'quality';
  failureRate: number; // 0-30%
  prepTime: number; // minutos
  postProcessTime: number; // minutos
  batchQuantity: number; // quantidade em lote
}

interface AdvancedPrintSettingsProps {
  settings: PrintSettings;
  onChange: (settings: PrintSettings) => void;
}

export const DEFAULT_PRINT_SETTINGS: PrintSettings = {
  infill: 20,
  hasSupport: false,
  hasBrimRaft: false,
  printSpeed: 'normal',
  failureRate: 5,
  prepTime: 15,
  postProcessTime: 10,
  batchQuantity: 1,
};

export default function AdvancedPrintSettings({ settings, onChange }: AdvancedPrintSettingsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateSetting = <K extends keyof PrintSettings>(key: K, value: PrintSettings[K]) => {
    onChange({ ...settings, [key]: value });
  };

  // Calcular multiplicador de tempo baseado nas configurações
  const getTimeMultiplier = () => {
    let multiplier = 1.0;

    // Infill afeta tempo (10% = 0.8x, 100% = 1.5x)
    multiplier *= 0.8 + (settings.infill / 100) * 0.7;

    // Suporte adiciona 20-40%
    if (settings.hasSupport) multiplier *= 1.3;

    // Brim/Raft adiciona 5-10%
    if (settings.hasBrimRaft) multiplier *= 1.08;

    // Velocidade
    if (settings.printSpeed === 'fast') multiplier *= 0.7;
    if (settings.printSpeed === 'quality') multiplier *= 1.4;

    // Quantidade em lote (economiza tempo de preparação por peça)
    if (settings.batchQuantity > 1) {
      // Primeira peça = 100%, demais = 95% cada
      const batchEfficiency = 1 + (settings.batchQuantity - 1) * 0.95;
      multiplier *= batchEfficiency;
    }

    return multiplier;
  };

  const timeMultiplier = getTimeMultiplier();
  const speedLabels = {
    fast: 'Rápida (Draft)',
    normal: 'Normal',
    quality: 'Alta Qualidade'
  };

  return (
    <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span>⚙️ Configurações Avançadas de Impressão</span>
          <Tooltip content="Configure parâmetros técnicos que afetam o tempo e custo final. Essencial para orçamentos precisos!">
            <HelpIcon className="w-4 h-4" />
          </Tooltip>
        </div>
        <div className="flex items-center gap-2">
          {timeMultiplier !== 1.0 && (
            <span className="text-xs px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full font-bold">
              Tempo: {timeMultiplier > 1 ? '+' : ''}{((timeMultiplier - 1) * 100).toFixed(0)}%
            </span>
          )}
          <svg
            className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Infill */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  🏗️ Preenchimento (Infill)
                </label>
                <Tooltip content="Densidade interna da peça. 10-20% = padrão, 50%+ = peças resistentes, 100% = sólido">
                  <HelpIcon className="w-3.5 h-3.5" />
                </Tooltip>
              </div>
              <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                {settings.infill}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={settings.infill}
              onChange={e => updateSetting('infill', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span>0% (oco)</span>
              <span>50%</span>
              <span>100% (sólido)</span>
            </div>
          </div>

          {/* Suporte e Brim/Raft */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
              <input
                type="checkbox"
                id="hasSupport"
                checked={settings.hasSupport}
                onChange={e => updateSetting('hasSupport', e.target.checked)}
                className="w-4 h-4 text-orange-600 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded focus:ring-orange-500 dark:focus:ring-orange-600"
              />
              <div className="flex-1">
                <label htmlFor="hasSupport" className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  🔧 Suporte
                  <Tooltip content="Estruturas temporárias para peças com ângulos. Adiciona +30% tempo e material">
                    <HelpIcon className="w-3 h-3" />
                  </Tooltip>
                </label>
                {settings.hasSupport && (
                  <span className="text-[10px] text-orange-600 dark:text-orange-400 font-semibold">+30% tempo</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
              <input
                type="checkbox"
                id="hasBrimRaft"
                checked={settings.hasBrimRaft}
                onChange={e => updateSetting('hasBrimRaft', e.target.checked)}
                className="w-4 h-4 text-orange-600 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded focus:ring-orange-500 dark:focus:ring-orange-600"
              />
              <div className="flex-1">
                <label htmlFor="hasBrimRaft" className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  📋 Brim/Raft
                  <Tooltip content="Base extra para melhor aderência. Adiciona +8% tempo">
                    <HelpIcon className="w-3 h-3" />
                  </Tooltip>
                </label>
                {settings.hasBrimRaft && (
                  <span className="text-[10px] text-orange-600 dark:text-orange-400 font-semibold">+8% tempo</span>
                )}
              </div>
            </div>
          </div>

          {/* Velocidade de Impressão */}
          <div>
            <div className="flex items-center gap-1 mb-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                🚀 Velocidade de Impressão
              </label>
              <Tooltip content="Rápida = -30% tempo mas menor qualidade. Qualidade = +40% tempo mas acabamento superior">
                <HelpIcon className="w-3.5 h-3.5" />
              </Tooltip>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['fast', 'normal', 'quality'] as const).map(speed => (
                <button
                  key={speed}
                  onClick={() => updateSetting('printSpeed', speed)}
                  className={`px-3 py-2 rounded-lg font-semibold text-xs transition-all ${
                    settings.printSpeed === speed
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {speedLabels[speed]}
                </button>
              ))}
            </div>
          </div>

          {/* Quantidade em Lote */}
          <div>
            <div className="flex items-center gap-1 mb-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                📦 Quantidade em Lote
              </label>
              <Tooltip content="Imprimir várias peças de uma vez economiza tempo de preparação. 10 peças = ~10% mais eficiente">
                <HelpIcon className="w-3.5 h-3.5" />
              </Tooltip>
            </div>
            <input
              type="number"
              min="1"
              max="100"
              value={settings.batchQuantity}
              onChange={e => updateSetting('batchQuantity', Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-4 py-2 border-2 border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold text-center"
            />
            {settings.batchQuantity > 1 && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-semibold">
                ✅ Eficiência em lote: ~{((settings.batchQuantity - 1) * 5).toFixed(0)}% economia de tempo
              </p>
            )}
          </div>

          {/* Taxa de Falha */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  ⚠️ Taxa de Falha / Seguro
                </label>
                <Tooltip content="Margem de segurança para impressões falhadas. Recomendado: 5-10% para iniciantes, 3-5% para experientes">
                  <HelpIcon className="w-3.5 h-3.5" />
                </Tooltip>
              </div>
              <span className="text-sm font-bold text-red-600 dark:text-red-400">
                +{settings.failureRate}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={settings.failureRate}
              onChange={e => updateSetting('failureRate', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span>0% (sem seguro)</span>
              <span>15%</span>
              <span>30% (muito seguro)</span>
            </div>
          </div>

          {/* Tempo de Preparação */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center gap-1 mb-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  ⏱️ Preparação
                </label>
                <Tooltip content="Tempo para preparar STL, fatiar, configurar impressora. Média: 10-30 min">
                  <HelpIcon className="w-3.5 h-3.5" />
                </Tooltip>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={settings.prepTime}
                  onChange={e => updateSetting('prepTime', Math.max(0, parseInt(e.target.value) || 0))}
                  className="flex-1 px-3 py-2 border-2 border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-center font-semibold"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">min</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1 mb-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  🔨 Pós-Processamento
                </label>
                <Tooltip content="Tempo para remover suporte, lixar, pintar. Média: 5-60 min">
                  <HelpIcon className="w-3.5 h-3.5" />
                </Tooltip>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="240"
                  value={settings.postProcessTime}
                  onChange={e => updateSetting('postProcessTime', Math.max(0, parseInt(e.target.value) || 0))}
                  className="flex-1 px-3 py-2 border-2 border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-center font-semibold"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">min</span>
              </div>
            </div>
          </div>

          {/* Resumo do Impacto */}
          <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border-2 border-blue-300 dark:border-blue-700">
            <div className="text-xs font-bold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Impacto Total das Configurações:
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Multiplicador de Tempo:</span>
                <span className="font-bold text-slate-900 dark:text-white">{timeMultiplier.toFixed(2)}x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Taxa de Falha:</span>
                <span className="font-bold text-red-600 dark:text-red-400">+{settings.failureRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Prep + Pós:</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">{settings.prepTime + settings.postProcessTime} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Qtd. em Lote:</span>
                <span className="font-bold text-green-600 dark:text-green-400">{settings.batchQuantity}x</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
