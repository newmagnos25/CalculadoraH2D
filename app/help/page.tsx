'use client';

import { useState } from 'react';
import Link from 'next/link';
import HeaderUser from '@/components/HeaderUser';

interface HelpSection {
  id: string;
  icon: string;
  title: string;
  description: string;
  content: HelpArticle[];
}

interface HelpArticle {
  question: string;
  answer: string;
  steps?: string[];
  tips?: string[];
  video?: string;
}

const HELP_SECTIONS: HelpSection[] = [
  {
    id: 'getting-started',
    icon: '🚀',
    title: 'Primeiros Passos',
    description: 'Como começar a usar a plataforma',
    content: [
      {
        question: 'Como criar minha conta?',
        answer: 'Criar sua conta é simples e grátis!',
        steps: [
          'Acesse a página de cadastro em /auth/signup',
          'Preencha seu nome completo e email',
          'Crie uma senha forte (mínimo 6 caracteres)',
          'Clique em "Criar Conta Grátis"',
          'Verifique seu email e confirme o cadastro',
          'Faça login e comece com 5 orçamentos gratuitos por mês!'
        ],
        tips: [
          'Use um email profissional para facilitar contato com clientes',
          'Escolha uma senha forte com letras, números e símbolos',
          'Não compartilhe sua senha com ninguém'
        ]
      },
      {
        question: 'Configuração inicial: O que fazer primeiro?',
        answer: 'IMPORTANTE: Configure os dados da sua empresa ANTES de fazer o primeiro orçamento!',
        steps: [
          'Acesse Configurações > Dados da Empresa',
          'Preencha: Nome, CNPJ (ou CPF), endereço completo',
          'Faça upload do seu logo (opcional mas recomendado)',
          'Configure as cores da sua marca',
          'Adicione informações bancárias para recebimentos',
          'Salve as configurações'
        ],
        tips: [
          'Sem configurar a empresa, você NÃO conseguirá gerar PDFs profissionais',
          'Logo e cores da marca aparecem em todos os orçamentos',
          'Revise os dados antes de enviar para clientes'
        ]
      },
      {
        question: 'Como funciona o tutorial interativo?',
        answer: 'O tutorial tem 14 passos que guiam você por todos os recursos da plataforma.',
        steps: [
          'O tutorial aparece automaticamente no primeiro acesso',
          'Você pode pausar e retomar quando quiser',
          'Cada passo destaca o elemento na tela com animação',
          'Há uma barra de progresso mostrando quantos passos faltam',
          'Pode pular para qualquer passo clicando nos pontos na parte inferior',
          'Se fechar sem completar, um botão flutuante aparece para retomar'
        ],
        tips: [
          'Recomendamos completar o tutorial antes de usar',
          'Você pode revisar o tutorial limpando localStorage',
          'O tutorial menciona as novas funcionalidades de upload STL'
        ]
      }
    ]
  },
  {
    id: 'stl-upload',
    icon: '📐',
    title: 'Upload de Arquivos STL',
    description: 'Análise automática de modelos 3D',
    content: [
      {
        question: 'Como fazer upload de arquivo STL?',
        answer: 'O upload STL é a forma mais rápida de calcular orçamentos!',
        steps: [
          'Na página da Calculadora, encontre a seção "Upload de Modelo 3D (STL)"',
          'Clique em "Carregar STL" ou arraste o arquivo para a área',
          'Aguarde alguns segundos para análise automática',
          'Visualize o modelo em 3D na tela',
          'Confira os valores calculados: volume, peso, tempo, dimensões',
          'Os campos do orçamento são preenchidos automaticamente!'
        ],
        tips: [
          'Tamanho máximo: 50MB por arquivo',
          'Formatos aceitos: .stl (ASCII ou binário)',
          'Modelos complexos podem levar mais tempo para processar',
          'Valores são estimativas baseadas em PLA com 20% de infill'
        ]
      },
      {
        question: 'O que é analisado automaticamente?',
        answer: 'O sistema extrai todas as informações importantes do seu modelo STL:',
        steps: [
          '📦 Volume em cm³ (volume real do modelo)',
          '⚖️ Peso estimado em gramas (PLA, 20% infill)',
          '⏱️ Tempo de impressão estimado (baseado em 4 min/cm³)',
          '📏 Dimensões: Largura (X), Altura (Z), Profundidade (Y)',
          '🔺 Número de triângulos (complexidade do modelo)',
          '📐 Bounding box (caixa delimitadora)'
        ],
        tips: [
          'Valores são estimativas - ajuste conforme necessário',
          'Peso real depende do material e infill escolhido',
          'Tempo real depende de velocidade, layer height, supports',
          'Use como base e refine com dados do seu slicer'
        ]
      },
      {
        question: 'Como usar o seletor de cores?',
        answer: 'Visualize seu modelo em 10 cores diferentes instantaneamente!',
        steps: [
          'Após fazer upload do STL, aparece o seletor de cores',
          'Clique em qualquer cor para trocar em tempo real',
          'Cores disponíveis: Laranja, Vermelho, Azul, Verde, Amarelo, Roxo, Preto, Branco, Cinza, Rosa',
          'Cada cor mostra uma prévia circular ao lado do nome',
          'A cor selecionada fica destacada com anel azul',
          'Arraste o modelo para rotacionar, scroll para zoom'
        ],
        tips: [
          'Ajuda a visualizar como ficará a peça impressa',
          'Útil para mostrar opções para o cliente',
          'Scroll funciona apenas dentro da área do visualizador 3D',
          'Modelo fica alinhado na base da mesa de impressão'
        ]
      },
      {
        question: 'Problemas com upload STL?',
        answer: 'Verifique estes pontos comuns:',
        steps: [
          '❌ Arquivo maior que 50MB → Reduza malha no Blender/Meshmixer',
          '❌ Modelo não aparece → Recarregue a página e tente novamente',
          '❌ Valores estranhos → Verifique unidades do modelo (mm esperado)',
          '❌ Erro ao processar → Arquivo pode estar corrompido',
          '✅ Exporte novamente do seu software 3D',
          '✅ Teste com modelo simples primeiro'
        ],
        tips: [
          'Modelos devem estar em milímetros (mm)',
          'Abra o F12 (console) para ver logs de debug',
          'Teste com um cubo simples se tiver problemas',
          'Entre em contato com suporte se persistir'
        ]
      }
    ]
  },
  {
    id: 'calculator',
    icon: '🧮',
    title: 'Calculadora de Preços',
    description: 'Como calcular orçamentos precisos',
    content: [
      {
        question: 'Como calcular um orçamento?',
        answer: 'Preencha todos os campos e clique em "Calcular Preço".',
        steps: [
          '1. Escolha a impressora (ou adicione custom)',
          '2. Upload STL (opcional mas recomendado) OU preencha manualmente',
          '3. Adicione filamentos: marca, tipo, peso em gramas',
          '4. Tempo de impressão: horas e minutos',
          '5. Selecione estado e distribuidora de energia',
          '6. Configure custos opcionais: mão de obra, depreciação, fixos',
          '7. Defina sua margem de lucro (%)',
          '8. Clique em "Calcular Preço" (consome 1 crédito)',
          '9. Veja o breakdown completo de custos'
        ],
        tips: [
          'Upload STL preenche automaticamente peso, tempo e dimensões',
          'Salve configurações frequentes como template',
          'Tarifa de energia é calculada com valores reais da distribuidora',
          'Margem de lucro padrão: 30-50% para serviços de impressão'
        ]
      },
      {
        question: 'Como adicionar múltiplos filamentos?',
        answer: 'Para projetos multi-cor, adicione quantos filamentos precisar.',
        steps: [
          'Preencha o primeiro filamento normalmente',
          'Clique em "+ Adicionar Filamento"',
          'Escolha marca, tipo e cor diferentes',
          'Informe o peso em gramas de cada um',
          'O sistema soma todos os custos automaticamente',
          'Cada filamento aparece separado no breakdown'
        ],
        tips: [
          'Peso total = soma de todos os filamentos',
          'Útil para modelos multi-material (PLA + TPU)',
          'Cada cor pode ter preço diferente',
          'Remove filamento clicando no ícone de lixeira'
        ]
      },
      {
        question: 'O que são os custos opcionais?',
        answer: 'Custos adicionais que tornam seu orçamento mais realista e lucrativo.',
        steps: [
          '💼 Mão de Obra: Seu tempo configurando, limpando, preparando (R$/hora)',
          '🔧 Depreciação: Desgaste da impressora ao longo do tempo (R$ por impressão)',
          '🏠 Custos Fixos: Aluguel, internet, luz geral (R$ por impressão)',
          '📈 Margem de Lucro: Sua margem de lucro desejada (porcentagem %)',
          '➕ Adicionais: Parafusos, magnets, inserts personalizados (R$ cada)'
        ],
        tips: [
          'Valores são salvos automaticamente para próximas impressões',
          'Mão de obra típica: R$ 30-50 por hora',
          'Depreciação típica: R$ 2-5 por impressão',
          'Margem de lucro recomendada: 30-50%',
          'Não esqueça de incluir pós-processamento (lixamento, pintura)'
        ]
      },
      {
        question: 'Como funcionam as tarifas de energia?',
        answer: 'Usamos dados REAIS de 32 distribuidoras brasileiras!',
        steps: [
          'Selecione seu ESTADO na primeira dropdown',
          'Selecione sua DISTRIBUIDORA (ex: CEMIG, COPEL, Light)',
          'O sistema usa a tarifa OFICIAL atualizada',
          'Custo de energia = Consumo da impressora × Tempo × Tarifa',
          'Consumo da impressora vem do banco de dados (ex: Ender 3 = 180W)'
        ],
        tips: [
          'Tarifas são atualizadas regularmente',
          'Inclui bandeira tarifária padrão',
          'Impressoras diferentes têm consumos diferentes',
          'Bambu Lab P1S consome mais que Ender 3, por exemplo'
        ]
      }
    ]
  },
  {
    id: 'pdf-generation',
    icon: '📄',
    title: 'Geração de PDFs',
    description: 'Orçamentos e contratos profissionais',
    content: [
      {
        question: 'Como gerar PDF de orçamento?',
        answer: 'Após calcular o preço, gere PDFs ilimitados GRATUITAMENTE!',
        steps: [
          'Calcule o preço primeiro (1 crédito)',
          'Preencha dados do cliente (nome, email, telefone, endereço)',
          'Adicione observações personalizadas (opcional)',
          'Clique em "Gerar PDF de Orçamento"',
          'PDF é gerado instantaneamente',
          'Baixe quantas vezes quiser SEM CUSTO ADICIONAL!'
        ],
        tips: [
          'Gerar PDF não gasta crédito extra (só o cálculo)',
          'Pode gerar novamente se errar algum dado',
          'PDF inclui: logo, dados da empresa, breakdown de custos',
          'Cliente vê todos os detalhes da impressão'
        ]
      },
      {
        question: 'Como gerar contrato de prestação de serviço?',
        answer: 'Formalize o acordo com um contrato profissional.',
        steps: [
          'Calcule o preço e preencha dados do cliente',
          'Clique em "Gerar Contrato" (consome +1 crédito)',
          'Contrato inclui: termos, prazos, responsabilidades',
          'PDF profissional com dados de ambas as partes',
          'Cliente assina fisicamente ou digitalmente'
        ],
        tips: [
          'Contrato é OPCIONAL - só gere se precisar formalizar',
          'Consome 1 crédito adicional (além do cálculo)',
          'Contém termos de garantia, entrega e pagamento',
          'Protege você e o cliente legalmente'
        ]
      },
      {
        question: 'Como gerar termo de consignação?',
        answer: 'Para vendas por consignação, use a página dedicada.',
        steps: [
          'Acesse Consignação no menu superior',
          'Selecione o cliente na lista',
          'Adicione itens: descrição, quantidade, valor unitário',
          'Configure condições: prazo de devolução, comissão, pagamento',
          'Adicione observações adicionais',
          'Clique em "Gerar Termo de Consignação"',
          'PDF é salvo no dashboard automaticamente'
        ],
        tips: [
          'Consignação = cliente vende seus produtos e te paga depois',
          'Configure prazo de devolução (ex: 30, 60, 90 dias)',
          'Comissão típica: 20-40%',
          'Termos claros evitam problemas futuros'
        ]
      },
      {
        question: 'Posso personalizar os PDFs?',
        answer: 'Sim! Personalize com logo, cores e informações da sua marca.',
        steps: [
          'Acesse Configurações > Dados da Empresa',
          'Faça upload do seu logo (PNG ou JPG, max 2MB)',
          'Escolha cores primária e secundária da marca',
          'Preencha todos os dados: nome, CNPJ, endereço, telefone, email',
          'Adicione informações bancárias',
          'Salve e todos os PDFs usarão sua identidade visual!'
        ],
        tips: [
          'Logo aparece no cabeçalho dos PDFs',
          'Cores da marca são usadas em títulos e destaques',
          'Revise dados com atenção - aparecem para clientes',
          'PDFs ficam muito mais profissionais com logo'
        ]
      }
    ]
  },
  {
    id: 'clients',
    icon: '👥',
    title: 'Gestão de Clientes',
    description: 'Gerenciar informações de clientes',
    content: [
      {
        question: 'Como adicionar um cliente?',
        answer: 'Gerencie clientes ilimitados (planos pagos).',
        steps: [
          'Acesse Configurações > Gerenciar Clientes',
          'Clique em "+ Adicionar Cliente"',
          'Preencha: Nome completo',
          'Escolha tipo: Pessoa Física (CPF) ou Jurídica (CNPJ)',
          'Preencha documento com validação automática',
          'Adicione: Email, telefone, endereço completo',
          'Clique em "Salvar Cliente"'
        ],
        tips: [
          'CPF e CNPJ são validados automaticamente',
          'Plano FREE: sem gestão de clientes',
          'Plano Starter: até 20 clientes',
          'Plano Professional+: clientes ilimitados',
          'Dados são criptografados e seguros'
        ]
      },
      {
        question: 'Como usar clientes salvos em orçamentos?',
        answer: 'Selecione clientes salvos para auto-preencher dados.',
        steps: [
          'Na calculadora, encontre a seção "Dados do Cliente"',
          'Clique na dropdown "Selecionar cliente salvo"',
          'Escolha o cliente da lista',
          'Todos os dados preenchem automaticamente',
          'Gere o orçamento normalmente',
          'Histórico fica vinculado ao cliente'
        ],
        tips: [
          'Economia enorme de tempo para clientes recorrentes',
          'Dashboard mostra histórico por cliente',
          'Pode editar dados antes de gerar PDF',
          'Cliente não precisa preencher sempre os mesmos dados'
        ]
      },
      {
        question: 'Como editar ou excluir clientes?',
        answer: 'Gerencie sua base de clientes facilmente.',
        steps: [
          'Acesse Configurações > Gerenciar Clientes',
          'Encontre o cliente na lista',
          'Para EDITAR: Clique no ícone de lápis, altere e salve',
          'Para EXCLUIR: Clique no ícone de lixeira, confirme exclusão',
          'Histórico de orçamentos é mantido mesmo após exclusão'
        ],
        tips: [
          'Exclua clientes inativos para organizar',
          'Edite dados quando cliente mudar telefone/endereço',
          'Histórico nunca é perdido',
          'Busca por nome facilita encontrar clientes'
        ]
      }
    ]
  },
  {
    id: 'dashboard',
    icon: '📊',
    title: 'Dashboard e Histórico',
    description: 'Acompanhe seus orçamentos e contratos',
    content: [
      {
        question: 'Como acessar meu histórico?',
        answer: 'Veja todos os documentos gerados em um só lugar.',
        steps: [
          'Clique em "📊 Meus Orçamentos" no menu superior',
          'Dashboard mostra: Total de documentos, Orçamentos, Contratos',
          'Filtre por tipo: Todos / Orçamentos / Contratos',
          'Veja detalhes: data, cliente, preço, peso, tempo, dimensões',
          'Clique em "Baixar PDF" para baixar novamente'
        ],
        tips: [
          'Plano FREE: SEM histórico (perde após fechar)',
          'Plano Starter: SEM histórico',
          'Plano Professional+: Histórico completo ilimitado',
          'Re-baixar PDFs não gasta créditos'
        ]
      },
      {
        question: 'Como filtrar e buscar documentos?',
        answer: 'Use filtros para encontrar rapidamente o que precisa.',
        steps: [
          'No dashboard, use as abas no topo:',
          '📋 Todos: Mostra orçamentos e contratos juntos',
          '🧮 Orçamentos: Apenas cálculos de preço',
          '📜 Contratos: Apenas termos de consignação',
          'Ordem: Mais recentes aparecem primeiro',
          'Cada card mostra todas as informações principais'
        ],
        tips: [
          'Busca por texto e filtros de data vêm em próxima atualização',
          'Exportação para Excel/CSV também em desenvolvimento',
          'Sugira melhorias para o dashboard!'
        ]
      },
      {
        question: 'Posso baixar PDFs novamente?',
        answer: 'Sim! Baixe quantas vezes quiser, sem custo.',
        steps: [
          'Acesse o Dashboard',
          'Encontre o documento desejado',
          'Clique em "📥 Baixar PDF"',
          'Arquivo baixa instantaneamente',
          'NÃO gasta crédito (só a geração inicial)'
        ],
        tips: [
          'Útil se perdeu o arquivo original',
          'Pode enviar para cliente novamente',
          'PDF é regenerado com dados salvos',
          'Sempre idêntico ao original'
        ]
      }
    ]
  },
  {
    id: 'subscription',
    icon: '💳',
    title: 'Planos e Assinatura',
    description: 'Gerenciar sua assinatura e limites',
    content: [
      {
        question: 'Quais são os planos disponíveis?',
        answer: 'Temos 5 planos para diferentes necessidades:',
        steps: [
          '🆓 FREE: R$ 0/mês - 5 orçamentos/mês, sem clientes, sem histórico',
          '🟦 Starter: Até 50 orçamentos/mês, 20 clientes, sem histórico',
          '🟣 Professional (POPULAR): Orçamentos ilimitados, clientes ilimitados, histórico completo, analytics',
          '🟠 Enterprise: Tudo do Professional + white-label, API, até 5 usuários',
          '🟢 Lifetime: Pagamento único, acesso vitalício, todas as features'
        ],
        tips: [
          'Teste 7 dias do Professional por apenas R$ 2,99',
          'Planos anuais economizam 17%',
          'Upgrade ou downgrade a qualquer momento',
          'Sem fidelidade - cancele quando quiser'
        ]
      },
      {
        question: 'Como funciona o sistema de créditos?',
        answer: 'Créditos são consumidos ao calcular orçamentos.',
        steps: [
          '1 crédito = 1 cálculo de orçamento',
          '+1 crédito = 1 contrato (opcional)',
          'Gerar PDF NÃO gasta crédito adicional',
          'Plano FREE: 5 créditos/mês (renova todo mês)',
          'Plano Starter: 50 créditos/mês',
          'Planos Professional+: créditos ILIMITADOS'
        ],
        tips: [
          'Créditos do FREE renovam no dia 1 de cada mês',
          'Não acumulam - use ou perca',
          'Se atingir limite, faça upgrade para continuar',
          'PDFs ilimitados após calcular (não gastam crédito)'
        ]
      },
      {
        question: 'Como fazer upgrade do meu plano?',
        answer: 'Upgrade é instantâneo e pode ser feito a qualquer momento.',
        steps: [
          'Clique no seu avatar no canto superior direito',
          'Selecione "Ver Planos" ou "Fazer Upgrade"',
          'Escolha o plano desejado',
          'Preencha dados de pagamento',
          'Confirme e pronto - upgrade imediato!',
          'Limites aumentam na hora'
        ],
        tips: [
          'Pagamento via PIX ou cartão',
          'Sem cobrança proporcional - começa novo ciclo',
          'Dados são migrados automaticamente',
          'Suporte prioritário em planos pagos'
        ]
      },
      {
        question: 'Como cancelar minha assinatura?',
        answer: 'Cancele a qualquer momento, sem burocra cia.',
        steps: [
          'Acesse Configurações > Minha Conta',
          'Role até "Gerenciar Assinatura"',
          'Clique em "Cancelar Assinatura"',
          'Confirme o cancelamento',
          'Assinatura continua até o fim do período pago',
          'Depois volta para plano FREE automaticamente'
        ],
        tips: [
          'Sem taxas de cancelamento',
          'Dados NÃO são perdidos',
          'Pode reativar depois sem problemas',
          'Histórico é mantido se reativar Professional+'
        ]
      }
    ]
  },
  {
    id: 'troubleshooting',
    icon: '🔧',
    title: 'Solução de Problemas',
    description: 'Resolva problemas comuns',
    content: [
      {
        question: 'Não recebi email de confirmação',
        answer: 'Verifique spam e reenvie se necessário.',
        steps: [
          'Verifique pasta de SPAM/LIXO ELETRÔNICO',
          'Adicione noreply@precifica3d.com aos contatos',
          'Na tela de login, clique em "Reenviar confirmação"',
          'Aguarde 60 segundos para reenviar novamente',
          'Se não chegar, entre em contato: suporte@precifica3d.com'
        ],
        tips: [
          'Email pode demorar até 5 minutos',
          'Certifique-se que digitou email correto',
          'Alguns provedores bloqueiam emails automáticos',
          'Gmail e Outlook geralmente funcionam bem'
        ]
      },
      {
        question: 'Esqueci minha senha',
        answer: 'Recupere facilmente com reset de senha.',
        steps: [
          'Na tela de login, clique em "Esqueceu a senha?"',
          'Digite seu email cadastrado',
          'Verifique email com link de reset',
          'Clique no link (válido por 1 hora)',
          'Digite nova senha (mínimo 6 caracteres)',
          'Faça login com nova senha'
        ],
        tips: [
          'Link expira em 1 hora por segurança',
          'Pode solicitar novo link se expirar',
          'Use senha forte: letras + números + símbolos',
          'Não use mesma senha de outros sites'
        ]
      },
      {
        question: 'Erro ao gerar PDF',
        answer: 'Verifique se configurou dados da empresa.',
        steps: [
          'ERRO: "Configure dados da empresa" → Vá para Configurações > Dados da Empresa',
          'Preencha TODOS os campos obrigatórios',
          'Certifique-se que salvou as configurações',
          'Tente gerar PDF novamente',
          'Se persistir, limpe cache do navegador (Ctrl+Shift+Del)',
          'Tente em modo anônimo/privado'
        ],
        tips: [
          'PDF precisa de: nome, CNPJ/CPF, endereço, telefone',
          'Logo é opcional mas recomendado',
          'Teste com dados de exemplo primeiro',
          'Entre em contato se erro persistir'
        ]
      },
      {
        question: 'Cálculo parece incorreto',
        answer: 'Verifique unidades e configurações.',
        steps: [
          'Peso: deve estar em GRAMAS (não kg)',
          'Tempo: em HORAS e MINUTOS separados',
          'Dimensões: em MILÍMETROS (se manual)',
          'Tarifa de energia: selecione estado e distribuidora corretos',
          'Revise margem de lucro (%)',
          'Compare com seu slicer para validar'
        ],
        tips: [
          'Upload STL usa PLA 20% infill como base',
          'Ajuste manualmente se usar outro material',
          'Tempo real depende de velocidade, layer height',
          'Entre em contato se valores não fazem sentido'
        ]
      },
      {
        question: 'Site está lento ou travando',
        answer: 'Otimize seu navegador e conexão.',
        steps: [
          'Atualize o navegador para versão mais recente',
          'Limpe cache e cookies (Ctrl+Shift+Del)',
          'Desative extensões que podem conflitar',
          'Teste em navegador diferente (Chrome, Firefox, Edge)',
          'Verifique sua conexão de internet',
          'Tente em horário diferente (menos tráfego)'
        ],
        tips: [
          'Navegadores recomendados: Chrome, Firefox, Edge',
          'Upload de STL grandes pode demorar',
          'Feche abas desnecessárias',
          'Relate problemas persistentes para suporte'
        ]
      }
    ]
  }
];

