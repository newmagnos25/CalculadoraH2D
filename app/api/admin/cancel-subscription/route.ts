import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Endpoint ADMIN para cancelar/reativar assinatura
 *
 * USO:
 * POST /api/admin/cancel-subscription
 * Body: {
 *   "user_email": "email@exemplo.com",
 *   "action": "cancel" ou "reactivate"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar variáveis de ambiente
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        {
          error: 'Configuração do servidor incompleta',
          details: 'SUPABASE_SERVICE_ROLE_KEY não configurada'
        },
        { status: 500 }
      );
    }

    // 🔒 SEGURANÇA: Verificar senha admin
    const authHeader = request.headers.get('authorization');
    const adminSecret = process.env.ADMIN_SECRET || 'admin-secret-2024';

    if (authHeader !== `Bearer ${adminSecret}`) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { user_email, action } = body;

    if (!user_email || !action) {
      return NextResponse.json(
        { error: 'user_email e action são obrigatórios' },
        { status: 400 }
      );
    }

    if (action !== 'cancel' && action !== 'reactivate') {
      return NextResponse.json(
        { error: 'action deve ser "cancel" ou "reactivate"' },
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

    // 2. Buscar assinatura existente
    const { data: existingSub, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (subError || !existingSub) {
      return NextResponse.json(
        { error: 'Assinatura não encontrada para este usuário' },
        { status: 404 }
      );
    }

    // 3. Cancelar ou reativar
    const now = new Date();
    const updateData: any = {
      updated_at: now.toISOString(),
    };

    if (action === 'cancel') {
      updateData.status = 'canceled';
      updateData.canceled_at = now.toISOString();
    } else {
      updateData.status = 'active';
      updateData.canceled_at = null;
    }

    const { error: updateError } = await supabase
      .from('subscriptions')
      .update(updateData)
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Erro ao atualizar assinatura:', updateError);
      return NextResponse.json(
        { error: 'Erro ao atualizar assinatura', details: updateError },
        { status: 500 }
      );
    }

    console.log(`✅ Assinatura ${action === 'cancel' ? 'cancelada' : 'reativada'}:`, {
      userId: user.id,
      email: user_email,
      action,
    });

    return NextResponse.json({
      success: true,
      message: `Assinatura ${action === 'cancel' ? 'cancelada' : 'reativada'} com sucesso`,
      data: {
        user_id: user.id,
        email: user_email,
        status: action === 'cancel' ? 'canceled' : 'active',
        tier: existingSub.tier,
      }
    });

  } catch (error) {
    console.error('Erro ao processar cancelamento:', error);
    return NextResponse.json(
      { error: 'Erro interno', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * Endpoint para usuário cancelar própria assinatura (autenticado)
 */
export async function DELETE(request: NextRequest) {
  try {
    // TODO: Implementar cancelamento pelo próprio usuário
    // Precisa verificar autenticação via cookie/session
    return NextResponse.json(
      { error: 'Em desenvolvimento - use o endpoint POST por enquanto' },
      { status: 501 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro interno', details: String(error) },
      { status: 500 }
    );
  }
}
