import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  console.log('🚀 [START] Webhook received');

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const mercadoPagoToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

    if (!supabaseUrl || !supabaseServiceKey || !mercadoPagoToken) {
      console.error('❌ Missing env vars');
      return NextResponse.json({ error: 'Config incomplete' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    let paymentId: string | null = null;
    let webhookType: string | null = null;

    const topicParam = searchParams.get('topic') || searchParams.get('type');
    const idParam = searchParams.get('id');

    if (topicParam && idParam) {
      webhookType = topicParam;
      paymentId = idParam;
    } else {
      try {
        const body = await request.json();
        webhookType = body.type || body.topic;
        paymentId = body.data?.id || body.id;
      } catch (e) {
        console.log('⚠️ Body parse failed');
      }
    }

    if (webhookType !== 'payment') {
      console.log('ℹ️ Non-payment webhook:', webhookType);
      return NextResponse.json({ success: true });
    }

    if (!paymentId) {
      console.error('❌ Payment ID missing');
      return NextResponse.json({ error: 'ID missing' }, { status: 400 });
    }

    console.log('📦 Payment ID:', paymentId);

    // CRITICAL: AWAIT with timeout to prevent function termination
    console.log('⏱️ Starting payment processing with 25s timeout...');

    const processingPromise = processPayment(
      paymentId,
      supabaseUrl,
      supabaseServiceKey,
      mercadoPagoToken
    );

    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => {
        console.log('⏱️ 25s timeout reached, returning to MP anyway');
        resolve({ timeout: true });
      }, 25000); // 25s - safe margin before Vercel's 30s limit
    });

    await Promise.race([processingPromise, timeoutPromise]);

    console.log('✅ Returning 200 to Mercado Pago');
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('❌ [WEBHOOK ERROR]:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

async function processPayment(
  paymentId: string,
  supabaseUrl: string,
  supabaseServiceKey: string,
  mercadoPagoToken: string
) {
  console.log('🔄 [1] Processing payment:', paymentId);

  try {
    // Step 1: Fetch WITHOUT timeout (let Vercel's default 60s limit handle it)
    console.log('📡 [2] Fetching from MP...');
    console.log('🔑 [2a] Using token:', mercadoPagoToken.substring(0, 15) + '...');
    console.log('🔗 [2b] URL:', `https://api.mercadopago.com/v1/payments/${paymentId}`);

    let paymentResponse;
    try {
      paymentResponse = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${mercadoPagoToken}`,
            'Content-Type': 'application/json',
          },
          // NO timeout/signal - let it take as long as needed
        }
      );
      console.log('✅ [3] Fetch completed. Status:', paymentResponse.status);
      console.log('✅ [3a] Status text:', paymentResponse.statusText);
    } catch (fetchErr) {
      console.error('❌ [3] Fetch error:', fetchErr);
      console.error('❌ [3a] Error name:', fetchErr?.constructor?.name);
      console.error('❌ [3b] Error message:', fetchErr instanceof Error ? fetchErr.message : String(fetchErr));
      throw fetchErr;
    }

    if (!paymentResponse.ok) {
      const errorText = await paymentResponse.text();
      console.error('❌ [3c] Non-OK response body:', errorText);
      return;
    }

    // Step 2: Parse JSON
    console.log('📄 [4] Parsing JSON...');
    let payment;
    try {
      const text = await paymentResponse.text();
      console.log('📄 [4a] Response length:', text.length, 'bytes');
      payment = JSON.parse(text);
      console.log('✅ [5] Parsed successfully');
      console.log('✅ [5a] Payment status:', payment.status);
      console.log('✅ [5b] Payment ID:', payment.id);
    } catch (parseErr) {
      console.error('❌ [4] JSON parse error:', parseErr);
      throw parseErr;
    }

    // Step 3: Check approval
    if (payment.status !== 'approved') {
      console.log('⏳ [6] Payment not approved yet. Status:', payment.status);
      return;
    }

    console.log('✅ [6] Payment is APPROVED');

    // Step 4: Extract metadata
    console.log('📋 [7] Extracting metadata...');
    const metadata = payment.metadata || {};
    console.log('📋 [7a] Full metadata:', JSON.stringify(metadata, null, 2));

    const tier = metadata.tier;
    const billingCycle = metadata.billing_cycle || metadata.billingCycle;
    const userId = metadata.user_id || metadata.userId;

    console.log('📋 [7b] Extracted:', { tier, billingCycle, userId });

    if (!tier || !userId) {
      console.error('❌ [7c] Missing required metadata. Tier:', tier, 'UserID:', userId);
      return;
    }

    // Step 5: Calculate dates
    console.log('📅 [8] Calculating subscription period...');
    const now = new Date();
    let periodEnd: Date;

    if (tier === 'test') {
      periodEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    } else if (billingCycle === 'lifetime') {
      periodEnd = new Date(now.getFullYear() + 100, now.getMonth(), now.getDate());
    } else if (billingCycle === 'yearly') {
      periodEnd = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
    } else {
      periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    }

    console.log('📅 [8a] Period start:', now.toISOString());
    console.log('📅 [8b] Period end:', periodEnd.toISOString());

    // Step 6: Save to Supabase
    console.log('💾 [9] Initializing Supabase client...');
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const subscriptionData = {
      user_id: userId,
      tier,
      status: 'active',
      billing_cycle: billingCycle,
      current_period_start: now.toISOString(),
      current_period_end: periodEnd.toISOString(),
      mercadopago_payment_id: payment.id.toString(),
    };

    console.log('💾 [9a] Data to upsert:', JSON.stringify(subscriptionData, null, 2));

    const { data, error } = await supabase
      .from('subscriptions')
      .upsert(subscriptionData, { onConflict: 'user_id' })
      .select();

    if (error) {
      console.error('❌ [9b] Supabase error code:', error.code);
      console.error('❌ [9c] Supabase error message:', error.message);
      console.error('❌ [9d] Supabase error details:', error.details);
      console.error('❌ [9e] Supabase error hint:', error.hint);
      throw error;
    }

    console.log('✅ [10] Supabase upsert successful');
    console.log('✅ [10a] Returned data:', JSON.stringify(data, null, 2));
    console.log('');
    console.log('🎉🎉🎉 SUBSCRIPTION ACTIVATED SUCCESSFULLY 🎉🎉🎉');
    console.log('🎉 User ID:', userId);
    console.log('🎉 Tier:', tier);
    console.log('🎉 Billing:', billingCycle);
    console.log('🎉 Expires:', periodEnd.toISOString());
    console.log('');

  } catch (error) {
    console.error('');
    console.error('❌❌❌ FATAL ERROR IN PAYMENT PROCESSING ❌❌❌');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('');
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Active', timestamp: new Date().toISOString() });
}
