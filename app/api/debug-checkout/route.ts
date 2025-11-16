import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  return NextResponse.json({
    hasAccessToken: !!accessToken,
    accessTokenPrefix: accessToken?.substring(0, 20) + '...',
    hasPublicKey: !!publicKey,
    publicKeyPrefix: publicKey?.substring(0, 20) + '...',
    appUrl: appUrl,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  try {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'MERCADOPAGO_ACCESS_TOKEN não configurado' },
        { status: 500 }
      );
    }

    // Criar preferência de teste simples
    const preferenceData = {
      items: [
        {
          title: 'Teste de Pagamento',
          description: 'Teste simples para debug',
          quantity: 1,
          unit_price: 10.00,
          currency_id: 'BRL',
        },
      ],
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/failure`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/pending`,
      },
      auto_return: 'approved' as const,
    };

    console.log('🔍 Debug - Sending to Mercado Pago:', {
      url: 'https://api.mercadopago.com/checkout/preferences',
      accessTokenPrefix: accessToken.substring(0, 20) + '...',
      preferenceData,
    });

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(preferenceData),
    });

    const responseData = await response.json();

    console.log('🔍 Debug - Mercado Pago Response:', {
      status: response.status,
      statusText: response.statusText,
      data: responseData,
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: 'Erro na API do Mercado Pago',
          status: response.status,
          statusText: response.statusText,
          details: responseData,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      preference_id: responseData.id,
      init_point: responseData.init_point,
      sandbox_init_point: responseData.sandbox_init_point,
      full_response: responseData,
    });

  } catch (error) {
    console.error('🔍 Debug - Error:', error);
    return NextResponse.json(
      {
        error: 'Erro ao processar',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
