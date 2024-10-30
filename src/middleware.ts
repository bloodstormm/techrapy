import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });
    
    try {
        const {
            data: { session },
        } = await supabase.auth.getSession();

        // Se estiver na página de login e tiver sessão, redireciona para home
        if (req.nextUrl.pathname === '/login' && session) {
            return NextResponse.redirect(new URL('/', req.url));
        }

        // Se não tiver sessão e não estiver em uma rota pública
        if (!session && !isPublicRoute(req.nextUrl.pathname)) {
            return NextResponse.redirect(new URL('/login', req.url));
        }

        return res;
    } catch (error) {
        console.error('Erro no middleware:', error);
        return NextResponse.redirect(new URL('/login', req.url));
    }
}

// Função auxiliar para verificar rotas públicas
function isPublicRoute(pathname: string) {
    const publicRoutes = [
        '/login',
        '/register',
        '/api',
        '/_next',
        '/favicon.ico'
    ];
    
    return publicRoutes.some(route => pathname.startsWith(route));
}

export const config = {
    matcher: [
        '/',
        '/login',
        '/register',
        '/all-patients/:path*',
        '/add-patient/:path*',
        '/patient-notes/:path*',
        '/add-therapist/:path*',
    ],
};