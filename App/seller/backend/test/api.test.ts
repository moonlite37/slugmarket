import { describe, it, expect } from 'vitest';
import { request } from './setup';

describe('generate api', () => {
	it('returns correct status on good auth', async () => {
		const res = await request.post('/api/v0/corp/generate').set('Cookie', 'authToken=valid');
		expect(res.status).toBe(200);
	});
    it('returns correct status on bad auth', async () => {
		const res = await request.post('/api/v0/corp/generate').set('Cookie', 'authToken=invalid');
		expect(res.status).toBe(401);
	});
});
