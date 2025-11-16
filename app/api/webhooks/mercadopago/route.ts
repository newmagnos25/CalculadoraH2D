import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('🔔 Webhook Mercado Pago recebido:', JSON.stringify(body, null, 2));

    // Mercado Pago envia notificações de pagamento
    if (body.type === 'payment') {
      const paymentId = body.data.id;

      // Buscar detalhes do pagamento
      const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

      const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!paymentResponse.ok) {
        console.error('Erro ao buscar detalhes do pagamento');
        return NextResponse.json({ error: 'Erro ao buscar pagamento' }, { status: 500 });
      }

      const payment = await paymentResponse.json();

      console.log('💳 Detalhes do pagamento:', {
        id: payment.id,
        status: payment.status,
        metadata: payment.metadata,
        payer_email: payment.payer?.email,
      });

      // Se o pagamento foi aprovado
      if (payment.status === 'approved') {
        const tier = payment.metadata?.tier;
        const billingCycle = payment.metadata?.billing_cycle;
        const payerEmail = payment.payer?.email;

        if (!tier || !payerEmail) {
          console.error('Metadados incompletos no pagamento');
          return NextResponse.json({ error: 'Metadados incompletos' }, { status: 400 });
        }

        // Usar service role key para acessar o Supabase sem autenticação
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Buscar usuário pelo email
        const { data: users, error: userError } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', payerEmail)
          .limit(1);

        if (userError || !users || users.length === 0) {
          console.error('Usuário não encontrado:', payerEmail);
          return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
        }

        const userId = users[0].id;

        // Calcular data de expiração
        const now = new Date();
        let periodEnd: Date;

        if (billingCycle === 'lifetime') {
          // Lifetime: 100 anos no futuro (praticamente vitalício)
          periodEnd = new Date(now.getFullYear() + 100, now.getMonth(), now.getDate());
        } else if (billingCycle === 'yearly') {
          // Anual: + 1 ano
          periodEnd = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
        } else {
          // Mensal: + 1 mês
          periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
        }

        // Atualizar ou criar assinatura
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
          console.error('Erro ao atualizar assinatura:', subError);
          return NextResponse.json({ error: 'Erro ao ativar assinatura' }, { status: 500 });
        }

        console.log('✅ Assinatura ativada com sucesso:', {
          userId,
          tier,
          billingCycle,
          periodEnd: periodEnd.toISOString(),
        });

        return NextResponse.json({ success: true, message: 'Assinatura ativada' });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro no webhook:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// Mercado Pago também pode enviar GET para validar o endpoint
export async function GET() {
  return NextResponse.json({ status: 'Webhook ativo' });
}
