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
        className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Adicionar Item Customizado
      </button>
    );
  }

  return (
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-green-900 dark:text-green-100">
          Adicionar Item Customizado
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1 text-green-900 dark:text-green-100">
              Nome do Item
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-2 py-1.5 text-sm border border-green-300 dark:border-green-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              placeholder="Ex: Ímã neodímio 15x3mm"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1 text-green-900 dark:text-green-100">
              Categoria
            </label>
            <select
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value as Addon['category'] })}
              className="w-full px-2 py-1.5 text-sm border border-green-300 dark:border-green-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
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
            <label className="block text-xs font-medium mb-1 text-green-900 dark:text-green-100">
              Preço (R$)
            </label>
            <input
              type="number"
              required
              step="0.01"
              value={formData.pricePerUnit}
              onChange={e => setFormData({ ...formData, pricePerUnit: Number(e.target.value) })}
              className="w-full px-2 py-1.5 text-sm border border-green-300 dark:border-green-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-green-900 dark:text-green-100">
              Unidade
            </label>
            <select
              value={formData.unit}
              onChange={e => setFormData({ ...formData, unit: e.target.value as Addon['unit'] })}
              className="w-full px-2 py-1.5 text-sm border border-green-300 dark:border-green-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
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
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors"
          >
            Salvar Item
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-md transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
