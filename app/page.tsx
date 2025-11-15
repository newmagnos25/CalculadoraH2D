import Link from 'next/link';
import Calculator from '@/components/Calculator';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-orange-50/30 dark:from-black dark:via-slate-950 dark:to-slate-900">
      {/* Header Premium - Preto com Laranja/Dourado */}
      <div className="bg-gradient-to-r from-black via-slate-900 to-black border-b-4 border-orange-500 shadow-2xl">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center border-2 border-amber-300 shadow-lg shadow-orange-500/50">
                <svg className="w-10 h-10 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                    CalculadoraH2D
                  </h1>
                  <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full text-xs font-black border-2 border-amber-300 text-white shadow-lg">
                    PRO
                  </span>
                </div>
                <p className="text-orange-200 text-sm md:text-base font-medium">
                  Precificação Profissional para Impressão 3D
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/settings"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-lg text-white font-bold text-sm transition-all shadow-lg shadow-orange-500/30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Configurações
              </Link>
              <div className="text-right">
                <div className="text-orange-300 text-xs uppercase tracking-widest font-semibold">Powered by</div>
                <div className="text-2xl font-black bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent drop-shadow-md">
                  BKreativeLab
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Features - Branco com ícones Laranja/Dourado */}
      <div className="bg-white dark:bg-slate-900 border-b-2 border-orange-200 dark:border-orange-900/50 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold">
              <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Múltiplas Cores</span>
            </div>
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold">
              <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Filamentos Customizáveis</span>
            </div>
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold">
              <div className="w-6 h-6 bg-gradient-to-br from-orange-600 to-amber-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Adereços Personalizados</span>
            </div>
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold">
              <div className="w-6 h-6 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Tarifas Regionalizadas</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Calculator />

        {/* Footer Premium - Preto com Laranja/Dourado */}
        <footer className="mt-16 pt-12 pb-8 bg-gradient-to-r from-black via-slate-900 to-black border-t-4 border-orange-500 rounded-t-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">CalculadoraH2D</span>
              </h3>
              <p className="text-sm text-slate-300">
                Sistema profissional de precificação para impressão 3D com suporte completo para impressoras Bambu Lab.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-orange-400 mb-3 uppercase tracking-wider text-sm">Funcionalidades</h3>
              <ul className="text-sm text-slate-300 space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
                  Suporte para múltiplas cores
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
                  Filamentos customizáveis
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
                  Adereços e inserções
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
                  Cálculo preciso de energia
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-amber-400 mb-3 uppercase tracking-wider text-sm">Informações</h3>
              <ul className="text-sm text-slate-300 space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"></div>
                  Dados de energia: 01/2025
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"></div>
                  5 modelos Bambu Lab
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"></div>
                  32 distribuidoras Brasil
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"></div>
                  40+ itens de adereços
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-orange-900/50">
            <p className="text-sm text-slate-300 mb-2">
              © 2025 <strong className="text-transparent bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text font-black">BKreativeLab</strong> - Calculadora Profissional para Impressão 3D
            </p>
            <p className="text-xs text-orange-300/60">
              Desenvolvido com tecnologia Next.js e TailwindCSS
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
