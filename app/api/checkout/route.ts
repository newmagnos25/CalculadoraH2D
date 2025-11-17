import { NextRequest, NextResponse } from 'next/server';
import { TIER_CONFIGS, SubscriptionTier } from '@/lib/types/database';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação PRIMEIRO
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Usuário não autenticado:', authError);
      return NextResponse.json(
        { error: 'Você precisa estar logado para fazer checkout' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { tier, billing_cycle } = body as {
      tier: SubscriptionTier;
      billing_cycle: 'monthly' | 'yearly';
    };

    // Validate tier
    if (!tier || !TIER_CONFIGS[tier]) {
      return NextResponse.json(
        { error: 'Plano inválido' },
        { status: 400 }
      );
    }

    // Validate billing cycle (except for lifetime)
    if (tier !== 'lifetime' && !billing_cycle) {
      return NextResponse.json(
        { error: 'Ciclo de cobrança não especificado' },
        { status: 400 }
      );
    }

    const tierConfig = TIER_CONFIGS[tier];
    const price = tier === 'lifetime'
      ? tierConfig.price_yearly
      : billing_cycle === 'monthly'
      ? tierConfig.price_monthly
      : tierConfig.price_yearly;

    // Get Mercado Pago access token from environment
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (!accessToken) {
      console.error('MERCADOPAGO_ACCESS_TOKEN não configurado');
      return NextResponse.json(
        { error: 'Pagamento temporariamente indisponível. Configure o Mercado Pago.' },
        { status: 500 }
      );
    }

    // Check if running on localhost (Mercado Pago doesn't accept localhost URLs)
    if (appUrl.includes('localhost') || appUrl.includes('127.0.0.1')) {
      console.warn('⚠️ Mercado Pago não aceita URLs localhost!');
      return NextResponse.json(
        {
          error: 'Mercado Pago não funciona em localhost',
          message: 'Para testar pagamentos, faça deploy na Vercel primeiro. Veja: GUIA-DEPLOY-VERCEL.md',
          appUrl
        },
        { status: 400 }
      );
    }

    // Create preference for Mercado Pago
    const preferenceData = {
      items: [
        {
          title: `Precifica3D PRO - ${tierConfig.name}`,
          description: tier === 'lifetime'
            ? 'Acesso vitalício ao Precifica3D PRO'
            : tier === 'test'
            ? 'Teste de 7 dias do Precifica3D PRO'
            : `Assinatura ${billing_cycle === 'monthly' ? 'Mensal' : 'Anual'}`,
          quantity: 1,
          unit_price: price,
          currency_id: 'BRL',
        },
      ],
      payer: {
        email: user.email || 'noreply@precifica3d.com', // Email real do usuário
      },
      back_urls: {
        success: `${appUrl}/checkout/success`,
        failure: `${appUrl}/checkout/failure`,
        pending: `${appUrl}/checkout/pending`,
      },
      auto_return: 'approved' as const,
      notification_url: `${appUrl}/api/webhooks/mercadopago`,
      metadata: {
        tier,
        billing_cycle: tier === 'lifetime' ? 'lifetime' : billing_cycle,
        user_id: user.id, // ← CRÍTICO: Envia user_id para o webhook conseguir ativar
        user_email: user.email, // ← Backup: email do usuário para logs
      },
      binary_mode: false,
      payment_methods: {
        excluded_payment_types: [],
        excluded_payment_methods: [],
        installments: 1,
        default_installments: 1,
      },
      marketplace: 'NONE' as const, // Não é marketplace - força checkout direto
      operation_type: 'regular_payment' as const, // Pagamento regular
    };

    // Call Mercado Pago API
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(preferenceData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Mercado Pago API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        preferenceData: JSON.stringify(preferenceData, null, 2)
      });
      return NextResponse.json(
        {
          error: 'Erro ao criar preferência de pagamento',
          details: errorData
        },
        { status: 500 }
      );
    }

    const preference = await response.json();

    console.log('✅ Mercado Pago Preference Created:', {
      preference_id: preference.id,
      init_point: preference.init_point,
      sandbox: preference.sandbox_init_point
    });

    return NextResponse.json({
      preference_id: preference.id,
      init_point: preference.init_point, // URL to redirect user to Mercado Pago checkout
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
