import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { request } from './setup';
import { server } from '../vitest.setup';

describe('POST /generate', () => {
	it('returns 401 when no cookie', async () => {
		const res = await request.post('/api/v0/generate');
		expect(res.status).toBe(401);
	});

	it('returns 201 and sets apiKey cookie with valid auth', async () => {
		const res = await request
			.post('/api/v0/generate')
			.set('Cookie', 'authToken=mock-token');
		expect(res.status).toBe(201);
		expect(res.text).toBe('mock-api-key');
		expect(res.headers['set-cookie'][0]).toContain('apiKey=mock-api-key');
	});

	it('returns 401 when CorporateService rejects the token', async () => {
		server.use(
			http.post('http://127.0.0.1:3040/api/v0/generate', () => {
				return new HttpResponse(null, { status: 401 });
			}),
		);
		const res = await request
			.post('/api/v0/generate')
			.set('Cookie', 'authToken=mock-token');
		expect(res.status).toBe(401);
	});

	it('returns 500 when CorporateService fails', async () => {
		server.use(
			http.post('http://127.0.0.1:3040/api/v0/generate', () => {
				return new HttpResponse(null, { status: 500 });
			}),
		);
		const res = await request
			.post('/api/v0/generate')
			.set('Cookie', 'authToken=mock-token');
		expect(res.status).toBe(500);
	});
});
