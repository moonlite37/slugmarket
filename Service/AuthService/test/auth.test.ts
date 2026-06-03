import { describe, expect, it, vi } from 'vitest';
import supertest from 'supertest';
import { request } from './setup';
import { EncryptJWT } from 'jose';
import { LoginTicket } from 'google-auth-library';
import { GetTokenResponse } from 'google-auth-library/build/src/auth/oauth2client';

vi.mock('jose', () => {
	return {
		EncryptJWT: vi.fn(
			class {
				setProtectedHeader = vi.fn().mockReturnThis();
				setIssuedAt = vi.fn().mockReturnThis();
				setExpirationTime = vi.fn().mockReturnThis();
				encrypt = vi.fn().mockResolvedValue('mocked-jwe');
			},
		),
		jwtDecrypt: vi.fn().mockResolvedValue({
			payload: { name: 'Mock Name' },
		}),
	};
});

vi.mock('google-auth-library', async (importOriginal) => {
	const actual = await importOriginal<typeof import('google-auth-library')>();
	return {
		OAuth2Client: class extends actual.OAuth2Client {
			override getToken = vi.fn(
				(): Promise<GetTokenResponse> =>
					Promise.resolve({
						tokens: { id_token: 'test-token' },
						res: null,
					} as GetTokenResponse),
			);

			override verifyIdToken = vi.fn(
				(): Promise<LoginTicket> =>
					Promise.resolve({
						getPayload: () => ({
							email: 'test@example.com',
							name: 'Test User',
							sub: 'test-sub-123',
						}),
					} as LoginTicket),
			);
		},
	};
});

export const Login = (
	email: string,
	password: string,
): Promise<supertest.Response> => {
	return request.post('/api/v0/login').send({ email, password });
};

describe('docs', () => {
	it('GET /api/v0/docs/', async () => {
		await request.get('/api/v0/docs/').expect(200);
	});
});

describe('login', () => {
	it('return code', async () => {
		const res = await Login('johnpork@email.com', 'johnpork');
		expect(res.status).toBe(200);
	});
	it('returns name', async () => {
		const res = await Login('johnpork@email.com', 'johnpork');
		expect(res.body.name).toBe('John Pork');
	});
	it('returns auth token', async () => {
		const res = await Login('johnpork@email.com', 'johnpork');
		expect(res.body.authToken).toBeDefined();
	});
	it('rejects fake cred', async () => {
		const res = await Login('johnny@email.com', 'johnpork');
		expect(res.status).toBe(401);
	});
});

describe('oauth login', () => {
	it('redirects to google for seller', async () => {
		const res = await request.get('/api/v0/oauthlogin?app=seller');
		expect(res.headers.location).toContain('accounts.google.com');
	});

	it('redirects to google for shopper', async () => {
		const res = await request.get('/api/v0/oauthlogin?app=shopper');
		expect(res.headers.location).toContain('accounts.google.com');
	});

	it('includes cart source as oauth state for shopper', async () => {
		const res = await request.get('/api/v0/oauthlogin?app=shopper&source=cart');
		const location = new URL(res.headers.location);
		expect(location.searchParams.get('state')).toBe('cart');
	});

	it('returns name for seller', async () => {
		const res = await request.get('/api/v0/oauthlogin/callback?code=fakeCode&app=seller');
		expect(res.body.name).toBe('Test User');
	});

	it('returns token for seller', async () => {
		const res = await request.get('/api/v0/oauthlogin/callback?code=fakeCode&app=seller');
		expect(res.body.authToken).toBeDefined();
	});

	it('returns name for shopper', async () => {
		const res = await request.get('/api/v0/oauthlogin/callback?code=fakeCode&app=shopper');
		expect(res.body.name).toBe('Test User');
	});

	it('returns token for shopper', async () => {
		const res = await request.get('/api/v0/oauthlogin/callback?code=fakeCode&app=shopper');
		expect(res.body.authToken).toBeDefined();
	});

	it('same uuid returned for same user on re-login', async () => {
		await request.get('/api/v0/oauthlogin/callback?code=fakeCode&app=seller');
		await request.get('/api/v0/oauthlogin/callback?code=fakeCode&app=seller');

		const calls = (EncryptJWT as ReturnType<typeof vi.fn>).mock.calls;
		expect(calls[0][0].id).toBe(calls[1][0].id);
	});
});
