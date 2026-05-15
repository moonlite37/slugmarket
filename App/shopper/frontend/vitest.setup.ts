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

export const server = setupServer(
	http.get('/shopper/locales/en/translation.json', () => HttpResponse.json(en)),
	http.get('/shopper/locales/es/translation.json', () => HttpResponse.json(es)),
	http.get('http://localhost:3000/shopper/api/v0/listing', async () => {
		return HttpResponse.json(listings);
	}),
	http.get('http://localhost:3000/shopper/api/v0/oauthlogin', () => {
		return HttpResponse.json({ url: 'mock-url' });
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
