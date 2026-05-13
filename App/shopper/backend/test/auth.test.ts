import { describe, it, expect } from 'vitest';
import { request } from './setup';
import { http, HttpResponse } from 'msw';
import { server } from '../vitest.setup';

describe('docs', () => {
	it('GET /api/v0/docs/', async () => {
		await request.get('/api/v0/docs/').expect(200);
	});
});

describe('oauth login', () => {
	it('returns google oauth url', async () => {
		const res = await request.get('/api/v0/oauthlogin');
		expect(res.status).toBe(200);
		expect(res.body.url).toBe('mock-url');
	});
});

describe('oauth login callback', () => {
	it('returns 302 when no code', async () => {
		const res = await request.get('/api/v0/oauthlogin/callback');
		expect(res.status).toBe(302);
	});

	it('sets cookie and redirects when code is provided', async () => {
		const res = await request.get('/api/v0/oauthlogin/callback?code=validcode');
		expect(res.status).toBe(302);
		expect(res.headers['set-cookie'][0]).toContain('authToken=mock-token');
	});
});

describe('auth middleware', () => {
	it('returns 401 when no cookie', async () => {
		const res = await request.get('/api/v0/protected');
		expect(res.status).toBe(401);
	});

	it('allows access with valid cookie', async () => {
		const res = await request.get('/api/v0/protected')
			.set('Cookie', 'authToken=mock-token');
		expect(res.status).toBe(200);
	});

	it('returns 401 when res is not 200', async () => {
		server.use(
			http.get('http://127.0.0.1:3010/api/v0/check', () => {
				return new HttpResponse(null, { status: 401 });
			}),
		);
		const res = await request.get('/api/v0/protected')
			.set('Cookie', 'authToken=mock-token');
		expect(res.status).toBe(401);
	});

	it('returns 401 when role is not shopper', async () => {
		server.use(
			http.get('http://127.0.0.1:3010/api/v0/check', () => {
				return HttpResponse.json({ id: 'mock-id', role: 'seller' });
			}),
		);
		const res = await request.get('/api/v0/protected')
			.set('Cookie', 'authToken=mock-token');
		expect(res.status).toBe(401);
	});
});
