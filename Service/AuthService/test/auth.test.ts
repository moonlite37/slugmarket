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
	it('redirects to google', async () => {
		const res = await request.get('/api/v0/oauthlogin');
		expect(res.headers.location).toContain('accounts.google.com');
	});

	it('clicks cancel on google login', async () => {
		const res = await request.get('/api/v0/oauthlogin/callback?error=access_denied');
		expect(res.body).toEqual({});
	});

	it('same uuid returned for same user on re-login', async () => {
		await request.get('/api/v0/oauthlogin/callback?code=fakeCode');
		await request.get('/api/v0/oauthlogin/callback?code=fakeCode');

		const calls = (EncryptJWT as ReturnType<typeof vi.fn>).mock.calls;
		expect(calls[0][0].id).toBe(calls[1][0].id);
	});
});
