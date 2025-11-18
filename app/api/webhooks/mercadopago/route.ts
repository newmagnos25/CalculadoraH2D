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

    // CRITICAL: Don't await - fire and forget to avoid timeout
    processPayment(paymentId, supabaseUrl, supabaseServiceKey, mercadoPagoToken)
      .catch(err => console.error('❌ [ASYNC ERROR]:', err));

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
    // Step 1: Fetch with timeout
    console.log('📡 [2] Fetching from MP...');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    let paymentResponse;
    try {
      paymentResponse = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            'Authorization': `Bearer ${mercadoPagoToken}`,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);
      console.log('✅ [3] Fetch OK:', paymentResponse.status);
    } catch (fetchErr) {
      clearTimeout(timeoutId);
      console.error('❌ [3] Fetch failed:', fetchErr);
      throw fetchErr;
    }

    if (!paymentResponse.ok) {
      console.error('❌ [3] Non-OK status:', paymentResponse.status);
      return;
    }

    // Step 2: Parse JSON with explicit error handling
    console.log('📄 [4] Parsing JSON...');
    let payment;
    try {
      const text = await paymentResponse.text();
      console.log('📄 [4a] Raw response length:', text.length);
      payment = JSON.parse(text);
      console.log('✅ [5] Parsed. Status:', payment.status);
    } catch (parseErr) {
      console.error('❌ [4] Parse failed:', parseErr);
      throw parseErr;
    }

    // Step 3: Check approval
    if (payment.status !== 'approved') {
      console.log('⏳ [5] Not approved:', payment.status);
      return;
    }

    // Step 4: Extract metadata
    console.log('📋 [6] Extracting metadata...');
    const tier = payment.metadata?.tier;
    const billingCycle = payment.metadata?.billing_cycle || payment.metadata?.billingCycle;
    const userId = payment.metadata?.user_id || payment.metadata?.userId;

    console.log('📋 [6] Metadata:', { tier, billingCycle, userId });

    if (!tier || !userId) {
      console.error('❌ [6] Incomplete metadata');
      return;
    }

    // Step 5: Calculate dates
    console.log('📅 [7] Calculating dates...');
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

    // Step 6: Save to Supabase
    console.log('💾 [8] Saving to Supabase...');
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

    console.log('📝 [8] Data:', subscriptionData);

    const { data, error } = await supabase
      .from('subscriptions')
      .upsert(subscriptionData, { onConflict: 'user_id' })
      .select();

    if (error) {
      console.error('❌ [8] Supabase error:', error);
      throw error;
    }

    console.log('✅✅✅ [SUCCESS] Subscription saved');
    console.log('🎉 User:', userId, '| Tier:', tier);

  } catch (error) {
    console.error('❌❌❌ [FATAL]:', error);
    console.error('Type:', error?.constructor?.name);
    console.error('Message:', error instanceof Error ? error.message : String(error));
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Active', timestamp: new Date().toISOString() });
}
