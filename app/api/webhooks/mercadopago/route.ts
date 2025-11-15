import { NextRequest, NextResponse } from 'next/server';

/**
 * Webhook handler for Mercado Pago payment notifications
 *
 * This endpoint receives notifications from Mercado Pago when:
 * - Payment is approved
 * - Payment is rejected
 * - Payment is pending
 * - Subscription is created/updated/canceled
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('Mercado Pago Webhook received:', {
      id: body.id,
      type: body.type,
      action: body.action,
    });

    // Mercado Pago sends different types of notifications
    const notificationType = body.type;

    switch (notificationType) {
      case 'payment':
        return handlePaymentNotification(body);

      case 'plan':
      case 'subscription':
        return handleSubscriptionNotification(body);

      default:
        console.log('Unhandled notification type:', notificationType);
        return NextResponse.json({ status: 'ignored' }, { status: 200 });
    }

  } catch (error) {
    console.error('Webhook processing error:', error);
    // Always return 200 to prevent Mercado Pago from retrying
    return NextResponse.json({ status: 'error' }, { status: 200 });
  }
}

async function handlePaymentNotification(body: any) {
  const paymentId = body.data?.id;

  if (!paymentId) {
    console.error('Payment ID not found in webhook');
    return NextResponse.json({ status: 'error' }, { status: 200 });
  }

  try {
    // Fetch payment details from Mercado Pago
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

    if (!accessToken) {
      console.error('MERCADOPAGO_ACCESS_TOKEN not configured');
      return NextResponse.json({ status: 'error' }, { status: 200 });
    }

    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch payment from Mercado Pago');
      return NextResponse.json({ status: 'error' }, { status: 200 });
    }

    const payment = await response.json();

    console.log('Payment details:', {
      id: payment.id,
      status: payment.status,
      status_detail: payment.status_detail,
      transaction_amount: payment.transaction_amount,
      metadata: payment.metadata,
    });

    // TODO: Save payment to Supabase database
    // TODO: Update user subscription status based on payment status

    switch (payment.status) {
      case 'approved':
        console.log('✅ Payment approved:', payment.id);
        // TODO: Activate user subscription
        // await activateSubscription(payment.metadata.tier, payment.metadata.billing_cycle);
        break;

      case 'pending':
        console.log('⏳ Payment pending:', payment.id);
        // TODO: Mark payment as pending in database
        break;

      case 'rejected':
      case 'cancelled':
        console.log('❌ Payment rejected/cancelled:', payment.id);
        // TODO: Handle payment failure
        break;

      default:
        console.log('Unknown payment status:', payment.status);
    }

    return NextResponse.json({ status: 'processed' }, { status: 200 });

  } catch (error) {
    console.error('Error processing payment notification:', error);
    return NextResponse.json({ status: 'error' }, { status: 200 });
  }
}

async function handleSubscriptionNotification(body: any) {
  const subscriptionId = body.data?.id;

  console.log('Subscription notification received:', {
    id: subscriptionId,
    action: body.action,
  });

  // TODO: Implement subscription handling when using recurring payments

  return NextResponse.json({ status: 'processed' }, { status: 200 });
}

/**
 * GET handler for webhook verification (optional)
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Mercado Pago Webhook Endpoint',
    status: 'active',
  });
}
