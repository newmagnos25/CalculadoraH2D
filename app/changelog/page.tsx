'use client';

import Link from 'next/link';
import HeaderUser from '@/components/HeaderUser';

const CHANGELOG = [
  {
    version: '2.0.0',
    date: 'Dezembro 2024',
    title: '🎉 Upload STL e Seletor de Cores',
    description: 'Maior atualização! Upload de STL com análise automática completa e visualização 3D em 10 cores.',
    changes: [
      '✨ Upload de arquivos STL com análise automática',
      '🎨 Seletor de 10 cores para visualização 3D',
      '🖼️ Visualizador Three.js com rotação e zoom',
      '📏 Mesa 220x220mm com grid profissional',
      '⚡ Auto-preenchimento após análise',
      '🔧 Tutorial atualizado (14 passos)'
    ]
  },
  {
    version: '1.9.0',
    date: 'Dezembro 2024',
    title: '📚 Documentação Completa',
    description: 'Central de Ajuda, FAQ com 42 perguntas, Suporte e Changelog.',
    changes: [
      '📚 Central de Ajuda com 8 seções',
      '❓ FAQ com 42 perguntas',
      '📞 Página de Suporte',
      '🎉 Changelog completo',
      '🔍 Busca em tempo real'
    ]
  },
  {
    version: '1.8.0',
    date: 'Novembro 2024',
    title: '📊 Dashboard de Histórico',
    description: 'Histórico completo para planos Professional+.',
    changes: [
      '📊 Dashboard com histórico',
      '🔄 Re-download de PDFs',
      '📋 Filtros por tipo',
      '📈 Cards estatísticos'
    ]
  },
  {
    version: '1.7.0',
    date: 'Novembro 2024',
    title: '🎨 46 Filamentos',
    description: 'Biblioteca expandida com Bambu Lab, Overture, Sunlu, Creality.',
    changes: [
      '🧵 46 filamentos (era 17)',
      '🏷️ 4 marcas novas',
      '💎 Materiais com fibra de carbono',
      '💰 Preços R$ 80-280/kg'
    ]
  }
];

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <HeaderUser />

      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            🎉 O Que Há de Novo
          </h1>
          <p className="text-xl text-purple-100">
            Acompanhe todas as novidades e melhorias da plataforma
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="space-y-8">
          {CHANGELOG.map((entry, index) => (
            <div key={index} className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-bold">
                  v{entry.version}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {entry.date}
                </span>
              </div>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
                {entry.title}
              </h2>

              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {entry.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {entry.changes.map((change, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                    <span className="text-slate-700 dark:text-slate-300 text-sm">{change}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-xl p-8 text-white text-center">
          <h3 className="text-2xl font-black mb-3">
            🔔 Próximas Atualizações
          </h3>
          <p className="text-lg mb-6">
            Import de .gcode, Analytics Avançado, Templates Salvos, IA para Precificação
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/settings" className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl">
              ⚙️ Configurações
            </Link>
            <Link href="/help" className="px-8 py-4 bg-white/20 font-bold rounded-xl">
              📚 Documentação
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
