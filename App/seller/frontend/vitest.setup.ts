import { afterEach, afterAll, beforeAll, vi } from 'vitest';
import i18n from './src/utils/i18n';
import { cleanup } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import en from './public/locales/en/translation.json';
import es from './public/locales/es/translation.json';
export const server = setupServer(
  http.get('/seller/locales/en/translation.json', () => HttpResponse.json(en)),
  http.get('/seller/locales/es/translation.json', () => HttpResponse.json(es)),
  http.post('/seller/api/v0/corp/generate', () => new HttpResponse('mock-api-key', { status: 200 })),
  http.get('http://localhost:3000/seller/api/v0/oauthlogin', () => {
    return HttpResponse.json({ url: 'mock-url' });
  }),
  http.get('http://localhost:3000/seller/api/v0/order', () => {
    return HttpResponse.json([
      {
        id: 'order-1',
        shopper: 'shopper-id',
        seller: 'seller-id',
        shopperName: 'Test Shopper',
        shopperEmail: 'shopper@test.com',
        items: [{ listingId: 'l1', title: 'Test Widget', price: 9.99, quantity: 3 }],
        total: 29.97,
        status: 'pending',
        created: '2026-05-20',
      },
    ]);
  }),
  http.put('http://localhost:3000/seller/api/v0/order/:id', async ({ request, params }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({ id: params.id, status: body.status });
  }),
  http.get('http://localhost:3000/seller/api/v0/category', () => {
    return HttpResponse.json([
      { id: 'cat-food', name: 'Food' },
      { id: 'cat-tech', name: 'Tech' },
    ]);
  }),
  http.post('http://localhost:3000/seller/api/v0/listing', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(
      { id: 'mock-id', ...body, created: '2026-05-08', author: 'mock-author' },
      { status: 201 },
    );
  }),
  http.get('http://localhost:3000/seller/api/v0/listing', () => {
    return HttpResponse.json([
      {
        id: 'mock-1',
        title: 'My Widget',
        description: 'A widget',
        price: 10,
        stock: 5,
        categories: ['test'],
        author: 'mock-id',
        created: '2026-05-10',
      },
      {
        id: 'mock-2',
        title: 'Another Widget',
        description: 'Another one',
        price: 20,
        stock: 3,
        categories: ['test'],
        author: 'mock-id',
        created: '2026-05-10',
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
