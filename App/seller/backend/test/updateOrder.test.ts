import { describe, it, expect } from 'vitest';
import { request } from './setup';

describe('update order status', () => {
	it('fulfills an order', async () => {
		const res = await request
			.put('/api/v0/order/mock-order-id')
			.set('Cookie', 'authToken=mock-token')
			.send({ status: 'fulfilled' });
		expect(res.status).toBe(200);
		expect(res.body.status).toBe('fulfilled');
	});

	it('cancels an order', async () => {
		const res = await request
			.put('/api/v0/order/mock-order-id')
			.set('Cookie', 'authToken=mock-token')
			.send({ status: 'cancelled' });
		expect(res.status).toBe(200);
		expect(res.body.status).toBe('cancelled');
	});

	it('returns 401 without auth cookie', async () => {
		const res = await request
			.put('/api/v0/order/mock-order-id')
			.send({ status: 'fulfilled' });
		expect(res.status).toBe(401);
	});
});

import { server } from '../vitest.setup';
import { http, HttpResponse } from 'msw';

describe('update order status errors', () => {
	it('returns 500 when OrderService fails', async () => {
		server.use(
			http.post('http://127.0.0.1:4000/graphql', () => {
				return new HttpResponse(null, { status: 500 });
			}),
		);
		const res = await request
			.put('/api/v0/order/mock-order-id')
			.set('Cookie', 'authToken=mock-token')
			.send({ status: 'fulfilled' });
		expect(res.status).toBe(500);
	});
});
