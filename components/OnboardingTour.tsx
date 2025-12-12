'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface OnboardingStep {
  title: string;
  description: string;
  emoji: string;
  highlight?: string; // Seletor CSS para destacar elemento
  action?: {
    text: string;
    link?: string;
  };
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    emoji: '👋',
    title: 'Bem-vindo ao Precifica3D!',
    description: 'Vamos configurar tudo para você começar a fazer orçamentos profissionais em minutos. Siga o passo a passo!',
  },
  {
    emoji: '⚙️',
    title: '1º PASSO: Configure sua Empresa',
    description: 'IMPORTANTE: Antes de calcular, você precisa configurar os dados da sua empresa em "Configurações". Sem isso, não conseguirá gerar PDFs profissionais!',
    action: {
      text: 'Ir para Configurações Agora',
      link: '/settings',
    },
  },
  {
    emoji: '🖨️',
    title: 'Escolha sua Impressora',
    description: 'Selecione a impressora que você vai usar. Você pode adicionar impressoras customizadas no menu "Impressoras" se a sua não estiver na lista.',
    highlight: 'select[name="printer"]',
  },
  {
    emoji: '📐',
    title: 'Upload STL (NOVO! Recomendado)',
    description: 'NOVIDADE: Arraste seu arquivo STL para análise automática! O sistema calcula volume, peso estimado, dimensões e tempo de impressão automaticamente. Visualize em 3D antes de fazer o orçamento!',
    highlight: 'label:has(input[type="file"][accept=".stl"])',
  },
  {
    emoji: '🎨',
    title: 'Visualize em 10 Cores',
    description: 'Depois de fazer upload do STL, escolha entre 10 cores de filamentos para visualizar como ficará seu modelo! Rotacione e dê zoom com o mouse. Os valores já preenchem automaticamente abaixo.',
  },
  {
    emoji: '🧵',
    title: 'Adicione os Filamentos',
    description: 'Informe o peso em GRAMAS de cada filamento usado (já preenchido se fez upload STL). Para projetos multi-cor, clique em "+ Adicionar Filamento" e escolha a cor de cada um.',
    highlight: '.filament-section',
  },
  {
    emoji: '⏱️',
    title: 'Tempo de Impressão',
    description: 'Digite o tempo total que a impressão levará (em Horas e Minutos). Você pode ver isso no slicer (Cura, PrusaSlicer, etc).',
    highlight: 'input[type="number"][placeholder*="Horas"]',
  },
  {
    emoji: '⚡',
    title: 'Tarifa de Energia',
    description: 'Selecione seu ESTADO e sua DISTRIBUIDORA de energia. Isso garante que o custo de energia elétrica seja calculado com precisão!',
    highlight: 'select[id="state"]',
  },
  {
    emoji: '💼',
    title: 'Custos do Negócio (Opcional)',
    description: 'Configure mão de obra, depreciação, custos fixos e margem de lucro. Esses valores são salvos automaticamente para os próximos orçamentos.',
  },
  {
    emoji: '🧮',
    title: 'Calcule o Orçamento',
    description: 'Clique em "Calcular Preço" para ver o valor. Isso consome 1 crédito. O resultado mostra breakdown completo de custos + lucro.',
  },
  {
    emoji: '📄',
    title: 'Gere o PDF (GRÁTIS!)',
    description: 'Depois de calcular, você pode gerar o PDF quantas vezes quiser SEM GASTAR CRÉDITO ADICIONAL! Ajuste, teste e envie para o cliente.',
  },
  {
    emoji: '📜',
    title: 'Contrato (Opcional)',
    description: 'Se quiser formalizar, gere também o Contrato de Prestação de Serviço. Isso consome +1 crédito, mas é opcional.',
  },
  {
    emoji: '🎯',
    title: 'Templates para Agilizar',
    description: 'Salve produtos recorrentes (chaveiros, miniaturas, etc) como TEMPLATES. Assim você gera orçamentos em segundos nos próximos clientes!',
  },
  {
    emoji: '🚀',
    title: 'Pronto para Começar!',
    description: 'Agora você está pronto! 💡 DICA: Use o upload STL para agilizar, configure a empresa primeiro, calcule o orçamento e gere PDFs ilimitados. Precisa de ajuda? Acesse /help ou /faq. Boa sorte! 💰',
  },
];

