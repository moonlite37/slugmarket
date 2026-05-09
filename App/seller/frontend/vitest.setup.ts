import { afterEach, afterAll, beforeAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

export const server = setupServer(
	http.get('http://localhost:3013/api/v0/oauthlogin', () => {
		return HttpResponse.json({ url: 'mock-url' });
	}),

	http.post('http://localhost:3013/api/v0/listing', async ({ request }) => {
		const body = await request.json() as Record<string, unknown>;
		return HttpResponse.json(
			{ id: 'mock-id', ...body, created: '2026-05-08', author: 'mock-author' },
			{ status: 201 },
		);
	}),
);

beforeAll(() => server.listen());
afterEach(() => {
	server.resetHandlers();
	vi.unstubAllGlobals();
	cleanup();
});
afterAll(() => server.close());
