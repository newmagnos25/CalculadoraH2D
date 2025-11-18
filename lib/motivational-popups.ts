/**
 * Sistema de Pop-ups Motivacionais
 * Psicologia de satisfação e reforço positivo
 */

import toast from 'react-hot-toast';

const STORAGE_KEY = 'motivational_popups_state';

interface PopupState {
  totalCalculations: number;
  lastMilestone: number;
  hasSeenWelcome: boolean;
  purchaseDate?: string;
}

/**
 * Obter estado dos pop-ups
 */
function getPopupState(): PopupState {
  if (typeof window === 'undefined') {
    return { totalCalculations: 0, lastMilestone: 0, hasSeenWelcome: false };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { totalCalculations: 0, lastMilestone: 0, hasSeenWelcome: false };
    }
    return JSON.parse(stored);
  } catch {
    return { totalCalculations: 0, lastMilestone: 0, hasSeenWelcome: false };
  }
}

/**
 * Salvar estado dos pop-ups
 */
function savePopupState(state: PopupState) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/**
 * Mensagens motivacionais variadas
 */
const MILESTONE_MESSAGES = {
  10: [
    { emoji: '🎯', title: 'Primeira Dúzia!', message: 'Você já criou 10 orçamentos! Está dominando a ferramenta!' },
    { emoji: '🔥', title: 'Produtividade em Alta!', message: '10 orçamentos concluídos! Seu negócio está crescendo!' },
    { emoji: '⚡', title: 'Velocidade Profissional!', message: 'Já são 10 orçamentos! Você está arrasando!' },
  ],
  20: [
    { emoji: '🚀', title: 'Decolando!', message: '20 orçamentos! Você está profissionalizando seu negócio!' },
    { emoji: '💪', title: 'Força Total!', message: '20 orçamentos criados! Continue assim, campeão!' },
    { emoji: '🎨', title: 'Artista 3D!', message: 'Incríveis 20 orçamentos! Seu portfólio está bombando!' },
  ],
  30: [
    { emoji: '🏆', title: 'Profissional Nível Pro!', message: '30 orçamentos! Você é um mestre do Precifica3D!' },
    { emoji: '💎', title: 'Diamante Bruto!', message: '30 orçamentos polidos! Qualidade profissional!' },
    { emoji: '🌟', title: 'Estrela em Ascensão!', message: 'Já são 30 orçamentos! Você está brilhando!' },
  ],
  40: [
    { emoji: '🔮', title: 'Visionário 3D!', message: '40 orçamentos! Seu futuro está sendo impresso!' },
    { emoji: '🎯', title: 'Precisão Máxima!', message: '40 orçamentos no alvo! Você é referência!' },
    { emoji: '🚁', title: 'Vista Panorâmica!', message: '40 orçamentos! Você tem visão de negócio!' },
  ],
  50: [
    { emoji: '🎉', title: 'MEIO SÉCULO!', message: '50 orçamentos! É hora de fazer UPGRADE! 🚀', cta: true },
    { emoji: '👑', title: 'REI/RAINHA 3D!', message: '50 orçamentos! Você merece benefícios PREMIUM!', cta: true },
    { emoji: '💰', title: 'Investimento Lucrativo!', message: '50 orçamentos! Hora de lucrar ainda mais com plano PRO!', cta: true },
  ],
};

/**
 * Mensagens para últimos 5 orçamentos do plano
 */
const FINAL_WARNING_MESSAGES = [
  { emoji: '⚠️', title: 'Atenção!', message: 'Você tem apenas {remaining} orçamentos restantes este período!' },
  { emoji: '⏰', title: 'Tempo Limitado!', message: 'Restam {remaining} orçamentos! Considere fazer upgrade!' },
  { emoji: '🔔', title: 'Aviso Importante', message: 'Seus últimos {remaining} orçamentos! Não fique sem!' },
];

/**
 * Mensagem do último orçamento
 */
const LAST_QUOTE_MESSAGES = [
  { emoji: '🚨', title: 'ÚLTIMO ORÇAMENTO!', message: 'Este é seu último orçamento disponível! Faça upgrade agora!' },
  { emoji: '⛔', title: 'ATENÇÃO CRÍTICA!', message: 'Último orçamento do período! Não perca negócios, faça upgrade!' },
  { emoji: '🆘', title: 'LIMITE ATINGIDO!', message: 'Você usou seu último orçamento! Upgrade para continuar vendendo!' },
];

/**
 * Mensagens de boas-vindas ao comprar plano
 */
