import {describe, it, expect} from 'vitest';
import {request} from './setup';

const item = {
	listing_id: '00000000-0000-0000-0000-000000000010',
	name: 'Blue Hoodie',
	price: 29.99,
	quantity: 1,
	imageUrl: 'hoodie.jpg',
};

describe('GET /api/v0/cart', () => {
	it('returns cart items for a logged-in user', async () => {
		const res = await request
			.get('/api/v0/cart')
			.set('Cookie', 'authToken=mock-token');
		expect(res.status).toBe(200);
		expect(res.body.length).toBeGreaterThan(0);
	});

	it('returns 401 without a cookie', async () => {
		const res = await request.get('/api/v0/cart');
		expect(res.status).toBe(401);
	});
});

describe('POST /api/v0/cart/item', () => {
	it('allows a logged-in user to add an item', async () => {
		const res = await request
			.post('/api/v0/cart/item')
			.set('Cookie', 'authToken=mock-token')
			.send({item});
		expect(res.status).toBe(201);
	});

	it('returns 401 without a cookie', async () => {
		const res = await request.post('/api/v0/cart/item').send({item});
		expect(res.status).toBe(401);
	});
});
