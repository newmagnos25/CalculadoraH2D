'use client';

import { useState } from 'react';
import { Printer } from '@/lib/types';
import { saveCustomPrinter } from '@/lib/storage';

interface PrinterManagerProps {
  onSave: () => void;
}

export default function PrinterManager({ onSave }: PrinterManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Printer>>({
    name: '',
    brand: 'Outros',
    buildVolume: { x: 220, y: 220, z: 250 },
    powerConsumption: { idle: 10, heating: 200, printing: 100 },
    maxTemp: { hotend: 260, bed: 100 },
    features: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newPrinter: Printer = {
      id: `custom-${Date.now()}`,
      name: formData.name || '',
      brand: formData.brand || 'Outros',
      buildVolume: formData.buildVolume || { x: 220, y: 220, z: 250 },
      powerConsumption: formData.powerConsumption || { idle: 10, heating: 200, printing: 100 },
      maxTemp: formData.maxTemp || { hotend: 260, bed: 100 },
      features: formData.features || [],
    };

    saveCustomPrinter(newPrinter);
    onSave();
    setIsOpen(false);
    setFormData({
      name: '',
      brand: 'Outros',
      buildVolume: { x: 220, y: 220, z: 250 },
      powerConsumption: { idle: 10, heating: 200, printing: 100 },
      maxTemp: { hotend: 260, bed: 100 },
      features: [],
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold flex items-center gap-1 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Adicionar Impressora Customizada
      </button>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-2 border-purple-300 dark:border-purple-800 rounded-lg p-4 mb-4 shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-purple-900 dark:text-purple-100">
          Adicionar Impressora Customizada
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1 text-purple-900 dark:text-purple-100">
              Marca
            </label>
            <input
              type="text"
              required
              value={formData.brand}
              onChange={e => setFormData({ ...formData, brand: e.target.value })}
              className="w-full px-2 py-1.5 text-sm border-2 border-purple-200 dark:border-purple-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              placeholder="Ex: Kobra, Creality, Anycubic"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-purple-900 dark:text-purple-100">
              Modelo
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-2 py-1.5 text-sm border-2 border-purple-200 dark:border-purple-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              placeholder="Ex: Kobra 2 Pro"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1 text-purple-900 dark:text-purple-100">
            Volume de Impressão (mm)
          </label>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              required
              value={formData.buildVolume?.x}
              onChange={e => setFormData({
                ...formData,
                buildVolume: { ...formData.buildVolume!, x: Number(e.target.value) }
              })}
              className="w-full px-2 py-1.5 text-sm border-2 border-purple-200 dark:border-purple-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-purple-500"
              placeholder="X (220)"
            />
            <input
              type="number"
              required
              value={formData.buildVolume?.y}
              onChange={e => setFormData({
                ...formData,
                buildVolume: { ...formData.buildVolume!, y: Number(e.target.value) }
              })}
              className="w-full px-2 py-1.5 text-sm border-2 border-purple-200 dark:border-purple-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-purple-500"
              placeholder="Y (220)"
            />
            <input
              type="number"
              required
              value={formData.buildVolume?.z}
              onChange={e => setFormData({
                ...formData,
                buildVolume: { ...formData.buildVolume!, z: Number(e.target.value) }
              })}
              className="w-full px-2 py-1.5 text-sm border-2 border-purple-200 dark:border-purple-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-purple-500"
              placeholder="Z (250)"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1 text-purple-900 dark:text-purple-100">
            Consumo de Energia (Watts)
          </label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <input
                type="number"
                required
                value={formData.powerConsumption?.idle}
                onChange={e => setFormData({
                  ...formData,
                  powerConsumption: { ...formData.powerConsumption!, idle: Number(e.target.value) }
                })}
                className="w-full px-2 py-1.5 text-sm border-2 border-purple-200 dark:border-purple-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-purple-500"
                placeholder="10"
              />
              <p className="text-xs text-purple-700 dark:text-purple-300 mt-0.5">Standby</p>
            </div>
            <div>
              <input
                type="number"
                required
                value={formData.powerConsumption?.heating}
                onChange={e => setFormData({
                  ...formData,
                  powerConsumption: { ...formData.powerConsumption!, heating: Number(e.target.value) }
                })}
                className="w-full px-2 py-1.5 text-sm border-2 border-purple-200 dark:border-purple-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-purple-500"
                placeholder="200"
              />
              <p className="text-xs text-purple-700 dark:text-purple-300 mt-0.5">Aquec.</p>
            </div>
            <div>
              <input
                type="number"
                required
                value={formData.powerConsumption?.printing}
                onChange={e => setFormData({
                  ...formData,
                  powerConsumption: { ...formData.powerConsumption!, printing: Number(e.target.value) }
                })}
                className="w-full px-2 py-1.5 text-sm border-2 border-purple-200 dark:border-purple-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-purple-500"
                placeholder="100"
              />
              <p className="text-xs text-purple-700 dark:text-purple-300 mt-0.5">Imprim.</p>
            </div>
          </div>
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
            💡 Dica: Se não souber, use valores padrão: Standby 10W, Aquecimento 200W, Impressão 100W
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1 text-purple-900 dark:text-purple-100">
            Temperaturas Máximas (°C)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <input
                type="number"
                required
                value={formData.maxTemp?.hotend}
                onChange={e => setFormData({
                  ...formData,
                  maxTemp: { ...formData.maxTemp!, hotend: Number(e.target.value) }
                })}
                className="w-full px-2 py-1.5 text-sm border-2 border-purple-200 dark:border-purple-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-purple-500"
                placeholder="260"
              />
              <p className="text-xs text-purple-700 dark:text-purple-300 mt-0.5">Hotend</p>
            </div>
            <div>
              <input
                type="number"
                required
                value={formData.maxTemp?.bed}
                onChange={e => setFormData({
                  ...formData,
                  maxTemp: { ...formData.maxTemp!, bed: Number(e.target.value) }
                })}
                className="w-full px-2 py-1.5 text-sm border-2 border-purple-200 dark:border-purple-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-purple-500"
                placeholder="100"
              />
              <p className="text-xs text-purple-700 dark:text-purple-300 mt-0.5">Mesa</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-2 px-4 rounded-md text-sm transition-all shadow-lg shadow-purple-500/30"
          >
            Salvar Impressora
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-md transition-colors font-semibold"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
