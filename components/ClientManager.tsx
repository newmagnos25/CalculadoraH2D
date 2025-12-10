'use client';

import { useState, useEffect } from 'react';
import { ClientData } from '@/lib/types';
import { getClients, saveClient, deleteClient } from '@/lib/storage';
import MaskedInput from './MaskedInput';
import { getCpfCnpjMask, removeNonNumeric } from '@/lib/input-masks';

interface ClientManagerProps {
  selectedClientId?: string;
  onClientSelect?: (client: ClientData | null) => void;
  showAsList?: boolean; // Novo prop para modo lista completa
}

export default function ClientManager({ selectedClientId, onClientSelect, showAsList = false }: ClientManagerProps) {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ClientData>>({
    name: '',
    email: '',
    phone: '',
    cpfCnpj: '',
    address: '',
    city: '',
    state: 'SP',
    zipCode: '',
    notes: '',
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = () => {
    setClients(getClients());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newClient: ClientData = {
      id: editingId || `client-${Date.now()}`,
      name: formData.name || '',
      email: formData.email,
      phone: formData.phone,
      cpfCnpj: formData.cpfCnpj,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      notes: formData.notes,
      createdAt: editingId ? clients.find(c => c.id === editingId)?.createdAt || new Date().toISOString() : new Date().toISOString(),
    };

    saveClient(newClient);
    loadClients();
    resetForm();

    // Se foi uma adição nova, seleciona automaticamente o cliente
    if (!editingId && onClientSelect) {
      onClientSelect(newClient);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      cpfCnpj: '',
      address: '',
      city: '',
      state: 'SP',
      zipCode: '',
      notes: '',
    });
    setIsAddingNew(false);
    setEditingId(null);
  };

  const handleEdit = (client: ClientData) => {
    setFormData(client);
    setEditingId(client.id);
    setIsAddingNew(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      deleteClient(id);
      loadClients();
      if (selectedClientId === id && onClientSelect) {
        onClientSelect(null);
      }
    }
  };

  const handleSelectClient = (client: ClientData | null) => {
    onClientSelect?.(client);
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
                {editingId ? 'Editar Cliente' : 'Adicionar Novo Cliente'}
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
                    Nome Completo / Razão Social *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-2 py-1.5 text-sm border-2 border-blue-200 dark:border-blue-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500"
                    placeholder="Nome do cliente"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-blue-900 dark:text-blue-100">
                    CPF / CNPJ
                  </label>
                  <MaskedInput
                    mask={getCpfCnpjMask(formData.cpfCnpj || '')}
                    getMask={getCpfCnpjMask}
                    value={formData.cpfCnpj}
                    onChange={e => setFormData({ ...formData, cpfCnpj: e.target.value })}
                    className="w-full px-2 py-1.5 text-sm border-2 border-blue-200 dark:border-blue-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500"
                    placeholder="Digite CPF ou CNPJ"
                  />
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    ✓ CPF (11 dígitos) ou CNPJ (14 dígitos) - a máscara muda automaticamente
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-blue-900 dark:text-blue-100">
                    Telefone
                  </label>
                  <MaskedInput
                    mask="(99) 99999-9999"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    type="tel"
                    className="w-full px-2 py-1.5 text-sm border-2 border-blue-200 dark:border-blue-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500"
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold mb-1 text-blue-900 dark:text-blue-100">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-2 py-1.5 text-sm border-2 border-blue-200 dark:border-blue-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500"
                    placeholder="cliente@email.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold mb-1 text-blue-900 dark:text-blue-100">
                    Endereço
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-2 py-1.5 text-sm border-2 border-blue-200 dark:border-blue-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500"
                    placeholder="Rua, número, complemento"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-blue-900 dark:text-blue-100">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-2 py-1.5 text-sm border-2 border-blue-200 dark:border-blue-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500"
                    placeholder="São Paulo"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-blue-900 dark:text-blue-100">
                      Estado
                    </label>
                    <select
                      value={formData.state}
                      onChange={e => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-2 py-1.5 text-sm border-2 border-blue-200 dark:border-blue-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500"
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
                    <label className="block text-xs font-semibold mb-1 text-blue-900 dark:text-blue-100">
                      CEP
                    </label>
                    <MaskedInput
                      mask="99999-999"
                      value={formData.zipCode}
                      onChange={e => setFormData({ ...formData, zipCode: e.target.value })}
                      className="w-full px-2 py-1.5 text-sm border-2 border-blue-200 dark:border-blue-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500"
                      placeholder="00000-000"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold mb-1 text-blue-900 dark:text-blue-100">
                    Observações
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    rows={2}
                    className="w-full px-2 py-1.5 text-sm border-2 border-blue-200 dark:border-blue-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500"
                    placeholder="Notas adicionais sobre o cliente..."
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-2 px-4 rounded-md text-sm transition-all shadow-lg"
                >
                  {editingId ? 'Atualizar Cliente' : 'Salvar Cliente'}
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
            Adicionar Novo Cliente
          </button>
        )}

        {/* Lista de Clientes em Cards */}
        {clients.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Clientes Cadastrados ({clients.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {clients.map(client => (
                <div
                  key={client.id}
                  className="bg-white dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-4 hover:border-blue-400 dark:hover:border-blue-600 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 dark:text-white">{client.name}</h4>
                      {client.cpfCnpj && (
                        <p className="text-xs text-slate-600 dark:text-slate-400">CPF/CNPJ: {client.cpfCnpj}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(client)}
                        className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="Editar cliente"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Excluir cliente"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm">
                    {client.email && (
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {client.email}
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {client.phone}
                      </div>
                    )}
                    {client.address && (
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {client.address}, {client.city} - {client.state}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Modo Compacto (para seleção no PDFActions)
  if (!isAddingNew) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-lg border-2 border-blue-200 dark:border-blue-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-900 dark:text-white">Dados do Cliente</h3>
          <button
            onClick={() => setIsAddingNew(true)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {clients.length === 0 ? 'Adicionar Cliente' : 'Novo Cliente'}
          </button>
        </div>

        {clients.length > 0 ? (
          <div className="space-y-2">
            <select
              value={selectedClientId || ''}
              onChange={(e) => {
                const client = clients.find(c => c.id === e.target.value);
                handleSelectClient(client || null as any);
              }}
              className="w-full px-3 py-2 border-2 border-blue-200 dark:border-blue-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500"
            >
              <option value="">Selecione um cliente...</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name} {client.cpfCnpj ? `- ${client.cpfCnpj}` : ''}
                </option>
              ))}
            </select>

            {selectedClientId && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3 text-sm">
                {(() => {
                  const client = clients.find(c => c.id === selectedClientId);
                  if (!client) return null;
                  return (
                    <div className="space-y-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-blue-900 dark:text-blue-100">{client.name}</p>
                          {client.cpfCnpj && <p className="text-blue-700 dark:text-blue-300 text-xs">CPF/CNPJ: {client.cpfCnpj}</p>}
                          {client.email && <p className="text-blue-700 dark:text-blue-300 text-xs">Email: {client.email}</p>}
                          {client.phone && <p className="text-blue-700 dark:text-blue-300 text-xs">Telefone: {client.phone}</p>}
                        </div>
                        <div className="flex gap-1 ml-2">
                          <button
                            onClick={() => handleEdit(client)}
                            className="p-1.5 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
                            title="Editar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(client.id)}
                            className="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                            title="Excluir"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
            Nenhum cliente cadastrado. Clique em "Adicionar Cliente" para começar.
          </p>
        )}
      </div>
    );
  }

  // Formulário (modo compacto)
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-300 dark:border-blue-800 rounded-lg p-4 mb-4 shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-blue-900 dark:text-blue-100">
          {editingId ? 'Editar Cliente' : 'Adicionar Novo Cliente'}
        </h3>
        <button
          onClick={resetForm}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
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
              Nome Completo / Razão Social *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-2 py-1.5 text-sm border-2 border-blue-200 dark:border-blue-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500"
              placeholder="Nome do cliente"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-blue-900 dark:text-blue-100">
              CPF / CNPJ
            </label>
            <MaskedInput
              mask={getCpfCnpjMask(formData.cpfCnpj || '')}
              getMask={getCpfCnpjMask}
              value={formData.cpfCnpj}
              onChange={e => setFormData({ ...formData, cpfCnpj: e.target.value })}
              className="w-full px-2 py-1.5 text-sm border-2 border-blue-200 dark:border-blue-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500"
              placeholder="Digite CPF ou CNPJ"
            />
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              ✓ CPF (11 dígitos) ou CNPJ (14 dígitos) - a máscara muda automaticamente
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-blue-900 dark:text-blue-100">
              Telefone
            </label>
            <MaskedInput
              mask="(99) 99999-9999"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              type="tel"
              className="w-full px-2 py-1.5 text-sm border-2 border-blue-200 dark:border-blue-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500"
              placeholder="(00) 00000-0000"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold mb-1 text-blue-900 dark:text-blue-100">
              E-mail
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-2 py-1.5 text-sm border-2 border-blue-200 dark:border-blue-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500"
              placeholder="cliente@email.com"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold mb-1 text-blue-900 dark:text-blue-100">
              Endereço
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-2 py-1.5 text-sm border-2 border-blue-200 dark:border-blue-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500"
              placeholder="Rua, número, complemento"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-blue-900 dark:text-blue-100">
              Cidade
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={e => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-2 py-1.5 text-sm border-2 border-blue-200 dark:border-blue-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500"
              placeholder="São Paulo"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold mb-1 text-blue-900 dark:text-blue-100">
                Estado
              </label>
              <select
                value={formData.state}
                onChange={e => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-2 py-1.5 text-sm border-2 border-blue-200 dark:border-blue-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500"
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
              <label className="block text-xs font-semibold mb-1 text-blue-900 dark:text-blue-100">
                CEP
              </label>
              <MaskedInput
                mask="99999-999"
                value={formData.zipCode}
                onChange={e => setFormData({ ...formData, zipCode: e.target.value })}
                className="w-full px-2 py-1.5 text-sm border-2 border-blue-200 dark:border-blue-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500"
                placeholder="00000-000"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold mb-1 text-blue-900 dark:text-blue-100">
              Observações
            </label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              className="w-full px-2 py-1.5 text-sm border-2 border-blue-200 dark:border-blue-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500"
              placeholder="Notas adicionais sobre o cliente..."
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-2 px-4 rounded-md text-sm transition-all shadow-lg"
          >
            {editingId ? 'Atualizar Cliente' : 'Salvar Cliente'}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-md transition-colors font-semibold"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
