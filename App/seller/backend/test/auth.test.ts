import { describe, it, expect } from 'vitest';
import { request } from './setup';

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
