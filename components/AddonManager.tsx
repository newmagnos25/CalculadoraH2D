'use client';

import { useState } from 'react';
import { Addon } from '@/lib/types';
import { saveCustomAddon } from '@/lib/storage';

interface AddonManagerProps {
  onSave: () => void;
}

export default function AddonManager({ onSave }: AddonManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Addon>>({
    name: '',
    category: 'other',
    pricePerUnit: 0,
    unit: 'un',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newAddon: Addon = {
      id: `custom-${Date.now()}`,
      name: formData.name || '',
      category: formData.category || 'other',
      pricePerUnit: formData.pricePerUnit || 0,
      unit: formData.unit || 'un',
    };

    saveCustomAddon(newAddon);
    onSave();
    setIsOpen(false);
    setFormData({
      name: '',
      category: 'other',
      pricePerUnit: 0,
      unit: 'un',
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold flex items-center gap-1 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Adicionar Item Customizado
      </button>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-300 dark:border-blue-800 rounded-lg p-4 mb-4 shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-blue-900 dark:text-blue-100">
          Adicionar Item Customizado
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-xs font-semibold mb-1 text-blue-900 dark:text-blue-100">
              Nome do Item
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-2 py-1.5 text-sm border-2 border-blue-200 dark:border-blue-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="Ex: Ímã neodímio 15x3mm"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1 text-blue-900 dark:text-blue-100">
              Categoria
            </label>
            <select
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value as Addon['category'] })}
              className="w-full px-2 py-1.5 text-sm border-2 border-blue-200 dark:border-blue-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="insert">Inserções</option>
              <option value="screw">Parafusos</option>
              <option value="magnet">Ímãs</option>
              <option value="elastic">Elásticos</option>
              <option value="glue">Colas</option>
              <option value="tape">Fitas</option>
              <option value="other">Outros</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-blue-900 dark:text-blue-100">
              Preço (R$)
            </label>
            <input
              type="number"
              required
              step="0.01"
              value={formData.pricePerUnit}
              onChange={e => setFormData({ ...formData, pricePerUnit: Number(e.target.value) })}
              className="w-full px-2 py-1.5 text-sm border-2 border-blue-200 dark:border-blue-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-blue-900 dark:text-blue-100">
              Unidade
            </label>
            <select
              value={formData.unit}
              onChange={e => setFormData({ ...formData, unit: e.target.value as Addon['unit'] })}
              className="w-full px-2 py-1.5 text-sm border-2 border-blue-200 dark:border-blue-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="un">unidade</option>
              <option value="g">gramas</option>
              <option value="ml">ml</option>
              <option value="m">metros</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-2 px-4 rounded-md text-sm transition-all shadow-lg shadow-blue-500/30"
          >
            Salvar Item
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-md transition-colors font-semibold"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
