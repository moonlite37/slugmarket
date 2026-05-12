import { beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

export const server = setupServer(
  http.get('http://127.0.0.1:3010/api/v0/oauthlogin', ({ request }) => {
    const url = new URL(request.url);
    const app = url.searchParams.get('app');
    if (app === 'seller') {
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
      if (app === 'seller') {
        return HttpResponse.json({ authToken: 'mock-token' });
      }
      return undefined;
    },
  ),
  http.get('http://127.0.0.1:3010/api/v0/check', () => {
    return HttpResponse.json({ id: 'mock-id', role: 'seller' });
  }),
  http.post('http://127.0.0.1:3011/api/v0/listing', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(
      {
        id: 'mock-listing-id',
        ...body,
        created: '2026-05-08',
        author: 'mock-author',
      },
      { status: 201 },
    );
  }),
  http.get('http://127.0.0.1:3011/api/v0/listing', () => {
    return HttpResponse.json([
      { id: 'mock-1', title: 'My Widget', description: 'A widget', price: 10, stock: 5, categories: ['test'], author: 'mock-id', created: '2026-05-10' },
    ]);
  }),
);

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
