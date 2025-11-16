import { NextRequest, NextResponse } from 'next/server';
import { TIER_CONFIGS, SubscriptionTier } from '@/lib/types/database';

export async function POST(request: NextRequest) {
  try {
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

    if (!accessToken) {
      console.error('MERCADOPAGO_ACCESS_TOKEN não configurado');
      return NextResponse.json(
        { error: 'Pagamento temporariamente indisponível. Configure o Mercado Pago.' },
        { status: 500 }
      );
    }

    // Create preference for Mercado Pago
    const preferenceData = {
      items: [
        {
          title: `CalculadoraH2D PRO - ${tierConfig.name}`,
          description: tier === 'lifetime'
            ? 'Acesso vitalício ao CalculadoraH2D PRO'
            : `Assinatura ${billing_cycle === 'monthly' ? 'Mensal' : 'Anual'}`,
          quantity: 1,
          unit_price: price,
          currency_id: 'BRL',
        },
      ],
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/failure`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/pending`,
      },
      auto_return: 'approved' as const,
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/webhooks/mercadopago`,
      metadata: {
        tier,
        billing_cycle: tier === 'lifetime' ? 'lifetime' : billing_cycle,
      },
      payment_methods: {
        excluded_payment_types: [],
        installments: 12, // Allow up to 12 installments
      },
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
