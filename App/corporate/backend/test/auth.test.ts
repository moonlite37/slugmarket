import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { request } from './setup';
import { server } from '../vitest.setup';

describe('docs', () => {
	it('GET /api/v0/docs/', async () => {
		await request.get('/api/v0/docs/').expect(200);
	});
});

describe('POST /login', () => {
	it('sets cookie and returns 200 with valid corporate credentials', async () => {
		const res = await request
			.post('/api/v0/login')
			.send({ email: 'corp@test.com', password: 'password' });
		expect(res.status).toBe(200);
		expect(res.headers['set-cookie'][0]).toContain('authToken=mock-token');
	});

	it('returns 401 with wrong credentials', async () => {
		const res = await request
			.post('/api/v0/login')
			.send({ email: 'wrong@test.com', password: 'wrong' });
		expect(res.status).toBe(401);
	});

	it('returns 401 when auth check call fails', async () => {
		server.use(
			http.get('http://127.0.0.1:3010/api/v0/check', () => {
				return new HttpResponse(null, { status: 401 });
			}),
		);
		const res = await request
			.post('/api/v0/login')
			.send({ email: 'corp@test.com', password: 'password' });
		expect(res.status).toBe(401);
	});

	it('returns 401 when user does not have corporate role', async () => {
		server.use(
			http.get('http://127.0.0.1:3010/api/v0/check', () => {
				return HttpResponse.json({ id: 'mock-id', roles: ['seller'] });
			}),
		);
		const res = await request
			.post('/api/v0/login')
			.send({ email: 'corp@test.com', password: 'password' });
		expect(res.status).toBe(401);
	});
});

describe('auth middleware', () => {
	it('returns 401 when no cookie', async () => {
		const res = await request.get('/api/v0/protected');
		expect(res.status).toBe(401);
	});

	it('allows access with valid corporate cookie', async () => {
		const res = await request
			.get('/api/v0/protected')
			.set('Cookie', 'authToken=mock-token');
		expect(res.status).toBe(200);
	});

	it('returns 401 when check returns non-200', async () => {
		server.use(
			http.get('http://127.0.0.1:3010/api/v0/check', () => {
				return new HttpResponse(null, { status: 401 });
			}),
		);
		const res = await request
			.get('/api/v0/protected')
			.set('Cookie', 'authToken=mock-token');
		expect(res.status).toBe(401);
	});

	it('returns 401 when role is not corporate', async () => {
		server.use(
			http.get('http://127.0.0.1:3010/api/v0/check', () => {
				return HttpResponse.json({ id: 'mock-id', roles: ['seller'] });
			}),
		);
		const res = await request
			.get('/api/v0/protected')
			.set('Cookie', 'authToken=mock-token');
		expect(res.status).toBe(401);
	});
});
