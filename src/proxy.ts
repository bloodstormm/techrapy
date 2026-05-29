import { createServerClient, type CookieMethodsServer } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(req: NextRequest) {
    let supabaseResponse = NextResponse.next({ request: req });

    const cookies: CookieMethodsServer = {
        getAll() {
            return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
            supabaseResponse = NextResponse.next({ request: req });
            cookiesToSet.forEach(({ name, value, options }) =>
                supabaseResponse.cookies.set(name, value, options)
            );
        },
    };

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        { cookies } satisfies { cookies: CookieMethodsServer }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (req.nextUrl.pathname === '/login' && user) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    if (!user && !isPublicRoute(req.nextUrl.pathname)) {
        const url = req.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}

function isPublicRoute(pathname: string) {
    const publicRoutes = ['/login', '/register', '/api', '/_next', '/favicon.ico'];
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
