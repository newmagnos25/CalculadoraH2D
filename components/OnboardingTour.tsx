'use client';

import { useEffect, useState } from 'react';

interface OnboardingStep {
  title: string;
  description: string;
  emoji: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    emoji: '👋',
    title: 'Bem-vindo ao Precifica3D!',
    description: 'Vamos te mostrar como criar seu primeiro orçamento profissional em 3 passos simples.',
  },
  {
    emoji: '📊',
    title: 'Preencha os Dados da Impressão',
    description: 'Selecione sua impressora, adicione os filamentos usados (peso em gramas) e o tempo de impressão.',
  },
  {
    emoji: '💰',
    title: 'Calcule e Gere o PDF',
    description: 'Clique em "Calcular Preço" para ver o valor. Depois, preencha os dados do cliente e gere um PDF profissional!',
  },
];

export default function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');

    if (!hasSeenOnboarding) {
      // Show onboarding after a short delay
      setTimeout(() => {
        setIsOpen(true);
      }, 500);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const step = ONBOARDING_STEPS[currentStep];
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998] animate-in fade-in duration-300" />

      {/* Modal */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full p-8 border-4 border-orange-500 animate-in zoom-in-95 duration-300">
          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mb-6">
            {ONBOARDING_STEPS.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'w-8 bg-gradient-to-r from-orange-500 to-amber-500'
                    : index < currentStep
                    ? 'w-2 bg-green-500'
                    : 'w-2 bg-slate-300 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            {/* Emoji */}
            <div className="text-6xl mb-4 animate-in zoom-in duration-500">
              {step.emoji}
            </div>

            {/* Title */}
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
              {step.title}
            </h2>

            {/* Description */}
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Step Counter */}
          <div className="text-center mb-6">
            <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
              Passo {currentStep + 1} de {ONBOARDING_STEPS.length}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="flex-1 px-6 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-xl transition-all"
            >
              Pular
            </button>
            <button
              onClick={handleNext}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl transition-all shadow-lg"
            >
              {isLastStep ? '🎉 Começar!' : 'Próximo →'}
            </button>
          </div>

          {/* Skip Link */}
          {!isLastStep && (
            <div className="text-center mt-4">
              <button
                onClick={handleSkip}
                className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 underline"
              >
                Já sei usar, pular tutorial
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
