import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Endpoint ADMIN para confirmar email manualmente
 *
 * USO:
 * POST /api/admin/confirm-email
 * Body: {
 *   "email": "email@exemplo.com"
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
          details: 'SUPABASE_SERVICE_ROLE_KEY não configurada no Vercel'
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
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'email é obrigatório' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Buscar usuário por email
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.error('Erro ao listar usuários:', authError);
      return NextResponse.json(
        { error: 'Erro ao buscar usuário' },
        { status: 500 }
      );
    }

    const user = authData.users.find(u => u.email === email);

    if (!user) {
      return NextResponse.json(
        { error: `Usuário com email ${email} não encontrado` },
        { status: 404 }
      );
    }

    // 2. Verificar se já está confirmado
    if (user.email_confirmed_at) {
      return NextResponse.json({
        success: true,
        message: 'Email já estava confirmado',
        data: {
          email,
          confirmed_at: user.email_confirmed_at
        }
      });
    }

    // 3. Confirmar email manualmente
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      {
        email_confirm: true
      }
    );

    if (updateError) {
      console.error('Erro ao confirmar email:', updateError);
      return NextResponse.json(
        { error: 'Erro ao confirmar email', details: updateError },
        { status: 500 }
      );
    }

    console.log('✅ Email confirmado manualmente:', {
      userId: user.id,
      email,
    });

    return NextResponse.json({
      success: true,
      message: 'Email confirmado com sucesso',
      data: {
        user_id: user.id,
        email,
        confirmed_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Erro ao confirmar email:', error);
    return NextResponse.json(
      { error: 'Erro interno', details: String(error) },
      { status: 500 }
    );
  }
}
