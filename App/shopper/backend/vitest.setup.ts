import { beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, passthrough, HttpResponse } from 'msw';


const listing = {
  id: "00000000-0000-0000-0000-000000000002", // gen_random_uuid()
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
  http.get(
    'http://localhost:3011/api/v0/listing',
    () => {
      return HttpResponse.json([listing]);
    },
  ),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

