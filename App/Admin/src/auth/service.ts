import 'server-only';

import { cookies } from 'next/headers';

import { Credentials, Authenticated, SessionUser } from '.';

export class AuthService {
	public async login(credentials: Credentials): Promise<Authenticated> {
		return new Promise((resolve, reject) => {
			fetch('http://localhost:3010/api/v0/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: credentials.email,
					password: credentials.password,
				}),
			})
				.then((res) => {
					if (res.status !== 200) {
						 throw 'Unauthorized';
					}
					return res.json();
				})
				.then(async (data) => {
					const cookieStore = await cookies();
					const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
					cookieStore.set('session', data.authToken, {
						httpOnly: true,
						secure: process.env.NODE_ENV === 'production',
						expires: expiresAt,
						sameSite: 'lax',
						path: '/',
					});
					resolve(data);
				})
				.catch((error) => reject(error));
		});
	}

	public async check(): Promise<SessionUser> {
		const cookieStore = await cookies();
		const token = cookieStore.get('session')?.value;
		if (!token) {
			throw new Error('No session');
		}
		const res = await fetch('http://localhost:3010/api/v0/check', {
			headers: {
				'Authorization': `Bearer ${token}`,
			},
		});
		if (res.status !== 200) {
			throw new Error('Unauthorized');
		}
		return res.json();
	}
}
