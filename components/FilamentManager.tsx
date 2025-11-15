'use client';

import { useState } from 'react';
import { Filament } from '@/lib/types';
import { saveCustomFilament, deleteCustomFilament } from '@/lib/storage';

interface FilamentManagerProps {
  onSave: () => void;
}

export default function FilamentManager({ onSave }: FilamentManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Filament>>({
    brand: '',
    type: '',
    pricePerKg: 0,
    density: 1.24,
    printTemp: { min: 190, max: 220 },
    bedTemp: { min: 50, max: 70 },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newFilament: Filament = {
      id: `custom-${Date.now()}`,
      brand: formData.brand || '',
      type: formData.type || '',
      pricePerKg: formData.pricePerKg || 0,
      density: formData.density || 1.24,
      printTemp: formData.printTemp || { min: 190, max: 220 },
      bedTemp: formData.bedTemp || { min: 50, max: 70 },
    };

    saveCustomFilament(newFilament);
    onSave();
    setIsOpen(false);
    setFormData({
      brand: '',
      type: '',
      pricePerKg: 0,
      density: 1.24,
      printTemp: { min: 190, max: 220 },
      bedTemp: { min: 50, max: 70 },
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-semibold flex items-center gap-1 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Adicionar Filamento Customizado
      </button>
    );
  }

  return (
    <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-2 border-orange-300 dark:border-orange-800 rounded-lg p-4 mb-4 shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-orange-900 dark:text-orange-100">
          Adicionar Filamento Customizado
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1 text-orange-900 dark:text-orange-100">
              Marca
            </label>
            <input
              type="text"
              required
              value={formData.brand}
              onChange={e => setFormData({ ...formData, brand: e.target.value })}
              className="w-full px-2 py-1.5 text-sm border-2 border-orange-200 dark:border-orange-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              placeholder="Ex: E-sun"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-orange-900 dark:text-orange-100">
              Tipo
            </label>
            <input
              type="text"
              required
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-2 py-1.5 text-sm border-2 border-orange-200 dark:border-orange-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              placeholder="Ex: PLA, PETG"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1 text-orange-900 dark:text-orange-100">
              Preço/kg (R$)
            </label>
            <input
              type="number"
              required
              step="0.01"
              value={formData.pricePerKg}
              onChange={e => setFormData({ ...formData, pricePerKg: Number(e.target.value) })}
              className="w-full px-2 py-1.5 text-sm border-2 border-orange-200 dark:border-orange-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-orange-900 dark:text-orange-100">
              Densidade (g/cm³)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.density}
              onChange={e => setFormData({ ...formData, density: Number(e.target.value) })}
              className="w-full px-2 py-1.5 text-sm border-2 border-orange-200 dark:border-orange-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-2 px-4 rounded-md text-sm transition-all shadow-lg shadow-orange-500/30"
          >
            Salvar Filamento
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-sm text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-md transition-colors font-semibold"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
