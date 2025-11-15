import Calculator from '@/components/Calculator';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      {/* Header Premium */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white shadow-2xl">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border-2 border-white/30">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                    CalculadoraH2D
                  </h1>
                  <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold border border-white/30">
                    PRO
                  </span>
                </div>
                <p className="text-blue-100 text-sm md:text-base">
                  Precificação Profissional para Impressão 3D
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-white/80 text-xs uppercase tracking-wider">Powered by</div>
                <div className="text-2xl font-black bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
                  BKreativeLab
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Features */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Múltiplas Cores</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Filamentos Customizáveis</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Adereços Personalizados</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Tarifas Regionalizadas</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Calculator />

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                CalculadoraH2D
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Sistema profissional de precificação para impressão 3D com suporte completo para impressoras Bambu Lab.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-3">Funcionalidades</h3>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <li>• Suporte para múltiplas cores</li>
                <li>• Filamentos customizáveis</li>
                <li>• Adereços e inserções</li>
                <li>• Cálculo preciso de energia</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-3">Informações</h3>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <li>• Dados de energia: 01/2025</li>
                <li>• 5 modelos Bambu Lab</li>
                <li>• 32 distribuidoras Brasil</li>
                <li>• 40+ itens de adereços</li>
              </ul>
            </div>
          </div>
          <div className="text-center pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-500">
              © 2025 <strong className="text-blue-600 dark:text-blue-400">BKreativeLab</strong> - Calculadora Profissional para Impressão 3D
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-600 mt-2">
              Desenvolvido com tecnologia Next.js e TailwindCSS
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
