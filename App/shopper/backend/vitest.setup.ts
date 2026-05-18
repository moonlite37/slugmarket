import { beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const listing = {
  id: "00000000-0000-0000-0000-000000000002",
  author: "00000000-0000-0000-0000-000000000001",
  username: "John Pork",
  title: "Pork Chops",
  description: "100% authentic pork chops made from pork",
  created: new Date().toISOString(),
  price: 19.99,
  stock: 42,
  catagories: ["food", "pork"],
  images: ["img1.jpg", "img2.jpg"],
};

export const server = setupServer(
  http.get('http://127.0.0.1:3010/api/v0/oauthlogin', ({ request }) => {
    const url = new URL(request.url);
    const app = url.searchParams.get('app');
    if (app === 'shopper') {
      return new HttpResponse(null, {
        status: 302,
        headers: { Location: 'mock-url' },
      });
    }
    return undefined;
  }),
  http.get(
    'http://127.0.0.1:3010/api/v0/oauthlogin/callback',
    ({ request }) => {
      const url = new URL(request.url);
      const app = url.searchParams.get('app');
      if (app === 'shopper') {
        return HttpResponse.json({ authToken: 'mock-token' });
      }
      return undefined;
    },
  ),
  http.get('http://127.0.0.1:3010/api/v0/check', () => {
    return HttpResponse.json({ id: 'mock-id', roles: ['shopper'] });
  }),
  http.get('http://127.0.0.1:3011/api/v0/listing', () => {
    return HttpResponse.json([listing]);
  }),
  http.post('http://127.0.0.1:4000/graphql', async ({ request }) => {
    const body = await request.json() as { query: string };
    if (body.query.includes('createOrder')) {
      return HttpResponse.json({
        data: {
          createOrder: {
            id: 'mock-order-id',
            shopper: 'mock-id',
            seller: 'mock-seller',
            items: [{ listingId: 'mock-listing', title: 'Test', price: 10, quantity: 1 }],
            total: 10,
            status: 'pending',
            created: '2026-05-13',
          },
        },
      });
    }
    if (body.query.includes('ordersByShopper')) {
      return HttpResponse.json({
        data: {
          ordersByShopper: [
            {
              id: 'mock-order-id',
              shopper: 'mock-id',
              seller: 'mock-seller',
              items: [{ listingId: 'mock-listing', title: 'Test', price: 10, quantity: 1 }],
              total: 10,
              status: 'pending',
              created: '2026-05-13',
            },
          ],
        },
      });
    }
    return HttpResponse.json({ data: {} });
  }),
);

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
