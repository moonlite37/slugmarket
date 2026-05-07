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
