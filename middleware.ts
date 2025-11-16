import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Atualizar session do Supabase
  const supabaseResponse = await updateSession(request)

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = [
    '/auth/login',
    '/auth/signup',
    '/pricing',
    '/debug-pagamento',
    '/teste-pagamento',
    '/api',
  ]

  const { pathname } = request.nextUrl

  // Permitir rotas públicas
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return supabaseResponse
  }

  // Verificar se usuário está logado
  const response = supabaseResponse
  const cookies = response.cookies
  const hasSession = cookies.getAll().some(cookie => cookie.name.includes('auth-token'))

  // Se não está logado e tentando acessar rota protegida
  if (!hasSession && !pathname.startsWith('/auth')) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
