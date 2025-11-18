'use client';

import { useState, useEffect } from 'react';
import { Printer } from '@/lib/types';
import { getAllPrinters, getCustomPrinters, saveCustomPrinter, deleteCustomPrinter } from '@/lib/storage';
import Collapse from './Collapse';

interface PrinterManagerProps {
  selectedPrinterId?: string;
  onPrinterSelect?: (printer: Printer | null) => void;
  showAsList?: boolean; // Modo lista completa para gerenciamento
}

export default function PrinterManager({ selectedPrinterId, onPrinterSelect, showAsList = false }: PrinterManagerProps) {
  const [allPrinters, setAllPrinters] = useState<Printer[]>([]);
  const [customPrinters, setCustomPrinters] = useState<Printer[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Printer>>({
    name: '',
    brand: '',
    buildVolume: { x: 220, y: 220, z: 250 },
    maxTemp: { hotend: 300, bed: 100 },
    powerConsumption: { idle: 10, heating: 100, printing: 150 },
    features: [],
  });

  useEffect(() => {
    loadPrinters();
  }, []);

  const loadPrinters = async () => {
    const allPrintersData = await getAllPrinters();
    setAllPrinters(allPrintersData);
    const customPrintersData = await getCustomPrinters();
    setCustomPrinters(customPrintersData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newPrinter: Printer = {
      id: editingId || `custom-printer-${Date.now()}`,
      name: formData.name || '',
      brand: formData.brand || '',
      buildVolume: formData.buildVolume!,
      maxTemp: formData.maxTemp!,
      powerConsumption: formData.powerConsumption!,
      features: formData.features || [],
    };

    await saveCustomPrinter(newPrinter);
    await loadPrinters();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      brand: '',
      buildVolume: { x: 220, y: 220, z: 250 },
      maxTemp: { hotend: 300, bed: 100 },
      powerConsumption: { idle: 10, heating: 100, printing: 150 },
      features: [],
    });
    setIsAddingNew(false);
    setEditingId(null);
  };

  const handleEdit = (printer: Printer) => {
    setFormData(printer);
    setEditingId(printer.id);
    setIsAddingNew(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta impressora?')) {
      await deleteCustomPrinter(id);
      await loadPrinters();
      if (selectedPrinterId === id && onPrinterSelect) {
        onPrinterSelect(null);
      }
    }
  };

  const handleSelectPrinter = (printer: Printer | null) => {
    onPrinterSelect?.(printer);
  };

  // Modo Lista Completa (para página de configurações)
  if (showAsList) {
    return (
      <div className="space-y-4">
        {/* Formulário de Adicionar/Editar */}
        {isAddingNew ? (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-300 dark:border-blue-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-blue-900 dark:text-blue-100">
                {editingId ? 'Editar Impressora' : 'Adicionar Nova Impressora'}
              </h3>
              <button
                onClick={resetForm}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold mb-1 text-blue-900 dark:text-blue-100">
                    Nome da Impressora *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-2 py-1.5 text-sm border-2 border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
                    placeholder="Ex: Minha Impressora 3D"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold mb-1 text-blue-900 dark:text-blue-100">
                    Marca
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-2 py-1.5 text-sm border-2 border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
                    placeholder="Ex: Bambu Lab, Creality, Prusa"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold mb-1.5 text-blue-900 dark:text-blue-100">
                    Volume de Impressão (mm)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      required
                      value={formData.buildVolume?.x || ''}
                      onChange={e => setFormData({
                        ...formData,
                        buildVolume: { ...formData.buildVolume!, x: parseInt(e.target.value) || 0 }
                      })}
                      className="px-2 py-1.5 text-sm border-2 border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
                      placeholder="X"
                    />
                    <input
                      type="number"
                      required
                      value={formData.buildVolume?.y || ''}
                      onChange={e => setFormData({
                        ...formData,
                        buildVolume: { ...formData.buildVolume!, y: parseInt(e.target.value) || 0 }
                      })}
                      className="px-2 py-1.5 text-sm border-2 border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
                      placeholder="Y"
                    />
                    <input
                      type="number"
                      required
                      value={formData.buildVolume?.z || ''}
                      onChange={e => setFormData({
                        ...formData,
                        buildVolume: { ...formData.buildVolume!, z: parseInt(e.target.value) || 0 }
                      })}
                      className="px-2 py-1.5 text-sm border-2 border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
                      placeholder="Z"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-blue-900 dark:text-blue-100">
                    Consumo Ocioso (W)
                  </label>
                  <input
                    type="number"
                    value={formData.powerConsumption?.idle || ''}
                    onChange={e => setFormData({
                      ...formData,
                      powerConsumption: {
                        idle: parseInt(e.target.value) || 0,
                        heating: formData.powerConsumption?.heating || 0,
                        printing: formData.powerConsumption?.printing || 0
                      }
                    })}
                    className="w-full px-2 py-1.5 text-sm border-2 border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
                    placeholder="10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-blue-900 dark:text-blue-100">
                    Consumo Aquecendo (W)
                  </label>
                  <input
                    type="number"
                    value={formData.powerConsumption?.heating || ''}
                    onChange={e => setFormData({
                      ...formData,
                      powerConsumption: {
                        idle: formData.powerConsumption?.idle || 0,
                        heating: parseInt(e.target.value) || 0,
                        printing: formData.powerConsumption?.printing || 0
                      }
                    })}
                    className="w-full px-2 py-1.5 text-sm border-2 border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
                    placeholder="100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-blue-900 dark:text-blue-100">
                    Consumo Imprimindo (W) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.powerConsumption?.printing || ''}
                    onChange={e => setFormData({
                      ...formData,
                      powerConsumption: {
                        idle: formData.powerConsumption?.idle || 0,
                        heating: formData.powerConsumption?.heating || 0,
                        printing: parseInt(e.target.value) || 0
                      }
                    })}
                    className="w-full px-2 py-1.5 text-sm border-2 border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
                    placeholder="150"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-2 px-4 rounded-md text-sm transition-all shadow-lg"
                >
                  {editingId ? 'Atualizar Impressora' : 'Salvar Impressora'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-md font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingNew(true)}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold rounded-lg transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Adicionar Nova Impressora
          </button>
        )}

        {/* Lista de Impressoras Customizadas */}
        {customPrinters.length > 0 && (
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-3">Minhas Impressoras</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {customPrinters.map(printer => (
                <div key={printer.id} className="bg-white dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 dark:text-white">{printer.name}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {printer.brand}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(printer)}
                        className="p-1.5 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
                        title="Editar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(printer.id)}
                        className="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                        title="Excluir"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <Collapse title="Detalhes Técnicos" variant="technical">
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Volume:</span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {printer.buildVolume.x}×{printer.buildVolume.y}×{printer.buildVolume.z}mm
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Consumo:</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{printer.powerConsumption.printing}W</span>
                      </div>
                    </div>
                  </Collapse>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Modo Compacto (para seleção na calculadora)
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
        Impressora *
      </label>
      <select
        value={selectedPrinterId || ''}
        onChange={(e) => {
          const printer = allPrinters.find(p => p.id === e.target.value);
          handleSelectPrinter(printer || null);
        }}
        className="w-full px-3 py-2 border-2 border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
        required
      >
        <option value="">Selecione uma impressora...</option>
        {allPrinters.map(printer => (
          <option key={printer.id} value={printer.id}>
            {printer.name}
          </option>
        ))}
      </select>

      {selectedPrinterId && (
        <Collapse title="Detalhes da Impressora" variant="technical">
          {(() => {
            const printer = allPrinters.find(p => p.id === selectedPrinterId);
            if (!printer) return null;
            return (
              <div className="text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Marca:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{printer.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Volume:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {printer.buildVolume.x}×{printer.buildVolume.y}×{printer.buildVolume.z}mm
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Consumo:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{printer.powerConsumption.printing}W</span>
                </div>
                {printer.features && printer.features.length > 0 && (
                  <div>
                    <span className="text-slate-600 dark:text-slate-400 block mb-1">Recursos:</span>
                    <div className="flex flex-wrap gap-1">
                      {printer.features.map((feature, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </Collapse>
      )}
    </div>
  );
}
