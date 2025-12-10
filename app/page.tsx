import Link from 'next/link';
import HeaderUser from '@/components/HeaderUser';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-900">
      {/* Header */}
      <header className="border-b-4 border-orange-500 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center border-2 border-amber-300 shadow-lg shadow-orange-500/50">
                <svg className="w-7 h-7 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-black text-white">Precifica3D</h1>
                <p className="text-orange-400 text-xs font-bold">PRO</p>
              </div>
            </Link>
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
            Ferramenta profissional completa para calcular custos, gerar orçamentos e termos de consignação, gerenciar clientes, impressoras e muito mais.
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
            ✅ Sem cartão de crédito • 5 orçamentos/mês grátis • Renova automaticamente
          </p>
        </div>
      </section>

      {/* Features Section Title */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Tudo que Você Precisa em <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Uma Ferramenta</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Sistema completo de gestão para profissionais e empresas de impressão 3D
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-orange-500 rounded-2xl p-6 hover:scale-105 transition-all hover:shadow-2xl hover:shadow-orange-500/20">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center mb-4">
              <span className="text-3xl">⚡</span>
            </div>
            <h3 className="text-xl font-black text-white mb-3">Cálculo Inteligente</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Calcule custos de filamento, energia, tempo de impressão, margem de lucro e preço final em segundos com precisão profissional.
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-blue-500 rounded-2xl p-6 hover:scale-105 transition-all hover:shadow-2xl hover:shadow-blue-500/20">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
              <span className="text-3xl">📄</span>
            </div>
            <h3 className="text-xl font-black text-white mb-3">Orçamentos em PDF</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Gere orçamentos profissionais com sua logo, cores da marca, dados do cliente e valores detalhados em PDF pronto para enviar.
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-purple-500 rounded-2xl p-6 hover:scale-105 transition-all hover:shadow-2xl hover:shadow-purple-500/20">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
              <span className="text-3xl">📦</span>
            </div>
            <h3 className="text-xl font-black text-white mb-3">Termos de Consignação</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Crie termos de consignação profissionais com condições personalizadas, prazos, comissões e proteção jurídica completa.
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-green-500 rounded-2xl p-6 hover:scale-105 transition-all hover:shadow-2xl hover:shadow-green-500/20">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
              <span className="text-3xl">👥</span>
            </div>
            <h3 className="text-xl font-black text-white mb-3">Gestão de Clientes</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Cadastre clientes ilimitados com CPF/CNPJ, endereço completo, histórico de orçamentos e toda documentação em um só lugar.
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-pink-500 rounded-2xl p-6 hover:scale-105 transition-all hover:shadow-2xl hover:shadow-pink-500/20">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
              <span className="text-3xl">🖨️</span>
            </div>
            <h3 className="text-xl font-black text-white mb-3">Múltiplas Impressoras</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Gerencie várias impressoras com custos individuais de energia, tempo e materiais para precificação exata por equipamento.
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-cyan-500 rounded-2xl p-6 hover:scale-105 transition-all hover:shadow-2xl hover:shadow-cyan-500/20">
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4">
              <span className="text-3xl">🎨</span>
            </div>
            <h3 className="text-xl font-black text-white mb-3">Personalização Total</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Configure logo, cores da marca, dados da empresa, termos e condições para documentos com a identidade visual do seu negócio.
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
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center border-2 border-amber-300 shadow-lg shadow-orange-500/30">
              <svg className="w-6 h-6 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
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
