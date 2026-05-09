import { NextRequest, NextResponse } from 'next/server';

import { AuthService } from './auth/service';

const publicRoutes = ['/login'];
 
export default async function proxy(req: NextRequest) {
	if (!publicRoutes.includes(req.nextUrl.pathname)) {
		try {
			await new AuthService().check();
		} catch {
			return NextResponse.redirect(new URL('/login', req.nextUrl));
		}
	}
	return NextResponse.next();
}
 
// Routes Proxy should not run on
export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};