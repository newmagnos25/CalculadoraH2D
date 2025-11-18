'use client';

import { useState, useEffect } from 'react';
import { ProductTemplate, getTemplates, deleteTemplate, saveTemplate } from '@/lib/templates';
import toast from 'react-hot-toast';

interface TemplatesManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadTemplate: (template: ProductTemplate) => void;
  currentCalculation?: {
    printerId: string;
    filamentUsages: Array<{ filamentId: string; weight: number }>;
    printTime: { hours: number; minutes: number };
    selectedAddons: Array<{ id: string; quantity: number }>;
    itemDescription: string;
    dimensions: { length: number; width: number; height: number };
  };
}

export default function TemplatesManager({
  isOpen,
  onClose,
  onLoadTemplate,
  currentCalculation,
}: TemplatesManagerProps) {
  const [templates, setTemplates] = useState<ProductTemplate[]>([]);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  const loadTemplates = () => {
    setTemplates(getTemplates());
  };

  const handleSaveTemplate = () => {
    if (!currentCalculation) {
      toast.error('Preencha os dados da calculadora primeiro!');
      return;
    }

    if (!templateName.trim()) {
      toast.error('Digite um nome para o template!');
      return;
    }

    try {
      saveTemplate({
        name: templateName.trim(),
        description: templateDescription.trim(),
        ...currentCalculation,
      });

      toast.success(`Template "${templateName}" salvo com sucesso!`);
      setTemplateName('');
      setTemplateDescription('');
      setShowSaveForm(false);
      loadTemplates();
    } catch (error) {
      toast.error('Erro ao salvar template');
      console.error(error);
    }
  };

  const handleDeleteTemplate = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir o template "${name}"?`)) {
      if (deleteTemplate(id)) {
        toast.success('Template excluído!');
        loadTemplates();
      } else {
        toast.error('Erro ao excluir template');
      }
    }
  };

  const handleLoadTemplate = (template: ProductTemplate) => {
    onLoadTemplate(template);
    toast.success(`Template "${template.name}" carregado!`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border-2 border-orange-500">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📋</span>
              <h2 className="text-2xl font-black text-white">
                Templates de Produtos
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Save New Template Section */}
            <div className="mb-6 pb-6 border-b-2 border-slate-200 dark:border-slate-800">
              {!showSaveForm ? (
                <button
                  onClick={() => setShowSaveForm(true)}
                  disabled={!currentCalculation}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-slate-300 disabled:to-slate-400 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg disabled:cursor-not-allowed"
                >
                  ➕ Salvar Cálculo Atual como Template
                </button>
              ) : (
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 space-y-3">
                  <h3 className="font-bold text-slate-900 dark:text-white">Novo Template</h3>
                  <input
                    type="text"
                    placeholder="Nome do template (ex: Dragão 15cm - PLA Vermelho)"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    autoFocus
                  />
                  <input
                    type="text"
                    placeholder="Descrição (opcional)"
                    value={templateDescription}
                    onChange={(e) => setTemplateDescription(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveTemplate}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => {
                        setShowSaveForm(false);
                        setTemplateName('');
                        setTemplateDescription('');
                      }}
                      className="flex-1 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-bold py-2 px-4 rounded-lg transition-all"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Templates List */}
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span>Templates Salvos</span>
                <span className="text-sm bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full">
                  {templates.length}
                </span>
              </h3>

              {templates.length === 0 ? (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                  <span className="text-6xl block mb-4">📦</span>
                  <p className="text-lg font-semibold mb-2">Nenhum template salvo ainda</p>
                  <p className="text-sm">Salve seus produtos mais usados para agilizar os orçamentos!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border-2 border-slate-200 dark:border-slate-700 hover:border-orange-500 dark:hover:border-orange-500 transition-all"
                    >
                      {/* Template Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                            {template.name}
                          </h4>
                          {template.description && (
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {template.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Template Info */}
                      <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400 mb-3">
                        <div className="flex items-center gap-2">
                          <span>🎨</span>
                          <span>{template.filamentUsages.length} filamento(s)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>⏱️</span>
                          <span>{template.printTime.hours}h {template.printTime.minutes}min</span>
                        </div>
                        {template.selectedAddons.length > 0 && (
                          <div className="flex items-center gap-2">
                            <span>🔧</span>
                            <span>{template.selectedAddons.length} adereço(s)</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleLoadTemplate(template)}
                          className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm"
                        >
                          Usar Template
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(template.id, template.name)}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-lg transition-all"
                          title="Excluir template"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-100 dark:bg-slate-800 border-t-2 border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
              💡 <strong>Dica:</strong> Templates salvam todos os dados do produto, tornando os próximos orçamentos 10x mais rápidos!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
