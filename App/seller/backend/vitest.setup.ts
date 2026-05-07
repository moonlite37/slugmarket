import { beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

export const server = setupServer(
	http.get('http://localhost:3010/api/v0/oauthlogin', () => {
		return new HttpResponse(null, {
			status: 302,
			headers: { Location: 'mock-url' },
		});
	}),
	http.get('http://localhost:3010/api/v0/oauthlogin/callback', () => {
		return HttpResponse.json({ authToken: 'mock-token' });
	}),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
