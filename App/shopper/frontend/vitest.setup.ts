import { afterEach, afterAll, beforeAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

export const server = setupServer(
	http.get('http://localhost:3012/api/v0/oauthlogin', () => {
		return HttpResponse.json({ url: 'mock-url' });
	}),
);

beforeAll(() => server.listen());
afterEach(() => {
	server.resetHandlers();
	vi.unstubAllGlobals();
	cleanup();
});
afterAll(() => server.close());
