import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { request } from './setup';
import { server } from '../vitest.setup';

const cartItem = {
	listing_id: '00000000-0000-0000-0000-000000000010',
	name: 'Blue Hoodie',
	price: 29.99,
	quantity: 1,
};

const listing = {
	id: '00000000-0000-0000-0000-000000000010',
	price: 19.99,
	stock: 42,
};

describe('POST /api/v0/cart/sync', () => {
	it('returns 401 without a cookie', async () => {
		const res = await request.post('/api/v0/cart/sync');
		expect(res.status).toBe(401);
	});

	it('updates price to match current listing', async () => {
		const res = await request
			.post('/api/v0/cart/sync')
			.set('Cookie', 'authToken=mock-token');
		expect(res.status).toBe(200);
		expect(res.body[0].price).toBe(19.99);
	});

	it('removes out-of-stock items', async () => {
		server.use(
			http.get('http://127.0.0.1:3011/api/v0/listing/:id', () =>
				HttpResponse.json({ ...listing, stock: 0 }),
			),
		);
		const res = await request
			.post('/api/v0/cart/sync')
			.set('Cookie', 'authToken=mock-token');
		expect(res.body).toEqual([]);
	});

	it('returns item unchanged when price and quantity already match', async () => {
		server.use(
			http.get('http://127.0.0.1:3017/api/v0/cart', () =>
				HttpResponse.json([{ ...cartItem, price: 19.99 }]),
			),
		);
		const res = await request
			.post('/api/v0/cart/sync')
			.set('Cookie', 'authToken=mock-token');
		expect(res.body[0].price).toBe(19.99);
		expect(res.body[0].quantity).toBe(1);
	});

	it('caps quantity to available stock', async () => {
		server.use(
			http.get('http://127.0.0.1:3017/api/v0/cart', () =>
				HttpResponse.json([{ ...cartItem, quantity: 5 }]),
			),
			http.get('http://127.0.0.1:3011/api/v0/listing/:id', () =>
				HttpResponse.json({ ...listing, stock: 3 }),
			),
		);
		const res = await request
			.post('/api/v0/cart/sync')
			.set('Cookie', 'authToken=mock-token');
		expect(res.body[0].quantity).toBe(3);
	});
});
