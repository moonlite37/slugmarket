import { describe, it, expect } from 'vitest';
import { request } from './setup';
import { server } from '../vitest.setup';
import { http, HttpResponse } from 'msw';

describe('seller orders', () => {
	it('returns orders for authenticated seller', async () => {
		const res = await request
			.get('/api/v0/order')
			.set('Cookie', 'authToken=mock-token');
		expect(res.status).toBe(200);
		expect(res.body.length).toBeGreaterThan(0);
		expect(res.body[0].id).toBe('mock-order-id');
		expect(res.body[0].seller).toBe('mock-id');
	});

	it('returns 401 without auth cookie', async () => {
		const res = await request.get('/api/v0/order');
		expect(res.status).toBe(401);
	});

	it('returns 500 when OrderService fails', async () => {
		server.use(
			http.post('http://127.0.0.1:4000/graphql', () => {
				return new HttpResponse(null, { status: 500 });
			}),
		);
		const res = await request
			.get('/api/v0/order')
			.set('Cookie', 'authToken=mock-token');
		expect(res.status).toBe(500);
	});
});
