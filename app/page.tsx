import Link from 'next/link';
import HeaderUser from '@/components/HeaderUser';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-900">
      {/* Header */}
      <header className="border-b-4 border-orange-500 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center border-2 border-amber-300 shadow-lg">
                <span className="text-white font-black text-2xl">P3D</span>
              </div>
              <div>
                <h1 className="text-xl font-black text-white">Precifica3D</h1>
                <p className="text-orange-400 text-xs font-bold">PRO</p>
              </div>
            </div>
            <HeaderUser />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Calcule Orçamentos de
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent"> Impressão 3D </span>
            em Segundos
          </h1>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
            Ferramenta profissional para calcular custos de impressão 3D, gerar orçamentos PDF e gerenciar seus clientes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/auth/signup"
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black rounded-xl text-lg transition-all shadow-2xl shadow-orange-500/50 hover:scale-105"
            >
              🚀 Começar Grátis
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 border-2 border-orange-500 text-white font-black rounded-xl text-lg transition-all"
            >
              💎 Ver Planos
            </Link>
          </div>

          <p className="text-slate-400 text-sm">
            ✅ Sem cartão de crédito • 5 orçamentos grátis • Upgrade quando quiser
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-slate-900 border-2 border-orange-500 rounded-2xl p-8 hover:scale-105 transition-all">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center mb-6">
              <span className="text-4xl">⚡</span>
            </div>
            <h3 className="text-2xl font-black text-white mb-4">Rápido e Preciso</h3>
            <p className="text-slate-400">
              Calcule custos de filamento, energia, tempo de impressão e margem de lucro instantaneamente.
            </p>
          </div>

          <div className="bg-slate-900 border-2 border-blue-500 rounded-2xl p-8 hover:scale-105 transition-all">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
              <span className="text-4xl">📄</span>
            </div>
            <h3 className="text-2xl font-black text-white mb-4">PDFs Profissionais</h3>
            <p className="text-slate-400">
              Gere orçamentos em PDF com sua marca, dados do cliente e valores detalhados.
            </p>
          </div>

          <div className="bg-slate-900 border-2 border-purple-500 rounded-2xl p-8 hover:scale-105 transition-all">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
              <span className="text-4xl">👥</span>
            </div>
            <h3 className="text-2xl font-black text-white mb-4">Gestão de Clientes</h3>
            <p className="text-slate-400">
              Salve dados dos clientes, histórico de orçamentos e acompanhe suas vendas.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-black text-white mb-6">
            Pronto para Profissionalizar seus Orçamentos?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Crie sua conta grátis e ganhe <strong>5 orçamentos</strong> para testar!
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-8 py-4 bg-white hover:bg-slate-100 text-orange-600 font-black rounded-xl text-lg transition-all shadow-2xl hover:scale-105"
          >
            🎉 Criar Conta Grátis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-slate-800 py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xl">P3D</span>
            </div>
            <span className="text-xl font-black text-white">Precifica3D PRO</span>
          </div>
          <p className="text-slate-400 text-sm">
            A ferramenta profissional para calcular orçamentos de impressão 3D
          </p>
        </div>
      </footer>
    </div>
  );
}
