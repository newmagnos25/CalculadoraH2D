'use client';

import { useState } from 'react';
import Link from 'next/link';
import HeaderUser from '@/components/HeaderUser';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FAQItem[] = [
  // Categoria: Conta e Cadastro
  {
    category: 'Conta e Cadastro',
    question: 'Como criar uma conta gratuita?',
    answer: 'Acesse /auth/signup, preencha nome, email e senha. Confirme seu email e pronto! Você ganha 5 orçamentos grátis por mês no plano FREE.'
  },
  {
    category: 'Conta e Cadastro',
    question: 'Preciso de cartão de crédito para testar?',
    answer: 'NÃO! O plano FREE é 100% gratuito, sem precisar cadastrar cartão. Você pode usar para sempre com 5 orçamentos/mês.'
  },
  {
    category: 'Conta e Cadastro',
    question: 'Como recuperar senha esquecida?',
    answer: 'Na tela de login, clique em "Esqueceu a senha?", digite seu email e receba link de reset. O link é válido por 1 hora.'
  },
  {
    category: 'Conta e Cadastro',
    question: 'Não recebi email de confirmação. O que fazer?',
    answer: 'Verifique pasta de SPAM. Na tela de login, clique em "Reenviar confirmação". Aguarde 60 segundos entre envios. Se não chegar, contate suporte@precifica3d.com.'
  },
  {
    category: 'Conta e Cadastro',
    question: 'Posso ter múltiplas contas?',
    answer: 'Cada email pode ter apenas uma conta. Para múltiplas empresas, use o plano Enterprise (até 3 empresas) ou Lifetime (ilimitadas).'
  },

  // Categoria: Planos e Preços
  {
    category: 'Planos e Preços',
    question: 'Qual a diferença entre FREE e os planos pagos?',
    answer: 'FREE: 5 orçamentos/mês, sem clientes salvos, sem histórico. Starter: 50 orçamentos, 20 clientes, sem histórico. Professional: tudo ilimitado + histórico + analytics. Veja tabela completa em /pricing.'
  },
  {
    category: 'Planos e Preços',
    question: 'Quanto custa cada plano?',
    answer: 'FREE: R$ 0. Teste 7 dias do Professional por R$ 2,99. Depois: Starter, Professional, Enterprise e Lifetime. Valores exatos em /pricing. Planos anuais economizam 17%.'
  },
  {
    category: 'Planos e Preços',
    question: 'O que são "créditos" e como funcionam?',
    answer: '1 crédito = 1 cálculo de orçamento. Gerar PDF NÃO gasta crédito extra. Contrato opcional gasta +1 crédito. FREE: 5/mês. Starter: 50/mês. Professional+: ilimitados.'
  },
  {
    category: 'Planos e Preços',
    question: 'Créditos acumulam de um mês para outro?',
    answer: 'NÃO. Créditos renovam todo dia 1 do mês e não acumulam. Use ou perca. Planos Professional+ têm créditos ilimitados sempre.'
  },
  {
    category: 'Planos e Preços',
    question: 'Posso cancelar a qualquer momento?',
    answer: 'SIM! Sem fidelidade. Cancele em Configurações > Minha Conta. Assinatura continua até fim do período pago, depois volta para FREE automaticamente.'
  },
  {
    category: 'Planos e Preços',
    question: 'Como fazer upgrade ou downgrade de plano?',
    answer: 'Clique no seu avatar > "Ver Planos". Escolha novo plano e confirme. Upgrade é instantâneo. Downgrade vale a partir do próximo ciclo.'
  },
  {
    category: 'Planos e Preços',
    question: 'Tem garantia de reembolso?',
    answer: 'SIM! 30 dias de garantia. Se não gostar, solicite reembolso total em até 30 dias da compra. Contate suporte@precifica3d.com.'
  },
  {
    category: 'Planos e Preços',
    question: 'Qual a diferença entre Professional e Enterprise?',
    answer: 'Professional: tudo ilimitado, 1 empresa, histórico completo. Enterprise: até 3 empresas, white-label, até 5 usuários, API, suporte dedicado.'
  },

  // Categoria: Upload STL
  {
    category: 'Upload STL',
    question: 'Quais formatos de arquivo são aceitos?',
    answer: 'Apenas STL (ASCII ou binário). Tamanho máximo: 50MB. Outros formatos (.obj, .3mf, .gcode) virão em futuras atualizações.'
  },
  {
    category: 'Upload STL',
    question: 'O que é analisado automaticamente no STL?',
    answer: 'Volume (cm³), peso estimado (g), tempo de impressão (min), dimensões X/Y/Z (mm), número de triângulos. Baseado em PLA 1.24g/cm³ com 20% infill.'
  },
  {
    category: 'Upload STL',
    question: 'Posso mudar a cor do modelo 3D?',
    answer: 'SIM! Após upload, escolha entre 10 cores: Laranja, Vermelho, Azul, Verde, Amarelo, Roxo, Preto, Branco, Cinza, Rosa. Troca instantânea!'
  },
  {
    category: 'Upload STL',
    question: 'Como rotacionar e dar zoom no modelo 3D?',
    answer: 'Arraste com mouse para rotacionar. Scroll do mouse para zoom in/out. Modelo fica alinhado na mesa de impressão 220x220mm.'
  },
  {
    category: 'Upload STL',
    question: 'Valores do STL estão incorretos. O que fazer?',
    answer: 'Verifique unidades do modelo (deve estar em mm). Ajuste manualmente os campos se necessário. Valores são estimativas - use slicer como referência final.'
  },
  {
    category: 'Upload STL',
    question: 'Upload STL é obrigatório?',
    answer: 'NÃO! É opcional mas MUITO recomendado. Economiza tempo preenchendo tudo automaticamente. Você pode calcular manualmente também.'
  },

  // Categoria: Calculadora
  {
    category: 'Calculadora',
    question: 'Como calcular preço de uma impressão?',
    answer: 'Escolha impressora → Upload STL (ou preencha manual) → Adicione filamentos → Tempo → Energia → Custos opcionais → Margem lucro → Calcular. Veja /help para guia detalhado.'
  },
  {
    category: 'Calculadora',
    question: 'Posso adicionar múltiplos filamentos (multi-cor)?',
    answer: 'SIM! Clique em "+ Adicionar Filamento" quantas vezes precisar. Útil para multi-cor ou multi-material (PLA+TPU). Sistema soma todos os custos.'
  },
  {
    category: 'Calculadora',
    question: 'Como funciona cálculo de energia elétrica?',
    answer: 'Usamos tarifas REAIS de 32 distribuidoras brasileiras. Selecione estado + distribuidora. Custo = Consumo da impressora (W) × Tempo × Tarifa (R$/kWh).'
  },
  {
    category: 'Calculadora',
    question: 'O que são "custos opcionais"?',
    answer: 'Mão de obra (R$/hora), depreciação da impressora, custos fixos (aluguel, luz), margem de lucro (%). Tornam orçamento mais realista e lucrativo.'
  },
  {
    category: 'Calculadora',
    question: 'Posso salvar configurações como template?',
    answer: 'Valores de custos são salvos automaticamente. Templates de produtos específicos (chaveiros, miniaturas) estão em desenvolvimento. Sugira melhorias!'
  },

  // Categoria: PDFs e Documentos
  {
    category: 'PDFs e Documentos',
    question: 'Gerar PDF gasta crédito adicional?',
    answer: 'NÃO! Depois de calcular (1 crédito), gere PDF quantas vezes quiser SEM custo. Pode ajustar e regenerar ilimitadamente.'
  },
  {
    category: 'PDFs e Documentos',
    question: 'Como personalizar PDFs com meu logo?',
    answer: 'Configurações > Dados da Empresa > Upload logo (PNG/JPG, max 2MB) + escolha cores da marca. Logo aparece em todos os PDFs!'
  },
  {
    category: 'PDFs e Documentos',
    question: 'Diferença entre orçamento e contrato?',
    answer: 'Orçamento: proposta de preço (FREE após calcular). Contrato: formalização com termos legais (+1 crédito). Contrato é opcional.'
  },
  {
    category: 'PDFs e Documentos',
    question: 'O que é termo de consignação?',
    answer: 'Contrato onde cliente vende seus produtos e te paga depois. Configure prazo, comissão, itens. Acesse menu Consignação. Ideal para lojas parceiras.'
  },
  {
    category: 'PDFs e Documentos',
    question: 'Posso baixar PDF novamente depois?',
    answer: 'SIM! No Dashboard, clique em "Baixar PDF" quantas vezes quiser. NÃO gasta crédito. Disponível em planos Professional+ com histórico.'
  },

  // Categoria: Clientes
  {
    category: 'Clientes',
    question: 'Como salvar dados de clientes?',
    answer: 'Configurações > Gerenciar Clientes > + Adicionar Cliente. Preencha nome, CPF/CNPJ, email, telefone, endereço. Disponível em planos Starter+.'
  },
  {
    category: 'Clientes',
    question: 'Quantos clientes posso cadastrar?',
    answer: 'FREE: 0 clientes. Starter: até 20. Professional+: ILIMITADOS. Dados são criptografados e seguros (LGPD).'
  },
  {
    category: 'Clientes',
    question: 'Como usar cliente salvo em orçamento?',
    answer: 'Na calculadora, seção "Dados do Cliente", selecione da dropdown. Todos os dados preenchem automaticamente. Economia de tempo enorme!'
  },

  // Categoria: Dashboard e Histórico
  {
    category: 'Dashboard e Histórico',
    question: 'Como acessar histórico de orçamentos?',
    answer: 'Clique em "📊 Meus Orçamentos" no menu. Veja todos os documentos: data, cliente, preço, detalhes. Disponível apenas em Professional+.'
  },
  {
    category: 'Dashboard e Histórico',
    question: 'Plano FREE tem histórico?',
    answer: 'NÃO. FREE e Starter NÃO salvam histórico. Só Professional, Enterprise e Lifetime. Histórico = re-baixar PDFs, analytics, busca.'
  },
  {
    category: 'Dashboard e Histórico',
    question: 'Posso exportar dados para Excel?',
    answer: 'Funcionalidade de exportação CSV/Excel está em desenvolvimento! Você poderá exportar todos os orçamentos em breve. Aguarde atualizações!'
  },

  // Categoria: Segurança e Privacidade
  {
    category: 'Segurança e Privacidade',
    question: 'Meus dados estão seguros?',
    answer: 'SIM! Usamos criptografia SSL/TLS, senhas com hash bcrypt, banco de dados protegido. Conforme LGPD. Leia /privacy para detalhes.'
  },
  {
    category: 'Segurança e Privacidade',
    question: 'Vocês compartilham meus dados?',
    answer: 'NUNCA! Seus dados (clientes, orçamentos, empresa) são 100% privados e não são compartilhados com terceiros. Leia /privacy.'
  },
  {
    category: 'Segurança e Privacidade',
    question: 'Como excluir minha conta permanentemente?',
    answer: 'Contate suporte@precifica3d.com solicitando exclusão completa. Deletamos TODOS os dados em até 30 dias, conforme LGPD. Irreversível!'
  },

  // Categoria: Suporte e Problemas
  {
    category: 'Suporte e Problemas',
    question: 'Como entrar em contato com suporte?',
    answer: 'Email: suporte@precifica3d.com. Acesse /support para formulário de contato. Tempo médio de resposta: 24-48h (dias úteis). Planos pagos: suporte prioritário.'
  },
  {
    category: 'Suporte e Problemas',
    question: 'Encontrei um bug. Como reportar?',
    answer: 'Email suporte@precifica3d.com com: descrição do problema, print da tela, console do navegador (F12), plano que usa. Agradecemos reports!'
  },
  {
    category: 'Suporte e Problemas',
    question: 'Posso sugerir melhorias ou novos recursos?',
    answer: 'SIM! Adoramos feedback! Email suporte@precifica3d.com ou use formulário em /support. Planos Lifetime participam do roadmap prioritariamente.'
  },
];

