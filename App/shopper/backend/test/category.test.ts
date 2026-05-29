import { describe, it, expect } from 'vitest';
import { request } from './setup';

describe('gets a listing', () => {
	it('Returns correct status code', async () => {
		const res = await request.get('/api/v0/category');
		expect(res.status).toBe(200);
	});
    it('Returns category', async () => {
		const res = await request.get('/api/v0/category');
		expect(res.body[0].name).toBe('some category');
	});
});