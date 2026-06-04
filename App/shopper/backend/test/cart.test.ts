import {describe, it, expect} from 'vitest';
import {http, HttpResponse} from 'msw';
import {request} from './setup';
import {server} from '../vitest.setup';

const item = {
	listing_id: '00000000-0000-0000-0000-000000000010',
	name: 'Blue Hoodie',
	price: 29.99,
	quantity: 1,
	seller: '00000000-0000-0000-0000-000000000005',
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

describe('DELETE /api/v0/cart/item/:listingId', () => {
	it('removes an item for a logged-in user', async () => {
		const res = await request
			.delete('/api/v0/cart/item/00000000-0000-0000-0000-000000000010')
			.set('Cookie', 'authToken=mock-token');
		expect(res.status).toBe(204);
	});

	it('returns 401 without a cookie', async () => {
		const res = await request.delete('/api/v0/cart/item/00000000-0000-0000-0000-000000000010');
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

const mockCart = (items = [item]) =>
	http.get('http://127.0.0.1:3017/api/v0/cart', () => HttpResponse.json(items));

const mockPayment = (url = 'https://checkout.stripe.com/test') =>
	http.post('http://127.0.0.1:3016/api/v0/checkout', () => HttpResponse.json({ url }));

describe('POST /api/v0/cart/checkout', () => {
	it('returns 401 without a cookie', async () => {
		const res = await request.post('/api/v0/cart/checkout');
		expect(res.status).toBe(401);
	});

	it('returns a Stripe checkout URL', async () => {
		server.use(mockCart(), mockPayment());
		const res = await request
			.post('/api/v0/cart/checkout')
			.set('Cookie', 'authToken=mock-token');
		expect(res.status).toBe(200);
		expect(res.body.url).toBe('https://checkout.stripe.com/test');
	});

	it('sends correct line item data to payment service', async () => {
		let paymentBody: Record<string, unknown>;
		server.use(
			mockCart(),
			http.post('http://127.0.0.1:3016/api/v0/checkout', async ({ request: req }) => {
				paymentBody = await req.json() as Record<string, unknown>;
				return HttpResponse.json({ url: 'https://checkout.stripe.com/test' });
			}),
		);
		await request.post('/api/v0/cart/checkout').set('Cookie', 'authToken=mock-token');
		const lineItems = paymentBody!.lineItems as { name: string; unitAmount: number; quantity: number }[];
		expect(lineItems[0].name).toBe('Blue Hoodie');
		expect(lineItems[0].unitAmount).toBe(2999);
		expect(lineItems[0].quantity).toBe(1);
		expect(paymentBody!.shopperId).toBe('mock-id');
	});

	it('groups order data by seller', async () => {
		let paymentBody: Record<string, unknown>;
		server.use(
			mockCart([
				{ ...item, seller: 'seller-1' },
				{ ...item, listing_id: 'item-2', name: 'iPhone 7', seller: 'seller-2' },
			]),
			http.post('http://127.0.0.1:3016/api/v0/checkout', async ({ request: req }) => {
				paymentBody = await req.json() as Record<string, unknown>;
				return HttpResponse.json({ url: 'https://checkout.stripe.com/test' });
			}),
		);
		await request.post('/api/v0/cart/checkout').set('Cookie', 'authToken=mock-token');
		const orderData = paymentBody!.orderData as { seller: string }[];
		expect(orderData.length).toBe(2);
		expect(orderData.map(o => o.seller).sort()).toEqual(['seller-1', 'seller-2']);
	});

	it('clears the cart after checkout', async () => {
		let deleteCount = 0;
		server.use(
			mockCart(),
			mockPayment(),
			http.delete('http://127.0.0.1:3017/api/v0/cart/item/:listingId', () => {
				deleteCount++;
				return new HttpResponse(null, { status: 204 });
			}),
		);
		await request.post('/api/v0/cart/checkout').set('Cookie', 'authToken=mock-token');
		expect(deleteCount).toBe(1);
	});
});
