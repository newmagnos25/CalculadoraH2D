import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Endpoint ADMIN para ativar assinatura manualmente
 *
 * USO:
 * POST /api/admin/activate-subscription
 * Body: {
 *   "user_email": "email@exemplo.com",
 *   "tier": "test",
 *   "days": 7
 * }
 *
 * IMPORTANTE: Este endpoint deve ser protegido em produção!
 */
export async function POST(request: NextRequest) {
  try {
    // 🔒 SEGURANÇA: Verificar senha admin (por enquanto hardcoded)
    const authHeader = request.headers.get('authorization');
    const adminSecret = process.env.ADMIN_SECRET || 'admin-secret-2024';

    if (authHeader !== `Bearer ${adminSecret}`) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { user_email, tier, days } = body;

    if (!user_email || !tier) {
      return NextResponse.json(
        { error: 'user_email e tier são obrigatórios' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Buscar usuário por email
    const { data: authUser, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.error('Erro ao listar usuários:', authError);
      return NextResponse.json(
        { error: 'Erro ao buscar usuário' },
        { status: 500 }
      );
    }

    const user = authUser.users.find(u => u.email === user_email);

    if (!user) {
      return NextResponse.json(
        { error: `Usuário com email ${user_email} não encontrado` },
        { status: 404 }
      );
    }

    // 2. Calcular data de expiração
    const now = new Date();
    let periodEnd: Date;

    if (days) {
      // Usar dias customizados
      periodEnd = new Date(now);
      periodEnd.setDate(periodEnd.getDate() + days);
    } else if (tier === 'test') {
      // Plano teste: 7 dias
      periodEnd = new Date(now);
      periodEnd.setDate(periodEnd.getDate() + 7);
    } else if (tier === 'lifetime') {
      // Lifetime: 100 anos
      periodEnd = new Date(now.getFullYear() + 100, now.getMonth(), now.getDate());
    } else {
      // Mensal por padrão: 30 dias
      periodEnd = new Date(now);
      periodEnd.setDate(periodEnd.getDate() + 30);
    }

    // 3. Criar/atualizar assinatura
    const { error: subError, data: subscription } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: user.id,
        tier,
        status: 'active',
        billing_cycle: tier === 'lifetime' ? 'lifetime' : 'monthly',
        current_period_start: now.toISOString(),
        current_period_end: periodEnd.toISOString(),
        mercadopago_payment_id: `manual-activation-${Date.now()}`,
      }, {
        onConflict: 'user_id',
      })
      .select();

    if (subError) {
      console.error('Erro ao criar assinatura:', subError);
      return NextResponse.json(
        { error: 'Erro ao ativar assinatura', details: subError },
        { status: 500 }
      );
    }

    console.log('✅ Assinatura ativada manualmente:', {
      userId: user.id,
      email: user_email,
      tier,
      periodEnd: periodEnd.toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Assinatura ativada com sucesso',
      data: {
        user_id: user.id,
        email: user_email,
        tier,
        status: 'active',
        period_end: periodEnd.toISOString(),
      }
    });

  } catch (error) {
    console.error('Erro ao ativar assinatura:', error);
    return NextResponse.json(
      { error: 'Erro interno', details: String(error) },
      { status: 500 }
    );
  }
}
