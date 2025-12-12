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

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-orange-500 rounded-xl p-6 text-center">
              <div className="text-4xl font-black bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent mb-2">
                35+
              </div>
              <div className="text-sm text-slate-400 font-semibold">Cores de Filamentos</div>
            </div>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-blue-500 rounded-xl p-6 text-center">
              <div className="text-4xl font-black bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent mb-2">
                46
              </div>
              <div className="text-sm text-slate-400 font-semibold">Filamentos Pré-Cadastrados</div>
            </div>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-purple-500 rounded-xl p-6 text-center">
              <div className="text-4xl font-black bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
                3D
              </div>
              <div className="text-sm text-slate-400 font-semibold">Visualização STL</div>
            </div>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-green-500 rounded-xl p-6 text-center">
              <div className="text-4xl font-black bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent mb-2">
                5s
              </div>
              <div className="text-sm text-slate-400 font-semibold">Cálculo Automático</div>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Veja a Plataforma em <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Ação</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Interface profissional e intuitiva desenvolvida para agilizar seu trabalho
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Screenshot 1 - Visualização 3D */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-blue-500 rounded-2xl p-8 hover:scale-[1.02] transition-all">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-4xl">🎨</span>
                </div>
                <h3 className="text-2xl font-black text-white mb-3">Visualização 3D Profissional</h3>
                <p className="text-slate-400 leading-relaxed mb-4">
                  Faça upload do STL e visualize em 3D com 35+ cores organizadas em categorias. Rotacione, dê zoom e escolha gradientes bi-color. O sistema analisa automaticamente volume, peso e dimensões.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold">Three.js</span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold">35+ Cores</span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold">Análise Auto</span>
                </div>
              </div>
              <div className="bg-slate-950 rounded-xl p-4 border border-blue-500/30">
                <div className="text-xs text-slate-500 mb-2 font-mono">Visualizador 3D com Mesa 220x220mm</div>
                <div className="aspect-video bg-gradient-to-br from-blue-950 to-slate-900 rounded-lg flex items-center justify-center border border-blue-500/20">
                  <span className="text-6xl">🖼️</span>
                </div>
              </div>
            </div>
          </div>

          {/* Screenshot 2 - Calculadora */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-orange-500 rounded-2xl p-8 hover:scale-[1.02] transition-all">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="bg-slate-950 rounded-xl p-4 border border-orange-500/30 order-2 md:order-1">
                <div className="text-xs text-slate-500 mb-2 font-mono">Interface da Calculadora</div>
                <div className="aspect-video bg-gradient-to-br from-orange-950 to-slate-900 rounded-lg flex items-center justify-center border border-orange-500/20">
                  <span className="text-6xl">🧮</span>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-4xl">⚡</span>
                </div>
                <h3 className="text-2xl font-black text-white mb-3">Cálculo Inteligente e Preciso</h3>
                <p className="text-slate-400 leading-relaxed mb-4">
                  Calcule custos de filamento, energia (por distribuidora), mão de obra, depreciação, custos fixos e margem de lucro. Tooltips informativos em cada campo para ajudar você a preencher corretamente.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-bold">Tooltips</span>
                  <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-bold">Auto-Save</span>
                  <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-bold">Multi-Color</span>
                </div>
              </div>
            </div>
          </div>

          {/* Screenshot 3 - PDFs */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-purple-500 rounded-2xl p-8 hover:scale-[1.02] transition-all">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-4xl">📄</span>
                </div>
                <h3 className="text-2xl font-black text-white mb-3">PDFs Profissionais Ilimitados</h3>
                <p className="text-slate-400 leading-relaxed mb-4">
                  Gere orçamentos em PDF com sua logo e identidade visual QUANTAS VEZES QUISER sem gastar créditos adicionais! Apenas o cálculo inicial consome 1 crédito. Contratos também disponíveis.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-bold">Logo Custom</span>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-bold">Ilimitado</span>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-bold">Contratos</span>
                </div>
              </div>
              <div className="bg-slate-950 rounded-xl p-4 border border-purple-500/30">
                <div className="text-xs text-slate-500 mb-2 font-mono">Exemplo de PDF Gerado</div>
                <div className="aspect-video bg-gradient-to-br from-purple-950 to-slate-900 rounded-lg flex items-center justify-center border border-purple-500/20">
                  <span className="text-6xl">📋</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            O que Dizem os <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Profissionais</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Makers e empresas que confiam no Precifica3D PRO
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-orange-500 rounded-2xl p-6 hover:scale-105 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-black text-lg">
                RC
              </div>
              <div>
                <div className="font-bold text-white">Rafael Costa</div>
                <div className="text-xs text-slate-400">Maker Profissional</div>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed text-sm mb-3">
              "O upload STL com análise automática economizou HORAS do meu trabalho. Não preciso mais calcular manualmente volume e peso. Simplesmente perfeito!"
            </p>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-500 text-lg">⭐</span>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-blue-500 rounded-2xl p-6 hover:scale-105 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-black text-lg">
                MS
              </div>
              <div>
                <div className="font-bold text-white">Mariana Silva</div>
                <div className="text-xs text-slate-400">3D Print Studio</div>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed text-sm mb-3">
              "A visualização 3D com 35+ cores impressiona meus clientes! Eles veem exatamente como ficará antes de aprovar. Aumento de 40% nas vendas!"
            </p>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-500 text-lg">⭐</span>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-purple-500 rounded-2xl p-6 hover:scale-105 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-black text-lg">
                PO
              </div>
              <div>
                <div className="font-bold text-white">Pedro Oliveira</div>
                <div className="text-xs text-slate-400">Impressão 3D ME</div>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed text-sm mb-3">
              "Os PDFs ilimitados mudaram meu negócio. Posso ajustar e reenviar quantas vezes precisar sem medo de gastar créditos. Sistema nota 10!"
            </p>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-500 text-lg">⭐</span>
              ))}
            </div>
          </div>
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
