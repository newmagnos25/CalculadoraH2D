'use client';

import { useState, useEffect, useRef } from 'react';
import { CompanySettings as CompanySettingsType } from '@/lib/types';
import { getCompanySettings, saveCompanySettings, getDefaultCompanySettings } from '@/lib/storage';
import MaskedInput from './MaskedInput';
import { formatCNPJ, formatCEP, formatPhone } from '@/lib/input-masks';

interface CompanySettingsProps {
  onSave?: () => void;
}

export default function CompanySettings({ onSave }: CompanySettingsProps) {
  const [settings, setSettings] = useState<CompanySettingsType>(getDefaultCompanySettings());
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const existingSettings = getCompanySettings();
    if (existingSettings) {
      setSettings(existingSettings);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      saveCompanySettings(settings);
      setSaveMessage('Configurações salvas com sucesso!');
      setTimeout(() => setSaveMessage(''), 3000);
      onSave?.();
    } catch (error) {
      setSaveMessage('Erro ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validação de tamanho (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 2MB');
      return;
    }

    // Validação de tipo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSettings({ ...settings, logo: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setSettings({ ...settings, logo: undefined });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border-2 border-orange-200 dark:border-orange-900">
      <div className="bg-gradient-to-r from-black via-slate-900 to-black border-b-4 border-orange-500 rounded-t-xl p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Configurações da Empresa</h2>
            <p className="text-orange-300 text-sm">Configure os dados da sua empresa para orçamentos e contratos</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Logo */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-lg p-4">
          <label className="block text-sm font-bold mb-2 text-orange-900 dark:text-orange-100">
            Logo da Empresa
          </label>

          {settings.logo ? (
            <div className="space-y-2">
              <div className="flex items-start gap-4">
                <img
                  src={settings.logo}
                  alt="Logo"
                  className="max-w-xs max-h-32 object-contain bg-white rounded-lg border-2 border-orange-300 p-2"
                />
                <button
                  type="button"
                  onClick={removeLogo}
                  className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md transition-colors font-semibold"
                >
                  Remover Logo
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="cursor-pointer px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-md text-sm font-bold transition-all shadow-lg"
              >
                Escolher Imagem
              </label>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                PNG, JPG ou SVG (máx. 2MB)
              </span>
            </div>
          )}
        </div>

        {/* Dados da Empresa */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
              Razão Social *
            </label>
            <input
              type="text"
              required
              value={settings.name}
              onChange={e => setSettings({ ...settings, name: e.target.value })}
              className="w-full px-3 py-2 border-2 border-orange-200 dark:border-orange-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              placeholder="Nome completo da empresa"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
              Nome Fantasia
            </label>
            <input
              type="text"
              value={settings.tradeName || ''}
              onChange={e => setSettings({ ...settings, tradeName: e.target.value })}
              className="w-full px-3 py-2 border-2 border-orange-200 dark:border-orange-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              placeholder="BKreativeLab"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
              CNPJ
            </label>
            <MaskedInput
              mask="99.999.999/9999-99"
              value={settings.cnpj || ''}
              onChange={e => setSettings({ ...settings, cnpj: e.target.value })}
              className="w-full px-3 py-2 border-2 border-orange-200 dark:border-orange-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              placeholder="00.000.000/0000-00"
            />
          </div>
        </div>

        {/* Endereço */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
              Endereço *
            </label>
            <input
              type="text"
              required
              value={settings.address}
              onChange={e => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-3 py-2 border-2 border-orange-200 dark:border-orange-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              placeholder="Rua, número, complemento"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
              Cidade *
            </label>
            <input
              type="text"
              required
              value={settings.city}
              onChange={e => setSettings({ ...settings, city: e.target.value })}
              className="w-full px-3 py-2 border-2 border-orange-200 dark:border-orange-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              placeholder="São Paulo"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
                Estado *
              </label>
              <select
                required
                value={settings.state}
                onChange={e => setSettings({ ...settings, state: e.target.value })}
                className="w-full px-3 py-2 border-2 border-orange-200 dark:border-orange-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              >
                <option value="AC">AC</option>
                <option value="AL">AL</option>
                <option value="AP">AP</option>
                <option value="AM">AM</option>
                <option value="BA">BA</option>
                <option value="CE">CE</option>
                <option value="DF">DF</option>
                <option value="ES">ES</option>
                <option value="GO">GO</option>
                <option value="MA">MA</option>
                <option value="MT">MT</option>
                <option value="MS">MS</option>
                <option value="MG">MG</option>
                <option value="PA">PA</option>
                <option value="PB">PB</option>
                <option value="PR">PR</option>
                <option value="PE">PE</option>
                <option value="PI">PI</option>
                <option value="RJ">RJ</option>
                <option value="RN">RN</option>
                <option value="RS">RS</option>
                <option value="RO">RO</option>
                <option value="RR">RR</option>
                <option value="SC">SC</option>
                <option value="SP">SP</option>
                <option value="SE">SE</option>
                <option value="TO">TO</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
                CEP *
              </label>
              <MaskedInput
                mask="99999-999"
                value={settings.zipCode}
                onChange={e => setSettings({ ...settings, zipCode: e.target.value })}
                required
                className="w-full px-3 py-2 border-2 border-orange-200 dark:border-orange-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                placeholder="00000-000"
              />
            </div>
          </div>
        </div>

        {/* Contato */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
              Telefone *
            </label>
            <MaskedInput
              mask="(99) 99999-9999"
              value={settings.phone}
              onChange={e => setSettings({ ...settings, phone: e.target.value })}
              type="tel"
              required
              className="w-full px-3 py-2 border-2 border-orange-200 dark:border-orange-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              placeholder="(00) 00000-0000"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
              E-mail *
            </label>
            <input
              type="email"
              required
              value={settings.email}
              onChange={e => setSettings({ ...settings, email: e.target.value })}
              className="w-full px-3 py-2 border-2 border-orange-200 dark:border-orange-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              placeholder="contato@empresa.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
              Website
            </label>
            <input
              type="url"
              value={settings.website || ''}
              onChange={e => setSettings({ ...settings, website: e.target.value })}
              className="w-full px-3 py-2 border-2 border-orange-200 dark:border-orange-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              placeholder="www.empresa.com"
            />
          </div>
        </div>

        {/* Configurações de Orçamento */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-2 border-amber-300 dark:border-amber-800 rounded-lg p-4">
          <h3 className="font-bold text-amber-900 dark:text-amber-100 mb-3">
            Configurações de Orçamento
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-amber-900 dark:text-amber-100">
                Prefixo de Numeração
              </label>
              <input
                type="text"
                value={settings.invoicePrefix}
                onChange={e => setSettings({ ...settings, invoicePrefix: e.target.value })}
                className="w-full px-3 py-2 border-2 border-amber-200 dark:border-amber-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                placeholder="INV-2025-"
              />
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                Próximo número: {settings.invoicePrefix}{settings.invoiceCounter.toString().padStart(3, '0')}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5 text-amber-900 dark:text-amber-100">
                Contador Atual
              </label>
              <input
                type="number"
                min="1"
                value={settings.invoiceCounter}
                onChange={e => setSettings({ ...settings, invoiceCounter: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border-2 border-amber-200 dark:border-amber-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
            </div>
          </div>
        </div>

        {/* Condições de Pagamento */}
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
            Condições de Pagamento Padrão
          </label>
          <textarea
            value={settings.paymentTerms}
            onChange={e => setSettings({ ...settings, paymentTerms: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border-2 border-orange-200 dark:border-orange-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            placeholder="Ex: Pagamento à vista ou em até 3x no cartão"
          />
        </div>

        {/* Dados Bancários */}
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
            Dados Bancários
          </label>
          <textarea
            value={settings.bankDetails || ''}
            onChange={e => setSettings({ ...settings, bankDetails: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border-2 border-orange-200 dark:border-orange-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            placeholder="Banco, agência, conta, PIX..."
          />
        </div>

        {/* Observações Legais */}
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
            Observações Legais / Termos
          </label>
          <textarea
            value={settings.legalNotes || ''}
            onChange={e => setSettings({ ...settings, legalNotes: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border-2 border-orange-200 dark:border-orange-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            placeholder="Garantias, políticas de devolução, etc..."
          />
        </div>

        {/* Botões */}
        <div className="flex items-center gap-4 pt-4 border-t-2 border-orange-200 dark:border-orange-800">
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg shadow-orange-500/30"
          >
            {isSaving ? 'Salvando...' : 'Salvar Configurações'}
          </button>

          {saveMessage && (
            <div className={`px-4 py-2 rounded-lg font-semibold ${
              saveMessage.includes('sucesso')
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
            }`}>
              {saveMessage}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