export const WELCOME_PURCHASE_MESSAGES = {
  test: {
    emoji: '🎁',
    title: 'Bem-vindo ao Plano TESTE!',
    message: 'Parabéns! Agora você tem:\n\n✅ 50 orçamentos por semana\n✅ 7 dias de acesso completo\n✅ Todos os recursos PRO\n\nAproveite ao máximo! 🚀',
    duration: 8000,
  },
  starter: {
    emoji: '🚀',
    title: 'Bem-vindo ao Plano STARTER!',
    message: 'Excelente escolha! Seus benefícios:\n\n✅ 50 orçamentos por mês\n✅ PDFs profissionais ilimitados\n✅ Gestão completa de clientes\n✅ Suporte prioritário\n\nSucesso! 💪',
    duration: 8000,
  },
  professional: {
    emoji: '💎',
    title: 'Bem-vindo ao Plano PROFESSIONAL!',
    message: 'Você é PRO agora! Aproveite:\n\n✅ Orçamentos ILIMITADOS\n✅ PDFs com sua marca\n✅ Prioridade máxima no suporte\n✅ Acesso a recursos exclusivos\n\nVocê merece! 🏆',
    duration: 10000,
  },
  lifetime: {
    emoji: '👑',
    title: 'Bem-vindo ao Plano LIFETIME!',
    message: 'PARABÉNS! Você é VIP VITALÍCIO:\n\n✅ Acesso PARA SEMPRE\n✅ Todas as atualizações futuras\n✅ Orçamentos ilimitados\n✅ Suporte VIP\n\nInvestimento inteligente! 💰',
    duration: 10000,
  },
};

/**
 * Mostrar pop-up motivacional após cálculo
 */
export function showMotivationalPopup(remaining: number, max: number) {
  const state = getPopupState();
  const newTotal = state.totalCalculations + 1;

  // Atualizar contador
  state.totalCalculations = newTotal;
  savePopupState(state);

  // ÚLTIMO ORÇAMENTO - Prioridade máxima
  if (remaining === 0) {
    const msg = LAST_QUOTE_MESSAGES[Math.floor(Math.random() * LAST_QUOTE_MESSAGES.length)];
    toast.error(
      `${msg.emoji} ${msg.title}\n\n${msg.message}`,
      {
        duration: 10000,
        style: {
          background: '#dc2626',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '16px',
          padding: '20px',
        },
      }
    );
    return;
  }

  // ÚLTIMOS 5 ORÇAMENTOS - Avisos frequentes
  if (remaining <= 5 && remaining > 0) {
    const msg = FINAL_WARNING_MESSAGES[Math.floor(Math.random() * FINAL_WARNING_MESSAGES.length)];
    toast(
      `${msg.emoji} ${msg.title}\n\n${msg.message.replace('{remaining}', remaining.toString())}`,
      {
        duration: 7000,
        icon: msg.emoji,
        style: {
          background: '#f59e0b',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '15px',
          padding: '18px',
        },
      }
    );
    return;
  }

  // MILESTONES - Intervalos variados (10, 20, 30, 40, 50)
  const milestones = [10, 20, 30, 40, 50];

  for (const milestone of milestones) {
    // Mostrar apenas quando atingir exatamente o milestone (não repetir)
    if (newTotal === milestone && state.lastMilestone < milestone) {
      state.lastMilestone = milestone;
      savePopupState(state);

      const messages = MILESTONE_MESSAGES[milestone as keyof typeof MILESTONE_MESSAGES];
      const msg = messages[Math.floor(Math.random() * messages.length)];

      if (msg.cta) {
        // Milestones com CTA (call-to-action)
        toast(
          <div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
              {msg.emoji} {msg.title}
            </div>
            <div style={{ marginBottom: '12px' }}>{msg.message}</div>
            <button
              onClick={() => {
                window.location.href = '/pricing';
              }}
              style={{
                background: '#fff',
                color: '#f97316',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Ver Planos Premium →
            </button>
          </div>,
          {
            duration: 12000,
            icon: msg.emoji,
            style: {
              background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
              color: '#fff',
              fontSize: '15px',
              padding: '20px',
              minWidth: '300px',
            },
          }
        );
      } else {
        // Milestones motivacionais simples
        toast.success(
          `${msg.emoji} ${msg.title}\n\n${msg.message}`,
          {
            duration: 6000,
            style: {
              fontSize: '15px',
              padding: '18px',
            },
          }
        );
      }

      return; // Mostrar apenas um popup por vez
    }
  }
}

/**
 * Mostrar mensagem de boas-vindas ao comprar plano
 */
export function showWelcomePurchasePopup(tier: string) {
  const state = getPopupState();

  // Evitar mostrar múltiplas vezes no mesmo dia
  const today = new Date().toDateString();
  if (state.purchaseDate === today) {
    return;
  }

  state.purchaseDate = today;
  savePopupState(state);

  const welcome = WELCOME_PURCHASE_MESSAGES[tier as keyof typeof WELCOME_PURCHASE_MESSAGES];

  if (!welcome) return;

  // Popup especial com confete (simulado com emoji)
  toast(
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '48px', marginBottom: '12px' }}>
        {welcome.emoji}
      </div>
      <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>
        {welcome.title}
      </div>
      <div style={{ fontSize: '14px', whiteSpace: 'pre-line', lineHeight: '1.6' }}>
        {welcome.message}
      </div>
    </div>,
    {
      duration: welcome.duration,
      style: {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: '#fff',
        padding: '24px',
        minWidth: '350px',
        maxWidth: '400px',
      },
    }
  );
}

/**
 * Resetar estado (para testes)
 */
export function resetPopupState() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
