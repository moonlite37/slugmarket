import { beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, passthrough, HttpResponse } from 'msw';

export const server = setupServer(
  http.all('http://127.0.0.1*', () => passthrough()),
  http.get('http://localhost:3010/api/v0/oauthlogin', ({ request }) => {
    const url = new URL(request.url);
    const app = url.searchParams.get('app');
    if (app === 'shopper') {
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
      if (app === 'shopper') {
        return HttpResponse.json({ authToken: 'mock-token' });
      }
      return passthrough();
    },
  ),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

