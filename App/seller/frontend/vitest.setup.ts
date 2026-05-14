import { afterEach, afterAll, beforeAll, vi } from 'vitest';
import i18n from './src/utils/i18n';
import { cleanup } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
export const server = setupServer(
  http.get('/locales/en/translation.json', () =>
    HttpResponse.json({
      'Sign In': 'Sign In',
      'Welcome to SlugMarket': 'Welcome to SlugMarket',
      'Sign in with Google': 'Sign in with Google',
    }),
  ),
  http.get('/locales/es/translation.json', () =>
    HttpResponse.json({
      'Sign In': 'Iniciar sesión',
      'Welcome to SlugMarket': 'Bienvenido a SlugMarket',
      'Sign in with Google': 'Iniciar sesión con Google',
    }),
  ),
  http.get('http://localhost:3000/seller/api/v0/oauthlogin', () => {
    return HttpResponse.json({ url: 'mock-url' });
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
