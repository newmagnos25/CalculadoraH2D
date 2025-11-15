import Calculator from '@/components/Calculator';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            CalculadoraH2D
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Precificação Profissional para Impressoras Bambu Lab
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
            Calcule custos precisos incluindo filamento, energia, adereços e margem de lucro
          </p>
        </header>

        <Calculator />

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-slate-500 dark:text-slate-500">
          <p>CalculadoraH2D - Calculadora profissional para impressão 3D</p>
          <p className="mt-1">Dados de energia atualizados em 01/2025</p>
        </footer>
      </div>
    </main>
  );
}
