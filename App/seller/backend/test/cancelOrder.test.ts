import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { request } from './setup';
import { server } from '../vitest.setup';

describe('cancel order restores stock', () => {
	it('restores listing stock when order is cancelled', async () => {
		let restoredStock: number | undefined;
		server.use(
			http.post('http://127.0.0.1:4000/graphql', async ({ request: req }) => {
				const body = await req.json() as { query: string; variables?: Record<string, string> };
				if (body.query.includes('ordersBySeller')) {
					return HttpResponse.json({
						data: {
							ordersBySeller: [{
								id: 'order-1',
								shopper: 'shopper-1',
								seller: 'mock-id',
								items: [{ listingId: 'listing-1', title: 'Widget', price: 10, quantity: 3 }],
								total: 30,
								status: 'paid',
								created: '2026-06-01',
							}],
						},
					});
				}
				return HttpResponse.json({
					data: { updateOrderStatus: { id: body.variables?.id, status: body.variables?.status } },
				});
			}),
			http.get('http://127.0.0.1:3011/api/v0/listing/listing-1', () => {
				return HttpResponse.json({ id: 'listing-1', stock: 7, price: 10 });
			}),
			http.put('http://127.0.0.1:3011/api/v0/listing/listing-1', async ({ request: req }) => {
				const body = await req.json() as Record<string, number>;
				restoredStock = body.stock;
				return HttpResponse.json({ id: 'listing-1', stock: body.stock });
			}),
		);
		const res = await request.put('/api/v0/order/order-1')
			.set('Cookie', 'authToken=mock-token')
			.send({ status: 'cancelled' });
		expect(res.status).toBe(200);
		expect(restoredStock).toBe(10);
	});

	it('does not restore stock when order is fulfilled', async () => {
		let putCalled = false;
		server.use(
			http.put('http://127.0.0.1:3011/api/v0/listing/:id', () => {
				putCalled = true;
				return HttpResponse.json({});
			}),
		);
		const res = await request.put('/api/v0/order/order-1')
			.set('Cookie', 'authToken=mock-token')
			.send({ status: 'fulfilled' });
		expect(res.status).toBe(200);
		expect(putCalled).toBe(false);
	});
});
