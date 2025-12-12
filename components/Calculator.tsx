'use client';

import { useState, useEffect } from 'react';
import { filaments } from '@/data/filaments';
import { energyTariffs, getStates, getTariffsByState } from '@/data/energy-tariffs';
import { addons, addonCategories } from '@/data/addons';
import { calculatePrintCost, formatCurrency, formatPercentage, smartRoundPrice } from '@/lib/calculator';
import { CalculationInput, CalculationResult } from '@/lib/types';
import { getCustomFilaments, getCustomAddons, getAllPrinters, getDefaultPrinters, saveLastCalculation, getLastCalculation } from '@/lib/storage';
import { useAntiPiracy } from '@/lib/hooks/useAntiPiracy';
import { useSubscription } from '@/lib/hooks/useSubscription';
import { createClient } from '@/lib/supabase/client';
import { showMotivationalPopup } from '@/lib/motivational-popups';
import Link from 'next/link';
import toast from 'react-hot-toast';
import FilamentManager from './FilamentManager';
import AddonManager from './AddonManager';
import PrinterManager from './PrinterManager';
import PDFActions from './PDFActions';
import TemplatesManager from './TemplatesManager';
import STLUploader from './STLUploader';
import { ProductTemplate } from '@/lib/templates';
import { loadDefaultPrinter, saveDefaultPrinter } from '@/lib/user-preferences';
import Tooltip, { HelpIcon } from './Tooltip';
import AdvancedPrintSettings, { DEFAULT_PRINT_SETTINGS, PrintSettings } from './AdvancedPrintSettings';

interface FilamentUsage {
  id: string;
  filamentId: string;
  weight: number;
  color?: string;
}

interface CalculatorProps {
  isAuthenticated?: boolean;
}

