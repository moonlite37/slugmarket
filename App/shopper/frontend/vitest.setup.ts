import { afterEach, afterAll, beforeAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import i18n from './src/utils/i18n';
import en from './public/locales/en/translation.json';
import es from './public/locales/es/translation.json';

const listings = [
	{
		id: '00000000-0000-0000-0000-000000000002',
		author: '00000000-0000-0000-0000-000000000001',
		username: 'John Pork',
		title: 'Pork Chops',
		description: '100% authentic pork chops made from pork',
		created: new Date().toISOString(),
		price: 19.99,
		stock: 42,
		categories: ['food', 'pork'],
		images: ['img1.jpg', 'img2.jpg'],
	},
	{
		id: '00000000-0000-0000-0000-000000000003',
		author: '00000000-0000-0000-0000-000000000002',
		username: 'Steve Jobs',
		title: 'Iphone 7',
		description: 'New and improved Iphone with touch id. 100% less headphone jacks!',
		created: new Date().toISOString(),
		price: 799.99,
		stock: 224,
		categories: ['phone', 'tech'],
		images: ['img3.jpg', 'img4.jpg'],
	},
];

export const cartItem = {
	listing_id: '00000000-0000-0000-0000-000000000010',
	name: 'Blue Hoodie',
	price: 29.99,
	quantity: 1,
	seller: '00000000-0000-0000-0000-000000000005',
};

export const server = setupServer(
	http.get('/shopper/locales/en/translation.json', () => HttpResponse.json(en)),
	http.get('/shopper/locales/es/translation.json', () => HttpResponse.json(es)),
	http.get('/shopper/api/v0/listing', async () => {
		return HttpResponse.json(listings);
	}),
	http.get('http://localhost:3000/shopper/api/v0/oauthlogin', () => {
		return HttpResponse.json({ url: 'mock-url' });
	}),
	http.get('/shopper/api/v0/protected', () => new HttpResponse(null, {status: 401})),
	http.get('/shopper/api/v0/cart', () => HttpResponse.json([])),
	http.get('/shopper/api/v0/category', () => {
		return HttpResponse.json([{id: 'dummy id', name: 'dummy category'}])
	}),
	http.get('/shopper/api/v0/listing/:id', ({ params }) => {
		const match = listings.find((l) => l.id === params.id);
		return match ? HttpResponse.json(match) : new HttpResponse(null, {status: 404});
	}),
	http.post('/shopper/api/v0/cart/item', () => new HttpResponse(null, {status: 201})),
	http.post('/shopper/api/v0/cart/sync', () => HttpResponse.json([])),
	http.post('/shopper/api/v0/cart/checkout', () => HttpResponse.json({ url: '' })),
	http.delete('/shopper/api/v0/cart/item/:id', () => new HttpResponse(null, {status: 204})),
	http.get('/shopper/api/v0/order', () => {
		return HttpResponse.json([
			{
				id: 'order-1',
				shopper: 'shopper-id',
				seller: '00000000-0000-0000-0000-000000000001',
				items: [{ listingId: 'l1', title: 'Pork Chops', price: 19.99, quantity: 2 }],
				total: 39.98,
				status: 'fulfilled',
				created: '2026-05-20',
			},
			{
				id: 'order-2',
				shopper: 'shopper-id',
				seller: '00000000-0000-0000-0000-000000000002',
				items: [{ listingId: 'l2', title: 'Iphone 7', price: 799.99, quantity: 1 }],
				total: 799.99,
				status: 'pending',
				created: '2026-05-25',
			},
		]);
	}),
);

beforeAll(async () => {
	server.listen();
	if (!i18n.isInitialized) {
		await new Promise<void>((resolve) => i18n.on('initialized', resolve));
	}
});
afterEach(() => {
	server.resetHandlers();
	vi.unstubAllGlobals();
	cleanup();
});
afterAll(() => server.close());