export default function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    const savedStep = localStorage.getItem('onboardingCurrentStep');
    const onboardingPaused = localStorage.getItem('onboardingPaused');

    if (!hasSeenOnboarding) {
      // Se tem progresso salvo, retomar de onde parou
      if (savedStep && onboardingPaused === 'true') {
        const stepNumber = parseInt(savedStep, 10);
        setCurrentStep(stepNumber);
        setIsOpen(true);
        // Remover flag de pausado
        localStorage.removeItem('onboardingPaused');
      } else {
        // Show onboarding after a short delay
        setTimeout(() => {
          setIsOpen(true);
        }, 1000);
      }
    }
  }, []);

  // Adicionar efeito pulsante no elemento destacado
  useEffect(() => {
    if (!isOpen) return;

    const step = ONBOARDING_STEPS[currentStep];
    if (!step.highlight) return;

    const element = document.querySelector(step.highlight);
    if (!element) return;

    // Adicionar classe pulsante
    element.classList.add('onboarding-highlight');

    // Scroll suave até o elemento
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });

    return () => {
      element.classList.remove('onboarding-highlight');
    };
  }, [currentStep, isOpen]);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      // Salvar progresso
      localStorage.setItem('onboardingCurrentStep', nextStep.toString());
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      // Salvar progresso
      localStorage.setItem('onboardingCurrentStep', prevStep.toString());
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handlePause = () => {
    // Salvar progresso e pausar (não completar)
    localStorage.setItem('onboardingCurrentStep', currentStep.toString());
    localStorage.setItem('onboardingPaused', 'true');
    setIsOpen(false);
  };

  const handleComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    localStorage.removeItem('onboardingCurrentStep');
    localStorage.removeItem('onboardingPaused');
    setIsOpen(false);
  };

  // Verificar se tem tutorial pausado para mostrar botão de retomar
  const hasPausedTutorial = !isOpen &&
    localStorage.getItem('onboardingPaused') === 'true' &&
    !localStorage.getItem('hasSeenOnboarding');

  const handleResume = () => {
    const savedStep = localStorage.getItem('onboardingCurrentStep');
    if (savedStep) {
      setCurrentStep(parseInt(savedStep, 10));
    }
    localStorage.removeItem('onboardingPaused');
    setIsOpen(true);
  };

  // Botão flutuante para retomar tutorial
  if (hasPausedTutorial) {
    return (
      <button
        onClick={handleResume}
        className="fixed bottom-6 right-6 z-50 px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-2xl transition-all animate-bounce hover:animate-none flex items-center gap-3"
      >
        <span className="text-2xl">📚</span>
        <div className="text-left">
          <div className="text-sm font-black">Tutorial Pausado</div>
          <div className="text-xs opacity-90">Clique para continuar</div>
        </div>
      </button>
    );
  }

  if (!isOpen) return null;

  const step = ONBOARDING_STEPS[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  return (
    <>
      {/* CSS para efeito pulsante */}
      <style jsx global>{`
        @keyframes pulse-highlight {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.7),
                        0 0 0 0 rgba(251, 146, 60, 0.4);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(249, 115, 22, 0),
                        0 0 0 20px rgba(251, 146, 60, 0);
          }
        }

        .onboarding-highlight {
          position: relative;
          animation: pulse-highlight 2s infinite;
          border-radius: 8px;
          z-index: 9997 !important;
        }

        .onboarding-highlight::before {
          content: '';
          position: absolute;
          inset: -4px;
          background: linear-gradient(135deg, #f97316, #fb923c);
          border-radius: 12px;
          z-index: -1;
          opacity: 0.3;
          animation: pulse-highlight 2s infinite;
        }
      `}</style>

      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998] animate-in fade-in duration-300" />

      {/* Modal */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full p-8 border-4 border-orange-500 animate-in zoom-in-95 duration-300">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                Passo {currentStep + 1} de {ONBOARDING_STEPS.length}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {Math.round(((currentStep + 1) / ONBOARDING_STEPS.length) * 100)}% concluído
              </span>
            </div>
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500 ease-out"
                style={{ width: `${((currentStep + 1) / ONBOARDING_STEPS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            {/* Emoji */}
            <div className="text-7xl mb-4 animate-in zoom-in duration-500">
              {step.emoji}
            </div>

            {/* Title */}
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
              {step.title}
            </h2>

            {/* Description */}
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed max-w-xl mx-auto">
              {step.description}
            </p>

            {/* Action Button (se tiver) */}
            {step.action && (
              <div className="mt-6">
                {step.action.link ? (
                  <Link
                    href={step.action.link}
                    onClick={handlePause}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg text-lg"
                  >
                    ⚙️ {step.action.text}
                  </Link>
                ) : (
                  <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg text-lg">
                    {step.action.text}
                  </button>
                )}
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                  💡 O tutorial será pausado. Quando voltar, continuará de onde parou!
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              {!isFirstStep && (
                <button
                  onClick={handlePrevious}
                  className="px-6 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-bold rounded-xl transition-all"
                >
                  ← Anterior
                </button>
              )}

              <button
                onClick={handleNext}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl transition-all shadow-lg"
              >
                {isLastStep ? '🎉 Começar a Usar!' : 'Próximo →'}
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePause}
                className="flex-1 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold rounded-lg transition-all text-sm"
              >
                ⏸️ Pausar (Continua depois)
              </button>

              <button
                onClick={handleSkip}
                className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 font-semibold rounded-lg transition-all text-sm"
              >
                ❌ Pular e Não Mostrar Mais
              </button>
            </div>
          </div>

          {/* Progress Dots (visual adicional) */}
          <div className="flex justify-center gap-2 mt-6">
            {ONBOARDING_STEPS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'w-8 bg-gradient-to-r from-orange-500 to-amber-500'
                    : index < currentStep
                    ? 'w-2 bg-green-500'
                    : 'w-2 bg-slate-300 dark:bg-slate-700'
                }`}
                aria-label={`Ir para passo ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