const FAQ_CATEGORIES = Array.from(new Set(FAQ_DATA.map(faq => faq.category)));

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const filteredFAQs = FAQ_DATA.filter(faq => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'Todos' || faq.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const toggleQuestion = (question: string) => {
    setExpandedQuestion(expandedQuestion === question ? null : question);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <HeaderUser />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            ❓ Perguntas Frequentes (FAQ)
          </h1>
          <p className="text-xl text-purple-100 mb-6">
            Respostas rápidas para as dúvidas mais comuns
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar pergunta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 text-lg focus:outline-none focus:ring-4 focus:ring-purple-300"
              />
              <svg
                className="absolute right-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="px-4 py-2 bg-white/20 rounded-lg">
              <span className="font-bold text-2xl">{FAQ_DATA.length}</span>
              <span className="ml-2 text-sm">perguntas respondidas</span>
            </div>
            <div className="px-4 py-2 bg-white/20 rounded-lg">
              <span className="font-bold text-2xl">{FAQ_CATEGORIES.length}</span>
              <span className="ml-2 text-sm">categorias</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Filters */}
        <div className="mb-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            Filtrar por Categoria:
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory('Todos')}
              className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all ${
                selectedCategory === 'Todos'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              📋 Todos ({FAQ_DATA.length})
            </button>
            {FAQ_CATEGORIES.map((category) => {
              const count = FAQ_DATA.filter(faq => faq.category === category).length;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {category} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Results Count */}
        {searchQuery && (
          <div className="mb-6 text-center">
            <p className="text-lg text-slate-700 dark:text-slate-300">
              {filteredFAQs.length === 0 ? (
                <>❌ Nenhum resultado encontrado para "<strong>{searchQuery}</strong>"</>
              ) : (
                <>✅ {filteredFAQs.length} resultado{filteredFAQs.length !== 1 ? 's' : ''} encontrado{filteredFAQs.length !== 1 ? 's' : ''}</>
              )}
            </p>
          </div>
        )}

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.length === 0 && !searchQuery ? (
            <div className="text-center py-12">
              <p className="text-xl text-slate-600 dark:text-slate-400">
                Selecione uma categoria ou faça uma busca
              </p>
            </div>
          ) : (
            filteredFAQs.map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleQuestion(faq.question)}
                  className="w-full px-6 py-5 flex items-start justify-between hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-left"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full">
                        {faq.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {faq.question}
                    </h3>
                  </div>
                  <svg
                    className={`flex-shrink-0 w-6 h-6 text-purple-500 ml-4 transition-transform ${
                      expandedQuestion === faq.question ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {expandedQuestion === faq.question && (
                  <div className="px-6 pb-6 border-t border-slate-200 dark:border-slate-700">
                    <div className="pt-5">
                      <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Not Found */}
        {searchQuery && filteredFAQs.length === 0 && (
          <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Não encontrou o que procurava?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Tente buscar com outras palavras ou acesse nossa documentação completa
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/help"
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all shadow-lg"
              >
                📚 Central de Ajuda
              </Link>
              <Link
                href="/support"
                className="px-8 py-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-bold rounded-xl transition-all"
              >
                📧 Contatar Suporte
              </Link>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/help"
            className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-xl p-8 text-white hover:scale-105 transition-all"
          >
            <div className="text-4xl mb-3">📚</div>
            <h3 className="text-xl font-bold mb-2">Central de Ajuda</h3>
            <p className="text-blue-100">
              Guias completos e tutoriais passo a passo
            </p>
          </Link>

          <Link
            href="/support"
            className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-xl p-8 text-white hover:scale-105 transition-all"
          >
            <div className="text-4xl mb-3">📞</div>
            <h3 className="text-xl font-bold mb-2">Suporte</h3>
            <p className="text-orange-100">
              Fale com nossa equipe e tire dúvidas
            </p>
          </Link>

          <Link
            href="/changelog"
            className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-xl p-8 text-white hover:scale-105 transition-all"
          >
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-xl font-bold mb-2">Novidades</h3>
            <p className="text-green-100">
              Veja as últimas atualizações e recursos
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