export default function Calculator({ isAuthenticated = false }: CalculatorProps) {
  // Proteção anti-pirataria
  useAntiPiracy();

  // Verificação de assinatura e limites
  const { subscription, loading: subLoading, refresh: refreshSubscription } = useSubscription();

  // Filamentos, adereços e impressoras (padrão + customizados)
  const [allPrinters, setAllPrinters] = useState(getDefaultPrinters());
  const [allFilaments, setAllFilaments] = useState(filaments);
  const [allAddons, setAllAddons] = useState(addons);

  // Estados do formulário
  const [printerId, setPrinterId] = useState(allPrinters[0]?.id || '');
  const [filamentUsages, setFilamentUsages] = useState<FilamentUsage[]>([
    { id: '1', filamentId: filaments[0].id, weight: 50 }
  ]);
  const [printTime, setPrintTime] = useState(120); // mantém em minutos internamente
  const [printHours, setPrintHours] = useState(2);
  const [printMinutes, setPrintMinutes] = useState(0);
  const [selectedState, setSelectedState] = useState('SP');
  const [energyTariffId, setEnergyTariffId] = useState('Enel São Paulo');

  // Estados com auto-save (custos e margem)
  const [laborCost, setLaborCost] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('laborCost');
      return saved ? parseFloat(saved) : 0;
    }
    return 0;
  });
  const [depreciation, setDepreciation] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('depreciation');
      return saved ? parseFloat(saved) : 1;
    }
    return 1;
  });
  const [fixedCosts, setFixedCosts] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fixedCosts');
      return saved ? parseFloat(saved) : 0.5;
    }
    return 0.5;
  });
  const [profitMargin, setProfitMargin] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('profitMargin');
      return saved ? parseFloat(saved) : 30;
    }
    return 30;
  });

  // Adereços selecionados
  const [selectedAddons, setSelectedAddons] = useState<{ id: string; quantity: number }[]>([]);

  // Configurações avançadas de impressão
  const [printSettings, setPrintSettings] = useState<PrintSettings>(DEFAULT_PRINT_SETTINGS);

  // Detalhes da peça
  const [itemDescription, setItemDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [dimensions, setDimensions] = useState('');
  const [productImage, setProductImage] = useState('');
  const [stlFileName, setStlFileName] = useState<string | null>(null);

  // Resultado
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [currentQuoteId, setCurrentQuoteId] = useState<string | null>(null); // ID do quote salvo (PDF grátis)

  // Templates modal
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);

  // Flag para evitar salvar durante restauração inicial
  const [isRestoring, setIsRestoring] = useState(true);

  // Carregar dados customizados e último cálculo
  useEffect(() => {
    const initializeCalculator = async () => {
      await loadCustomData();
      restoreLastCalculation();

      // Carregar impressora padrão do perfil do usuário
      const defaultPrinter = await loadDefaultPrinter();
      if (defaultPrinter) {
        // Verificar se a impressora existe na lista (buscar direto, não do state)
        const allPrintersData = await getAllPrinters();
        const printerExists = allPrintersData.some(p => p.id === defaultPrinter);
        if (printerExists) {
          setPrinterId(defaultPrinter);
          console.log('📥 Impressora padrão carregada:', defaultPrinter);
        }
      }

      // Após restaurar, habilitar auto-save
      setTimeout(() => setIsRestoring(false), 100);
    };

    initializeCalculator();
  }, []);

  // Salvar estado automaticamente quando campos importantes mudarem
  useEffect(() => {
    if (!isRestoring) {
      saveCurrentState();
    }
  }, [printerId, filamentUsages, printTime, selectedState, energyTariffId, selectedAddons, itemDescription, quantity, dimensions, isRestoring]);

  // Resetar quoteId quando dados mudarem (forçar novo cálculo = novo crédito)
  useEffect(() => {
    if (!isRestoring && currentQuoteId) {
      setCurrentQuoteId(null); // Dados mudaram, precisa recalcular
    }
  }, [printerId, filamentUsages, printTime, energyTariffId, laborCost, depreciation, fixedCosts, profitMargin, selectedAddons, isRestoring]);

  // Auto-save custos e margem quando mudarem
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('laborCost', laborCost.toString());
    }
  }, [laborCost]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('depreciation', depreciation.toString());
    }
  }, [depreciation]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fixedCosts', fixedCosts.toString());
    }
  }, [fixedCosts]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('profitMargin', profitMargin.toString());
    }
  }, [profitMargin]);

  // Salvar impressora padrão quando mudar (após restauração inicial)
  useEffect(() => {
    if (!isRestoring && printerId) {
      saveDefaultPrinter(printerId).then(success => {
        if (success) {
          console.log('💾 Impressora padrão salva:', printerId);
        }
      });
    }
  }, [printerId, isRestoring]);

  // Sincronizar printTime com horas e minutos
  useEffect(() => {
    const totalMinutes = printHours * 60 + printMinutes;
    if (totalMinutes !== printTime) {
      setPrintTime(totalMinutes);
    }
  }, [printHours, printMinutes]);

  // Inicializar horas e minutos a partir de printTime (ao restaurar dados)
  useEffect(() => {
    const hours = Math.floor(printTime / 60);
    const minutes = printTime % 60;
    if (hours !== printHours || minutes !== printMinutes) {
      setPrintHours(hours);
      setPrintMinutes(minutes);
    }
  }, [printTime]);

  const loadCustomData = async () => {
    const customFilaments = getCustomFilaments();
    const customAddons = getCustomAddons();
    setAllFilaments([...filaments, ...customFilaments]);
    setAllAddons([...addons, ...customAddons]);
    const allPrintersData = await getAllPrinters(); // Já combina printers default + custom
    setAllPrinters(allPrintersData);
  };

  const restoreLastCalculation = () => {
    const lastCalc = getLastCalculation();
    if (lastCalc) {
      if (lastCalc.printerId) setPrinterId(lastCalc.printerId);
      if (lastCalc.filamentUsages) setFilamentUsages(lastCalc.filamentUsages);
      if (lastCalc.printTime) setPrintTime(lastCalc.printTime);
      if (lastCalc.selectedState) setSelectedState(lastCalc.selectedState);
      if (lastCalc.energyTariffId) setEnergyTariffId(lastCalc.energyTariffId);
      if (lastCalc.selectedAddons) setSelectedAddons(lastCalc.selectedAddons);
      if (lastCalc.itemDescription) setItemDescription(lastCalc.itemDescription);
      if (lastCalc.quantity) setQuantity(lastCalc.quantity);
      if (lastCalc.dimensions) setDimensions(lastCalc.dimensions);
      if (lastCalc.productImage) setProductImage(lastCalc.productImage);
    }
  };

  const saveCurrentState = () => {
    if (typeof window === 'undefined') return;
    const state = {
      printerId,
      filamentUsages,
      printTime,
      selectedState,
      energyTariffId,
      selectedAddons,
      itemDescription,
      quantity,
      dimensions,
      productImage
    };
    saveLastCalculation(state);
  };

  const handleCalculate = async () => {
    try {
      // Verificar créditos disponíveis
      if (!subscription || !subscription.allowed) {
        toast.error('Você atingiu o limite de orçamentos do seu plano! Faça upgrade para continuar.');
        return;
      }

      // Validação básica
      if (filamentUsages.length === 0) {
        toast.error('Adicione pelo menos um filamento antes de calcular!');
        return;
      }

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

    const calculatedResult = await calculatePrintCost(input);

    // Ajustar custo de filamento para usar o calculado manualmente (com arredondamento)
    const roundedTotalFilamentCost = Math.round(totalFilamentCost * 100) / 100;
    calculatedResult.costs.filament = roundedTotalFilamentCost;

    const roundedTotal =
      roundedTotalFilamentCost +
      calculatedResult.costs.energy +
      calculatedResult.costs.labor +
      calculatedResult.costs.depreciation +
      calculatedResult.costs.fixedCosts +
      calculatedResult.costs.addons +
      calculatedResult.costs.postProcessing;

    calculatedResult.costs.total = Math.round(roundedTotal * 100) / 100;

    // Apply failure rate insurance to total cost
    const failureCost = Math.round((calculatedResult.costs.total * (printSettings.failureRate / 100)) * 100) / 100;
    if (failureCost > 0) {
      calculatedResult.costs.total += failureCost;
      // Add to breakdown if significant
      calculatedResult.breakdown.push({
        item: `Seguro de falhas (${printSettings.failureRate}%)`,
        value: failureCost,
        percentage: (failureCost / calculatedResult.costs.total) * 100,
      });
    }

    const profitValue = Math.round((calculatedResult.costs.total * profitMargin / 100) * 100) / 100;
    calculatedResult.profitValue = profitValue;

    // Aplicar arredondamento inteligente no preço final
    const rawFinalPrice = calculatedResult.costs.total + profitValue;
    calculatedResult.rawFinalPrice = rawFinalPrice; // Guardar valor original
    calculatedResult.finalPrice = smartRoundPrice(rawFinalPrice);

    // Recalcular breakdown
    calculatedResult.breakdown = [
      {
        item: 'Filamento',
        value: roundedTotalFilamentCost,
        percentage: (roundedTotalFilamentCost / calculatedResult.costs.total) * 100,
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

    // Salvar quote no banco e consumir crédito
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: quoteData } = await supabase.from('quotes').insert({
        user_id: user.id,
        quote_data: {
          calculation: calculatedResult,
          printDetails: {
            itemDescription,
            quantity,
            dimensions,
            productImage,
            printer: allPrinters.find(p => p.id === printerId)?.name || '',
            filaments: filamentUsages.map(usage => {
              const fil = allFilaments.find(f => f.id === usage.filamentId);
              return fil ? `${fil.brand} ${fil.type}` : '';
            }).join(', '),
            weight: filamentUsages.reduce((sum, u) => sum + u.weight, 0),
            printTime,
          },
          type: 'calculation',
        },
      }).select('id').single();

      if (quoteData) {
        setCurrentQuoteId(quoteData.id);
      }
    }

    await refreshSubscription(); // Atualizar contador de créditos

    toast.success('✅ Orçamento calculado! 1 crédito gasto. PDF GRÁTIS, Contrato +1 crédito.', {
      duration: 5000,
      icon: '💰',
    });

    // Mostrar popup motivacional após consumir crédito
    if (subscription && !subscription.is_unlimited) {
      const newRemaining = (subscription.remaining || 0) - 1;
      showMotivationalPopup(newRemaining, subscription.max || 0);
    }
  } catch (error) {
    console.error('❌ Erro ao calcular preço:', error);
    toast.error('Erro ao calcular o preço. Verifique os dados e tente novamente.');
  }
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

  // Load template data into calculator
  const handleLoadTemplate = (template: ProductTemplate) => {
    try {
      setPrinterId(template.printerId);
      setFilamentUsages(template.filamentUsages.map((f, index) => ({
        id: Date.now().toString() + index,
        filamentId: f.filamentId,
        weight: f.weight,
      })));
      setPrintTime(template.printTime.hours * 60 + template.printTime.minutes);
      setSelectedAddons(template.selectedAddons);
      setItemDescription(template.itemDescription);
      setDimensions(`${template.dimensions.length}x${template.dimensions.width}x${template.dimensions.height}`);
    } catch (error) {
      console.error('Error loading template:', error);
      toast.error('Erro ao carregar template');
    }
  };

  // Calculate time multiplier based on print settings
  const getTimeMultiplier = (settings: PrintSettings): number => {
    let multiplier = 1.0;

    // Infill: 10% = 0.8x, 100% = 1.5x
    multiplier *= 0.8 + (settings.infill / 100) * 0.7;

    // Support adds 30%
    if (settings.hasSupport) multiplier *= 1.3;

    // Brim/Raft adds 8%
    if (settings.hasBrimRaft) multiplier *= 1.08;

    // Speed adjustments
    if (settings.printSpeed === 'fast') multiplier *= 0.7;
    if (settings.printSpeed === 'quality') multiplier *= 1.4;

    return multiplier;
  };

  // Handle STL file analysis
  const handleSTLAnalysis = (analysis: {
    volume: number;
    dimensions: { width: number; height: number; depth: number };
    surfaceArea: number;
    estimatedPrintTime: number;
    estimatedWeight: number;
    triangles: number;
  }) => {
    try {
      // Get selected filament density
      const filament = allFilaments.find(f => f.id === filamentUsages[0]?.filamentId);
      const density = filament?.density || 1.24; // Default to PLA

      // Calculate weight with actual infill and density
      const baseWeight = analysis.volume * density * (printSettings.infill / 100);

      // Add support weight if enabled (approximately 15% of model volume)
      let totalWeight = baseWeight;
      if (printSettings.hasSupport) {
        totalWeight += analysis.volume * density * 0.15;
      }

      // Add brim/raft weight if enabled (based on base area)
      if (printSettings.hasBrimRaft) {
        const bedArea = (analysis.dimensions.width * analysis.dimensions.depth) / 10000; // cm²
        totalWeight += bedArea * 2; // ~2g per 100cm²
      }

      // Apply time multiplier from settings
      const timeMultiplier = getTimeMultiplier(printSettings);
      let adjustedTime = analysis.estimatedPrintTime * timeMultiplier;

      // Add prep and post-processing time
      adjustedTime += printSettings.prepTime + printSettings.postProcessTime;

      // Atualizar peso do filamento (primeiro filamento da lista)
      if (filamentUsages.length > 0) {
        updateFilamentUsage(filamentUsages[0].id, { weight: Math.round(totalWeight) });
      }

      // Atualizar tempo de impressão
      setPrintTime(Math.round(adjustedTime));

      // Atualizar dimensões
      const dims = `${analysis.dimensions.width.toFixed(1)}x${analysis.dimensions.height.toFixed(1)}x${analysis.dimensions.depth.toFixed(1)}mm`;
      setDimensions(dims);

      toast.success(`✅ STL analisado! Peso: ${Math.round(totalWeight)}g, Tempo: ${Math.floor(adjustedTime / 60)}h${Math.round(adjustedTime % 60)}min (com ajustes)`, {
        duration: 6000,
      });
    } catch (error) {
      console.error('Error handling STL analysis:', error);
      toast.error('Erro ao processar análise do STL');
    }
  };

  const stateTariffs = getTariffsByState(selectedState);
  const totalWeight = parseFloat(filamentUsages.reduce((sum, f) => sum + f.weight, 0).toFixed(2));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Formulário */}
      <div className="space-y-6">
        {/* Card Principal */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 border-2 border-orange-200 dark:border-orange-900/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/30">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Nova Cotação
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Configure os parâmetros da impressão</p>
              </div>
            </div>
            <button
              onClick={() => setShowTemplatesModal(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold rounded-lg transition-all shadow-lg text-xs sm:text-sm"
              title="Gerenciar templates de produtos"
            >
              <span className="hidden sm:inline">📋 Templates</span>
              <span className="sm:hidden">📋</span>
            </button>
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

          {/* Upload de Modelo STL */}
          <div className="mb-4">
            <STLUploader
              onAnalysisComplete={handleSTLAnalysis}
              onFileLoaded={(fileName) => setStlFileName(fileName)}
              maxSizeMB={50}
            />
          </div>

          {/* Detalhes do Item */}
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-300 dark:border-blue-700">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <label className="text-sm font-bold text-blue-900 dark:text-blue-200">
                📝 Descrição do Item
              </label>
              <Tooltip content="Descreva o produto para identificação no PDF. Ex: Miniatura, Suporte, Chaveiro...">
                <HelpIcon className="w-4 h-4" />
              </Tooltip>
            </div>

            <input
              type="text"
              value={itemDescription}
              onChange={e => setItemDescription(e.target.value)}
              placeholder="Ex: Miniatura Pokemon, Suporte para celular, Chaveiro personalizado..."
              className="w-full px-4 py-2.5 mb-3 border-2 border-blue-200 dark:border-blue-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all text-sm"
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <label className="block text-xs font-semibold text-blue-800 dark:text-blue-300">
                    📦 Quantidade
                  </label>
                  <Tooltip content="Número de peças iguais que serão impressas neste orçamento">
                    <HelpIcon className="w-3.5 h-3.5" />
                  </Tooltip>
                </div>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 border-2 border-blue-200 dark:border-blue-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all text-sm"
                />
              </div>

              <div>
                <div className="flex items-center gap-1 mb-1">
                  <label className="block text-xs font-semibold text-blue-800 dark:text-blue-300">
                    📏 Dimensões (opcional)
                  </label>
                  <Tooltip content="Tamanho aproximado da peça. Auto-preenchido ao fazer upload do STL">
                    <HelpIcon className="w-3.5 h-3.5" />
                  </Tooltip>
                </div>
                <input
                  type="text"
                  value={dimensions}
                  onChange={e => setDimensions(e.target.value)}
                  placeholder="Ex: 10x5x3cm"
                  className="w-full px-3 py-2 border-2 border-blue-200 dark:border-blue-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all text-sm"
                />
              </div>
            </div>

          </div>

          {/* Filamentos/Cores */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Filamentos / Cores ({filamentUsages.length})
                </label>
                <Tooltip content="Adicione cada filamento usado. Peso em GRAMAS (ex: 50g). Para multi-cor, clique em 'Adicionar cor'">
                  <HelpIcon className="w-4 h-4" />
                </Tooltip>
              </div>
              <button
                onClick={addFilamentUsage}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Adicionar cor
              </button>
            </div>

            <div className="space-y-2">
              {filamentUsages.map((usage, idx) => {
                const commonColors = [
                  { name: 'Branco', value: '#FFFFFF' },
                  { name: 'Preto', value: '#1F2937' },
                  { name: 'Vermelho', value: '#EF4444' },
                  { name: 'Azul', value: '#3B82F6' },
                  { name: 'Verde', value: '#10B981' },
                  { name: 'Amarelo', value: '#FCD34D' },
                  { name: 'Laranja', value: '#F97316' },
                  { name: 'Rosa', value: '#EC4899' },
                  { name: 'Roxo', value: '#A855F7' },
                  { name: 'Cinza', value: '#6B7280' },
                  { name: 'Marrom', value: '#92400E' },
                  { name: 'Transparente', value: '#E5E7EB' },
                ];

                return (
                <div key={usage.id} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 border border-slate-200 dark:border-slate-600">
                  <div className="flex gap-2 items-start sm:items-center flex-col sm:flex-row">
                    <div className="w-full sm:flex-1 sm:min-w-[140px]">
                      <select
                        value={usage.filamentId}
                        onChange={e => updateFilamentUsage(usage.id, { filamentId: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
                      >
                        {allFilaments.map(f => (
                          <option key={f.id} value={f.id}>
                            {f.brand} - {f.type} (R$ {f.pricePerKg.toFixed(2)}/kg)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-2 items-center w-full sm:w-auto justify-between sm:justify-start">
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          value={usage.weight}
                          onChange={e => updateFilamentUsage(usage.id, { weight: Number(e.target.value) })}
                          className="w-16 sm:w-20 px-2 sm:px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
                          placeholder="g"
                        />

                        <div className="relative">
                          <select
                            value={usage.color || ''}
                            onChange={e => updateFilamentUsage(usage.id, { color: e.target.value })}
                            className="pl-8 sm:pl-9 pr-2 sm:pr-3 py-2 text-xs sm:text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 appearance-none"
                          >
                            <option value="">Cor</option>
                            {commonColors.map(color => (
                              <option key={color.value} value={color.value}>
                                {color.name}
                              </option>
                            ))}
                          </select>
                          {usage.color && (
                            <div
                              className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 rounded border-2 border-slate-400 dark:border-slate-500 pointer-events-none"
                              style={{ backgroundColor: usage.color }}
                            />
                          )}
                        </div>
                      </div>

                      {filamentUsages.length > 1 && (
                        <button
                          onClick={() => removeFilamentUsage(usage.id)}
                          className="text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 p-2 transition-colors"
                          title="Remover"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                );
              })}
            </div>

            {/* Preview de Cores - MOVIDO para depois de escolher */}
            {filamentUsages.length > 0 && filamentUsages.some(u => u.color) && (
              <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border-2 border-green-300 dark:border-green-700">
                <div className="text-xs font-bold text-green-700 dark:text-green-300 mb-2 flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  Preview das Cores:
                </div>
                <div className="flex flex-wrap gap-2">
                  {filamentUsages.filter(u => u.color).map((usage) => (
                    <div key={usage.id} className="flex items-center gap-1.5 bg-white dark:bg-slate-700 px-3 py-1.5 rounded-lg border-2 border-green-400 dark:border-green-600 shadow-sm">
                      <div
                        className="w-6 h-6 rounded border-2 border-slate-400 dark:border-slate-500 shadow-md"
                        style={{ backgroundColor: usage.color }}
                        title={usage.color}
                      />
                      <span className="text-xs text-slate-700 dark:text-slate-300 font-bold">{usage.weight}g</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-2">
              <FilamentManager onSave={loadCustomData} />
            </div>

            <div className="mt-2 text-xs text-slate-700 dark:text-slate-300 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 px-3 py-2.5 rounded-md border-2 border-green-400 dark:border-green-700">
              <strong className="text-green-700 dark:text-green-300 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
                Peso total:
              </strong>
              <span className="text-green-800 dark:text-green-200 font-bold ml-1">{totalWeight}g</span>
            </div>
          </div>

          {/* Tempo e Energia */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                ⏱️ Tempo de Impressão
              </label>
              <Tooltip content="Tempo total de impressão. Veja no slicer (Cura, PrusaSlicer, etc) antes de exportar o G-code">
                <HelpIcon className="w-4 h-4" />
              </Tooltip>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600 dark:text-slate-400">
                  Horas
                </label>
                <input
                  type="number"
                  min="0"
                  max="999"
                  value={printHours}
                  onChange={e => setPrintHours(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-4 py-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-800 transition-all text-center font-bold text-lg"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600 dark:text-slate-400">
                  Minutos
                </label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={printMinutes}
                  onChange={e => {
                    const val = parseInt(e.target.value) || 0;
                    if (val >= 60) {
                      // Converter minutos extras em horas
                      setPrintHours(printHours + Math.floor(val / 60));
                      setPrintMinutes(val % 60);
                    } else {
                      setPrintMinutes(Math.max(0, Math.min(59, val)));
                    }
                  }}
                  className="w-full px-4 py-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-800 transition-all text-center font-bold text-lg"
                  placeholder="0"
                />
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
              ⏱️ Total: <strong className="text-orange-600 dark:text-orange-400">{printTime} minutos</strong> ({printHours}h {printMinutes}min)
            </p>
          </div>

          {/* Energia */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Estado
                </label>
                <Tooltip content="Selecione seu estado para calcular o custo de energia correto. Cada distribuidora tem tarifa diferente">
                  <HelpIcon className="w-4 h-4" />
                </Tooltip>
              </div>
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
              <div className="flex items-center gap-2 mb-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Distribuidora
                </label>
                <Tooltip content="Selecione sua distribuidora de energia. O valor em R$/kWh é usado para calcular o custo elétrico">
                  <HelpIcon className="w-4 h-4" />
                </Tooltip>
              </div>
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

          {/* Configurações Avançadas de Impressão */}
          <div className="mb-4">
            <AdvancedPrintSettings
              settings={printSettings}
              onChange={setPrintSettings}
            />
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
                  <div className="flex items-center gap-1 mb-1">
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                      Mão de obra (R$/h)
                    </label>
                    <Tooltip content="Valor da sua hora de trabalho. Média: R$ 15-50/h dependendo da complexidade">
                      <HelpIcon className="w-3.5 h-3.5" />
                    </Tooltip>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    value={laborCost}
                    onChange={e => setLaborCost(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                      Depreciação (R$)
                    </label>
                    <Tooltip content="Desgaste da impressora por uso. Calcule: (Preço da impressora ÷ Vida útil em impressões)">
                      <HelpIcon className="w-3.5 h-3.5" />
                    </Tooltip>
                  </div>
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
                  <div className="flex items-center gap-1 mb-1">
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                      Custos fixos (R$)
                    </label>
                    <Tooltip content="Custos indiretos por impressão: aluguel, internet, embalagem, etc. Média: R$ 0,50-2,00">
                      <HelpIcon className="w-3.5 h-3.5" />
                    </Tooltip>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    value={fixedCosts}
                    onChange={e => setFixedCosts(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                      Margem de lucro (%)
                    </label>
                    <Tooltip content="Seu lucro sobre os custos. Mercado: 30-50% para peças simples, 50-100% para complexas">
                      <HelpIcon className="w-3.5 h-3.5" />
                    </Tooltip>
                  </div>
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
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Adereços e Inserções
                </h3>
                <Tooltip content="Adicione itens extras: parafusos, ímãs, insertos metálicos, LEDs, etc. O custo é somado ao orçamento">
                  <HelpIcon className="w-4 h-4" />
                </Tooltip>
              </div>
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
        {subscription && !subscription.allowed ? (
          <div className="space-y-3">
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-xl p-4 text-center">
              <p className="text-red-800 dark:text-red-200 font-bold mb-2">
                ❌ Limite de Orçamentos Atingido!
              </p>
              <p className="text-red-700 dark:text-red-300 text-sm mb-3">
                Você usou {subscription.current}/{subscription.max} orçamentos do plano {subscription.tier.toUpperCase()}.
              </p>
              <Link
                href="/pricing"
                className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg"
              >
                🚀 Fazer Upgrade Agora
              </Link>
            </div>
            <button
              disabled
              className="w-full bg-slate-400 dark:bg-slate-700 text-slate-200 dark:text-slate-500 font-black py-3 sm:py-4 px-4 sm:px-6 rounded-xl cursor-not-allowed flex items-center justify-center gap-2 border-2 border-slate-300 dark:border-slate-600 text-sm sm:text-base opacity-50"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Bloqueado - Upgrade Necessário
            </button>
          </div>
        ) : (
          <button
            onClick={handleCalculate}
            disabled={subLoading}
            className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 disabled:from-slate-400 disabled:via-slate-400 disabled:to-slate-400 text-white font-black py-3 sm:py-4 px-4 sm:px-6 rounded-xl shadow-2xl shadow-orange-500/50 hover:shadow-orange-600/60 transition-all transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2 border-2 border-amber-300 text-sm sm:text-base"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            {subLoading ? 'Verificando...' : subscription && !subscription.is_unlimited ? `Calcular (${subscription.remaining || 0} restantes)` : 'Calcular Preço'}
          </button>
        )}
      </div>

      {/* Resultados */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-4 sm:p-6 border-2 border-amber-200 dark:border-amber-900/50 lg:sticky lg:top-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/30">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Orçamento</h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Resultado da precificação</p>
          </div>
        </div>

        {result ? (
          <div className="space-y-4">
            {/* Aviso: Não autenticado */}
            {!isAuthenticated && (
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-2 border-orange-500 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-orange-900 dark:text-orange-200 mb-1">
                      🔒 Cálculo Limitado - Faça Login
                    </h3>
                    <p className="text-sm text-orange-800 dark:text-orange-300 mb-3">
                      Você está vendo apenas o custo base. Para calcular o preço final com sua margem de lucro, salvar orçamentos e gerar PDFs profissionais:
                    </p>
                    <div className="flex gap-2">
                      <a href="/auth/login" className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-sm transition-all">
                        Fazer Login
                      </a>
                      <a href="/auth/signup" className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-orange-600 dark:text-orange-400 font-bold rounded-lg text-sm transition-all border-2 border-orange-600">
                        Criar Conta Grátis
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preço Final Destaque */}
            <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20 border-2 border-green-300 dark:border-green-700 rounded-xl p-6 text-center shadow-lg shadow-green-200/50 dark:shadow-green-900/20">
              <div className="text-sm font-semibold text-green-700 dark:text-green-300 mb-1 uppercase tracking-wide">
                {isAuthenticated ? 'Valor Total a Cobrar' : 'Custo Base (sem margem)'}
              </div>
              <div className="text-5xl font-black bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent drop-shadow-sm">
                {isAuthenticated ? formatCurrency(result.finalPrice) : formatCurrency(result.costs.total)}
              </div>
              {isAuthenticated && (
                <>
                  <div className="mt-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                    Inclui margem de {result.profitMargin}% de lucro
                  </div>
                  {result.rawFinalPrice && Math.abs(result.finalPrice - result.rawFinalPrice) > 0.01 && (
                    <div className="mt-1 text-xs text-blue-600 dark:text-blue-400 font-medium">
                      ℹ️ Arredondado de {formatCurrency(result.rawFinalPrice)} para facilitar cobrança
                    </div>
                  )}
                </>
              )}
              {!isAuthenticated && (
                <div className="mt-2 text-xs text-orange-600 dark:text-orange-400 font-medium">
                  ⚠️ Faça login para adicionar margem de lucro
                </div>
              )}
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
              quoteId={currentQuoteId}
              printDetails={{
                itemDescription: itemDescription || 'Impressão 3D',
                quantity: quantity,
                dimensions: dimensions,
                productImage: productImage,
                printer: allPrinters.find(p => p.id === printerId)?.name || 'Não especificada',
                filaments: filamentUsages.map(fu => {
                  const fil = allFilaments.find(f => f.id === fu.filamentId);
                  return fil ? `${fil.type} ${fil.brand}` : '';
                }).filter(Boolean).join(', '),
                filamentColors: filamentUsages.map(fu => {
                  const fil = allFilaments.find(f => f.id === fu.filamentId);
                  return {
                    name: fil ? `${fil.type} ${fil.brand}` : 'Desconhecido',
                    color: fu.color || '#999999',
                    weight: fu.weight,
                  };
                }),
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

      {/* Templates Manager Modal */}
      <TemplatesManager
        isOpen={showTemplatesModal}
        onClose={() => setShowTemplatesModal(false)}
        onLoadTemplate={handleLoadTemplate}
        currentCalculation={
          printerId
            ? {
                printerId,
                filamentUsages: filamentUsages.map(f => ({
                  filamentId: f.filamentId,
                  weight: f.weight,
                })),
                printTime: {
                  hours: Math.floor(printTime / 60),
                  minutes: printTime % 60,
                },
                selectedAddons,
                itemDescription,
                dimensions: {
                  length: parseFloat(dimensions.split('x')[0] || '0'),
                  width: parseFloat(dimensions.split('x')[1] || '0'),
                  height: parseFloat(dimensions.split('x')[2] || '0'),
                },
              }
            : undefined
        }
      />
    </div>
  );
}