export default function HelpPage() {
  const [activeSection, setActiveSection] = useState<string>('getting-started');
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const currentSection = HELP_SECTIONS.find(s => s.id === activeSection);

  const toggleArticle = (question: string) => {
    setExpandedArticle(expandedArticle === question ? null : question);
  };

  // Filter articles based on search
  const filteredSections = searchQuery
    ? HELP_SECTIONS.map(section => ({
        ...section,
        content: section.content.filter(
          article =>
            article.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(section => section.content.length > 0)
    : HELP_SECTIONS;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <HeaderUser />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            📚 Central de Ajuda
          </h1>
          <p className="text-xl text-blue-100 mb-6">
            Encontre respostas, tutoriais e guias completos para usar o Precifica3D
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar artigos, perguntas, tutoriais..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 text-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
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

          {/* Quick Links */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/faq"
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold text-sm transition-all"
            >
              ❓ FAQ Completo
            </Link>
            <Link
              href="/support"
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold text-sm transition-all"
            >
              📞 Contato & Suporte
            </Link>
            <Link
              href="/changelog"
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold text-sm transition-all"
            >
              🎉 Novidades
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Categorias
              </h3>
              <nav className="space-y-2">
                {filteredSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    <span className="mr-2">{section.icon}</span>
                    {section.title}
                    <span className="ml-2 text-xs opacity-75">
                      ({section.content.length})
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {currentSection && (
              <div>
                {/* Section Header */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-5xl">{currentSection.icon}</span>
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                        {currentSection.title}
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400">
                        {currentSection.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Articles */}
                <div className="space-y-4">
                  {currentSection.content.map((article, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleArticle(article.question)}
                        className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                      >
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white text-left">
                          {article.question}
                        </h3>
                        <svg
                          className={`w-6 h-6 text-blue-500 transition-transform ${
                            expandedArticle === article.question ? 'rotate-180' : ''
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

                      {expandedArticle === article.question && (
                        <div className="px-6 pb-6 border-t border-slate-200 dark:border-slate-700">
                          <div className="pt-6">
                            <p className="text-slate-700 dark:text-slate-300 text-lg mb-6">
                              {article.answer}
                            </p>

                            {article.steps && (
                              <div className="mb-6">
                                <h4 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                  <span className="text-xl">📝</span>
                                  Passo a Passo:
                                </h4>
                                <ol className="space-y-2">
                                  {article.steps.map((step, i) => (
                                    <li
                                      key={i}
                                      className="flex gap-3 text-slate-700 dark:text-slate-300"
                                    >
                                      <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                        {i + 1}
                                      </span>
                                      <span>{step}</span>
                                    </li>
                                  ))}
                                </ol>
                              </div>
                            )}

                            {article.tips && (
                              <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-lg p-4">
                                <h4 className="font-bold text-amber-900 dark:text-amber-400 mb-2 flex items-center gap-2">
                                  <span className="text-xl">💡</span>
                                  Dicas Importantes:
                                </h4>
                                <ul className="space-y-1">
                                  {article.tips.map((tip, i) => (
                                    <li
                                      key={i}
                                      className="text-amber-800 dark:text-amber-300 text-sm flex gap-2"
                                    >
                                      <span>•</span>
                                      <span>{tip}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Still Need Help? */}
        <div className="mt-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl shadow-xl p-8 text-white text-center">
          <h3 className="text-2xl font-black mb-3">
            Ainda precisa de ajuda?
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Nossa equipe está pronta para ajudar você!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/support"
              className="px-8 py-4 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-all shadow-lg"
            >
              📧 Entrar em Contato
            </Link>
            <Link
              href="/faq"
              className="px-8 py-4 bg-white/20 hover:bg-white/30 font-bold rounded-xl transition-all"
            >
              ❓ Ver FAQ Completo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
