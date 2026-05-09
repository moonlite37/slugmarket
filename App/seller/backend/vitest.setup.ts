import { beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, passthrough, HttpResponse } from 'msw';

export const server = setupServer(
  http.all('http://127.0.0.1*', () => passthrough()),
  http.get('http://localhost:3010/api/v0/oauthlogin', ({ request }) => {
    const url = new URL(request.url);
    const app = url.searchParams.get('app');
    if (app === 'seller') {
      return new HttpResponse(null, {
        status: 302,
        headers: { Location: 'mock-url' },
      });
    }
    return passthrough();
  }),
  http.get(
    'http://localhost:3010/api/v0/oauthlogin/callback',
    ({ request }) => {
      const url = new URL(request.url);
      const app = url.searchParams.get('app');
      if (app === 'seller') {
        return HttpResponse.json({ authToken: 'mock-token' });
      }
      return passthrough();
    },
  ),
  http.post('http://localhost:3011/api/v0/listing', async ({ request }) => {
	  const body = await request.json() as Record<string, unknown>;
	  return HttpResponse.json(
		  { id: 'mock-listing-id', ...body, created: '2026-05-08', author: 'mock-author' },
		  { status: 201 },
	  );
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
