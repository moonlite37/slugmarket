import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { request } from './setup';
import { server } from '../vitest.setup';

const orderWithEmail = {
        id: 'order-1',
        shopper: 'shopper-1',
        seller: 'mock-id',
        shopperName: 'Jane',
        shopperEmail: 'jane@test.com',
        items: [{ listingId: 'listing-1', title: 'Widget', price: 10, quantity: 3 }],
        total: 30,
        status: 'paid',
        created: '2026-06-01',
};

const orderWithoutName = {
        id: 'order-2',
        shopper: 'shopper-2',
        seller: 'mock-id',
        shopperEmail: 'anon@test.com',
        items: [{ listingId: 'listing-2', title: 'Gadget', price: 5, quantity: 1 }],
        total: 5,
        status: 'paid',
        created: '2026-06-01',
};

function mockGraphQL(orders: unknown[]) {
        return http.post('http://127.0.0.1:4000/graphql', async ({ request: req }) => {
                const body = await req.json() as { query: string; variables?: Record<string, string> };
                if (body.query.includes('ordersBySeller')) {
                        return HttpResponse.json({ data: { ordersBySeller: orders } });
                }
                return HttpResponse.json({
                        data: { updateOrderStatus: { id: body.variables?.id, status: body.variables?.status } },
                });
        });
}

describe('cancel order restores stock', () => {
        it('restores listing stock when order is cancelled', async () => {
                let restoredStock: number | undefined;
                server.use(
                        mockGraphQL([orderWithEmail]),
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
                        mockGraphQL([orderWithEmail]),
                        http.put('http://127.0.0.1:3011/api/v0/listing/:id', () => {
                                putCalled = true;
                                return HttpResponse.json({});
                        }),
                        http.post('http://127.0.0.1:3019/api/v0/email', () => {
                                return HttpResponse.json({ success: true });
                        }),
                );
                const res = await request.put('/api/v0/order/order-1')
                        .set('Cookie', 'authToken=mock-token')
                        .send({ status: 'fulfilled' });
                expect(res.status).toBe(200);
                expect(putCalled).toBe(false);
        });

        it('handles cancel when order not found', async () => {
                server.use(mockGraphQL([]));
                const res = await request.put('/api/v0/order/nonexistent')
                        .set('Cookie', 'authToken=mock-token')
                        .send({ status: 'cancelled' });
                expect(res.status).toBe(200);
        });

        it('handles cancel when listing fetch fails', async () => {
                server.use(
                        mockGraphQL([orderWithEmail]),
                        http.get('http://127.0.0.1:3011/api/v0/listing/listing-1', () => {
                                return new HttpResponse(null, { status: 500 });
                        }),
                );
                const res = await request.put('/api/v0/order/order-1')
                        .set('Cookie', 'authToken=mock-token')
                        .send({ status: 'cancelled' });
                expect(res.status).toBe(200);
        });
});

describe('fulfill order sends email', () => {
        it('sends shipment email when order is fulfilled', async () => {
                let emailTo: string | undefined;
                server.use(
                        mockGraphQL([orderWithEmail]),
                        http.post('http://127.0.0.1:3019/api/v0/email', async ({ request: req }) => {
                                const body = await req.json() as Record<string, string>;
                                emailTo = body.to;
                                return HttpResponse.json({ success: true });
                        }),
                );
                const res = await request.put('/api/v0/order/order-1')
                        .set('Cookie', 'authToken=mock-token')
                        .send({ status: 'fulfilled' });
                expect(res.status).toBe(200);
                expect(emailTo).toBe('jane@test.com');
        });

        it('uses fallback greeting when shopperName is missing', async () => {
                let emailText: string | undefined;
                server.use(
                        mockGraphQL([orderWithoutName]),
                        http.post('http://127.0.0.1:3019/api/v0/email', async ({ request: req }) => {
                                const body = await req.json() as Record<string, string>;
                                emailText = body.text;
                                return HttpResponse.json({ success: true });
                        }),
                );
                const res = await request.put('/api/v0/order/order-2')
                        .set('Cookie', 'authToken=mock-token')
                        .send({ status: 'fulfilled' });
                expect(res.status).toBe(200);
                expect(emailText).toContain('Hi there');
        });

        it('skips email when order has no shopperEmail', async () => {
                let emailCalled = false;
                const noEmailOrder = { ...orderWithEmail, shopperEmail: undefined };
                server.use(
                        mockGraphQL([noEmailOrder]),
                        http.post('http://127.0.0.1:3019/api/v0/email', () => {
                                emailCalled = true;
                                return HttpResponse.json({ success: true });
                        }),
                );
                const res = await request.put('/api/v0/order/order-1')
                        .set('Cookie', 'authToken=mock-token')
                        .send({ status: 'fulfilled' });
                expect(res.status).toBe(200);
                expect(emailCalled).toBe(false);
        });

        it('skips email when order not found', async () => {
                let emailCalled = false;
                server.use(
                        mockGraphQL([]),
                        http.post('http://127.0.0.1:3019/api/v0/email', () => {
                                emailCalled = true;
                                return HttpResponse.json({ success: true });
                        }),
                );
                const res = await request.put('/api/v0/order/nonexistent')
                        .set('Cookie', 'authToken=mock-token')
                        .send({ status: 'fulfilled' });
                expect(res.status).toBe(200);
                expect(emailCalled).toBe(false);
        });
});

describe('network error handling', () => {
	it('survives stock PUT network failure on cancel', async () => {
		server.use(
			mockGraphQL([orderWithEmail]),
			http.get('http://127.0.0.1:3011/api/v0/listing/listing-1', () => {
				return HttpResponse.json({ id: 'listing-1', stock: 7, price: 10 });
			}),
			http.put('http://127.0.0.1:3011/api/v0/listing/listing-1', () => {
				return HttpResponse.error();
			}),
		);
		const res = await request.put('/api/v0/order/order-1')
			.set('Cookie', 'authToken=mock-token')
			.send({ status: 'cancelled' });
		expect(res.status).toBe(200);
		expect(res.body.status).toBe('cancelled');
	});

	it('survives email network failure on fulfill', async () => {
		server.use(
			mockGraphQL([orderWithEmail]),
			http.post('http://127.0.0.1:3019/api/v0/email', () => {
				return HttpResponse.error();
			}),
		);
		const res = await request.put('/api/v0/order/order-1')
			.set('Cookie', 'authToken=mock-token')
			.send({ status: 'fulfilled' });
		expect(res.status).toBe(200);
		expect(res.body.status).toBe('fulfilled');
	});
});
