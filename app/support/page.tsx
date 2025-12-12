'use client';

import { useState } from 'react';
import Link from 'next/link';
import HeaderUser from '@/components/HeaderUser';

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'geral',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Em produção, enviaria para API/email
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <HeaderUser />

      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            📞 Suporte e Contato
          </h1>
          <p className="text-xl text-green-100">
            Estamos aqui para ajudar você!
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 text-center">
            <div className="text-5xl mb-4">📧</div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Email</h3>
            <a href="mailto:suporte@precifica3d.com" className="text-blue-600 dark:text-blue-400 font-semibold">
              suporte@precifica3d.com
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Resposta em até 24-48h (dias úteis)
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 text-center">
            <div className="text-5xl mb-4">⏰</div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Horário</h3>
            <p className="text-slate-700 dark:text-slate-300 font-semibold">
              Seg-Sex: 9h às 18h
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Horário de Brasília (GMT-3)
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 text-center">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Planos Pagos</h3>
            <p className="text-slate-700 dark:text-slate-300 font-semibold">
              Suporte Prioritário
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Resposta em até 12h
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">
              Envie sua Mensagem
            </h2>
            
            {submitted && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-800 rounded-lg">
                <p className="text-green-700 dark:text-green-400 font-semibold">
                  ✅ Mensagem enviada! Responderemos em breve.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Assunto
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="geral">Dúvida Geral</option>
                  <option value="tecnico">Problema Técnico</option>
                  <option value="pagamento">Pagamento / Assinatura</option>
                  <option value="sugestao">Sugestão de Melhoria</option>
                  <option value="bug">Reportar Bug</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Mensagem
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none resize-none"
                  placeholder="Descreva sua dúvida ou problema..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg text-lg"
              >
                📧 Enviar Mensagem
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">
              Antes de Entrar em Contato
            </h2>

            <div className="space-y-4">
              <Link href="/faq" className="block bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 hover:scale-105 transition-all">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">❓</div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                      Consulte o FAQ
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      42 perguntas frequentes já respondidas. Pode ser mais rápido!
                    </p>
                  </div>
                </div>
              </Link>

              <Link href="/help" className="block bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 hover:scale-105 transition-all">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">📚</div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                      Central de Ajuda
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Guias completos e tutoriais passo a passo
                    </p>
                  </div>
                </div>
              </Link>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-400 mb-3">
                  💡 Dicas para Contato Eficiente:
                </h3>
                <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Seja específico sobre o problema</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Inclua prints de tela se possível</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Informe qual plano você usa</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Descreva passos para reproduzir bugs</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Verifique console do navegador (F12)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
