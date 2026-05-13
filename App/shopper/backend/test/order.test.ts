import { describe, it, expect } from 'vitest';
import { request } from './setup';

describe('shopper orders', () => {
  it('creates an order with cookie', async () => {
    const res = await request
      .post('/api/v0/order')
      .set('Cookie', 'authToken=mock-token')
      .send({
        seller: '00000000-0000-0000-0000-000000000002',
        items: [{ listingId: 'mock-listing', title: 'Test', price: 10, quantity: 1 }],
        total: 10,
      });
    expect(res.status).toBe(201);
    expect(res.body.id).toBe('mock-order-id');
    expect(res.body.status).toBe('pending');
  });

  it('gets orders with cookie', async () => {
    const res = await request
      .get('/api/v0/order')
      .set('Cookie', 'authToken=mock-token');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].id).toBe('mock-order-id');
  });

  it('returns 401 when creating order without cookie', async () => {
    const res = await request
      .post('/api/v0/order')
      .send({
        seller: '00000000-0000-0000-0000-000000000002',
        items: [{ listingId: 'mock-listing', title: 'Test', price: 10, quantity: 1 }],
        total: 10,
      });
    expect(res.status).toBe(401);
  });

  it('returns 401 when getting orders without cookie', async () => {
    const res = await request.get('/api/v0/order');
    expect(res.status).toBe(401);
  });
});

import { server } from '../vitest.setup';
import { http, HttpResponse } from 'msw';

describe('shopper orders - error handling', () => {
	it('returns 500 when OrderService fails on create', async () => {
		server.use(
			http.post('http://127.0.0.1:4000/graphql', () => {
				return new HttpResponse(null, { status: 500 });
			}),
		);
		const res = await request
			.post('/api/v0/order')
			.set('Cookie', 'authToken=mock-token')
			.send({
				seller: '00000000-0000-0000-0000-000000000002',
				items: [{ listingId: 'mock-listing', title: 'Test', price: 10, quantity: 1 }],
				total: 10,
			});
		expect(res.status).toBe(500);
	});

	it('returns 500 when OrderService fails on get', async () => {
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
