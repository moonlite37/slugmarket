import { describe, it, expect } from 'vitest';
import { request } from './setup';

describe('GET /api/v0/category', () => {
	it('returns 200 with categories', async () => {
		const res = await request.get('/api/v0/category');
		expect(res.status).toBe(200);
	});

	it('returns array of categories', async () => {
		const res = await request.get('/api/v0/category');
		expect(Array.isArray(res.body)).toBe(true);
	});

	it('categories have id and name', async () => {
		const res = await request.get('/api/v0/category');
		if (res.body.length > 0) {
			expect(res.body[0].id).toBeDefined();
			expect(res.body[0].name).toBeDefined();
		}
	});
});
