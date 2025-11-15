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
        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Adicionar Filamento Customizado
      </button>
    );
  }

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100">
          Adicionar Filamento Customizado
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1 text-blue-900 dark:text-blue-100">
              Marca
            </label>
            <input
              type="text"
              required
              value={formData.brand}
              onChange={e => setFormData({ ...formData, brand: e.target.value })}
              className="w-full px-2 py-1.5 text-sm border border-blue-300 dark:border-blue-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              placeholder="Ex: E-sun"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-blue-900 dark:text-blue-100">
              Tipo
            </label>
            <input
              type="text"
              required
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-2 py-1.5 text-sm border border-blue-300 dark:border-blue-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              placeholder="Ex: PLA, PETG"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1 text-blue-900 dark:text-blue-100">
              Preço/kg (R$)
            </label>
            <input
              type="number"
              required
              step="0.01"
              value={formData.pricePerKg}
              onChange={e => setFormData({ ...formData, pricePerKg: Number(e.target.value) })}
              className="w-full px-2 py-1.5 text-sm border border-blue-300 dark:border-blue-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-blue-900 dark:text-blue-100">
              Densidade (g/cm³)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.density}
              onChange={e => setFormData({ ...formData, density: Number(e.target.value) })}
              className="w-full px-2 py-1.5 text-sm border border-blue-300 dark:border-blue-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors"
          >
            Salvar Filamento
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-md transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
