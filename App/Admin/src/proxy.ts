import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = ['/login'];

export default async function proxy(req: NextRequest) {
	const path = req.nextUrl.pathname;
	console.log('PROXY HIT:', path);
	if (!publicRoutes.includes(path)) {
		const session = req.cookies.get('session');
		if (!session) {
			console.log('PROXY: no session, redirecting');
			return NextResponse.redirect(new URL('/login', req.nextUrl));
		}
	}
	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};
