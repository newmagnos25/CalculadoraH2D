import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  console.log('🚀 Webhook recebido');

  try {
    // 1. VALIDAR VARIÁVEIS DE AMBIENTE
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const mercadoPagoToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

    if (!supabaseUrl || !supabaseServiceKey || !mercadoPagoToken) {
      console.error('❌ Variáveis de ambiente faltando');
      return NextResponse.json({ error: 'Configuração incompleta' }, { status: 500 });
    }

    // 2. LER DADOS DO WEBHOOK (suporta body JSON e query params)
    const { searchParams } = new URL(request.url);
    let paymentId: string | null = null;
    let webhookType: string | null = null;

    // Tentar ler do query params primeiro (formato IPN antigo)
    const topicParam = searchParams.get('topic') || searchParams.get('type');
    const idParam = searchParams.get('id');

    if (topicParam && idParam) {
      // Formato: ?topic=payment&id=123456
      webhookType = topicParam;
      paymentId = idParam;
      console.log('📦 Webhook via query params - Tipo:', webhookType, '| ID:', paymentId);
    } else {
      // Tentar ler do body JSON (formato novo)
      try {
        const body = await request.json();
        webhookType = body.type || body.topic;
        paymentId = body.data?.id || body.id;
        console.log('📦 Webhook via JSON body - Tipo:', webhookType, '| ID:', paymentId);
      } catch (e) {
        console.log('⚠️ Não conseguiu ler JSON do body, usando query params');
      }
    }

    // 3. RESPONDER IMEDIATAMENTE (CRÍTICO!)
    // Mercado Pago precisa de resposta em < 5 segundos
    if (webhookType !== 'payment') {
      console.log('ℹ️ Webhook não é de pagamento, ignorando:', webhookType);
      return NextResponse.json({ success: true });
    }

    if (!paymentId) {
      console.error('❌ ID do pagamento não encontrado');
      return NextResponse.json({ error: 'ID não encontrado' }, { status: 400 });
    }

    // 4. PROCESSAR DE FORMA ASSÍNCRONA (não bloqueia a resposta)
    processPayment(paymentId, supabaseUrl, supabaseServiceKey, mercadoPagoToken)
      .catch(err => console.error('❌ Erro no processamento:', err));

    // 5. RETORNAR SUCESSO IMEDIATAMENTE
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('❌ Erro no webhook:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// Função assíncrona para processar o pagamento
async function processPayment(
  paymentId: string,
  supabaseUrl: string,
  supabaseServiceKey: string,
  mercadoPagoToken: string
) {
  console.log('🔄 Processando pagamento:', paymentId);

  try {
    // Buscar detalhes do pagamento
    const paymentResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: { 'Authorization': `Bearer ${mercadoPagoToken}` },
      }
    );

    if (!paymentResponse.ok) {
      throw new Error(`Erro ao buscar pagamento: ${paymentResponse.status}`);
    }

    const payment = await paymentResponse.json();
    console.log('💳 Status do pagamento:', payment.status);

    // Só processar se aprovado
    if (payment.status !== 'approved') {
      console.log('⏳ Pagamento não aprovado ainda:', payment.status);
      return;
    }

    // Extrair metadados
    const tier = payment.metadata?.tier;
    const billingCycle = payment.metadata?.billing_cycle;
    const userId = payment.metadata?.user_id;

    console.log('📋 Metadados:', { tier, billingCycle, userId });

    if (!tier || !userId) {
      throw new Error('Metadados incompletos no pagamento');
    }

    // Criar cliente Supabase
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verificar se usuário existe
    const { data: existingUser, error: userError } = await supabase.auth.admin.getUserById(userId);

    if (userError || !existingUser) {
      throw new Error(`Usuário não encontrado: ${userId}`);
    }

    console.log('✅ Usuário encontrado:', existingUser.user.email);

    // Calcular data de expiração
    const now = new Date();
    let periodEnd: Date;

    if (tier === 'test') {
      periodEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 dias
    } else if (billingCycle === 'lifetime') {
      periodEnd = new Date(now.getFullYear() + 100, now.getMonth(), now.getDate()); // +100 anos
    } else if (billingCycle === 'yearly') {
      periodEnd = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()); // +1 ano
    } else {
      periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()); // +1 mês
    }

    // Atualizar assinatura
    const { error: subError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        tier,
        status: 'active',
        billing_cycle: billingCycle,
        current_period_start: now.toISOString(),
        current_period_end: periodEnd.toISOString(),
        mercadopago_payment_id: payment.id.toString(),
      }, {
        onConflict: 'user_id',
      });

    if (subError) {
      throw new Error(`Erro ao atualizar assinatura: ${subError.message}`);
    }

    console.log('✅ Assinatura ativada:', {
      userId,
      tier,
      billingCycle,
      periodEnd: periodEnd.toISOString(),
    });

  } catch (error) {
    console.error('❌ Erro no processamento:', error);
    throw error;
  }
}

// GET para teste
export async function GET() {
  return NextResponse.json({ 
    status: 'Webhook ativo',
    timestamp: new Date().toISOString() 
  });
}
