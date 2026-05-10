import { describe, it, expect } from 'vitest';
import { request } from './setup';

describe('gets a listing', () => {
	it('Returns correct status code', async () => {
		const res = await request.get('/api/v0/listing');
		expect(res.status).toBe(200);
	});
    it('Returns listings', async () => {
		const res = await request.get('/api/v0/listing');
		expect(res.body.length).toBe(1);
	});
});