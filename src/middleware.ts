import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || "cutnstitch-super-secret-key-123"
);

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const isDashboard = pathname.startsWith('/admin/dashboard');
    const isLoginRoute = pathname === '/admin/login';
    const isProtectedApi = (pathname.startsWith('/api/product-stock') || pathname.startsWith('/api/product-pricing') || pathname.startsWith('/api/admin/logout')) && req.method !== 'GET';

    if (!isDashboard && !isProtectedApi && !isLoginRoute) {
        return NextResponse.next();
    }

    const token = req.cookies.get('admin_session')?.value;

    if (isLoginRoute) {
        if (token) {
            try {
                await jwtVerify(token, SECRET_KEY);
                return NextResponse.redirect(new URL('/admin/dashboard', req.url));
            } catch (error) {
                return NextResponse.next();
            }
        }
        return NextResponse.next();
    }

    if (!token) {
        if (isProtectedApi) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    try {
        await jwtVerify(token, SECRET_KEY);
        return NextResponse.next();
    } catch (error) {
        if (isProtectedApi) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.redirect(new URL('/admin/login', req.url));
    }
}

export const config = {
    matcher: ['/admin/:path*', '/api/:path*'],
};
