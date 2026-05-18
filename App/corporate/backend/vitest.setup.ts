import { beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const mockListing = {
	id: 'mock-listing-id',
	author: 'mock-id',
	title: 'Test Widget',
	description: 'A test widget',
	created: '2026-05-18',
	price: 19.99,
	stock: 10,
	categories: ['test'],
};

const mockOrder = {
	id: 'mock-order-id',
	items: '[]',
	total: 19.99,
	status: 'pending',
};

export const server = setupServer(
	http.post('http://127.0.0.1:3010/api/v0/login', async ({ request }) => {
		const body = await request.json() as { email: string; password: string };
		if (body.email === 'corp@test.com' && body.password === 'password') {
			return HttpResponse.json({ name: 'Corp User', authToken: 'mock-token' });
		}
		return new HttpResponse(null, { status: 401 });
	}),

	http.get('http://127.0.0.1:3010/api/v0/check', () => {
		return HttpResponse.json({ id: 'mock-id', roles: ['corporate'] });
	}),

	http.post('http://127.0.0.1:3040/api/v0/generate', ({ request }) => {
		if (request.headers.get('authorization') === 'Bearer mock-token') {
			return new HttpResponse('mock-api-key', { status: 201 });
		}
		return new HttpResponse(null, { status: 401 });
	}),

	http.get('http://127.0.0.1:3040/api/v0/listing', ({ request }) => {
		if (request.headers.get('authorization') !== 'mock-api-key') {
			return new HttpResponse(null, { status: 401 });
		}
		return HttpResponse.json([mockListing]);
	}),

	http.post('http://127.0.0.1:3040/api/v0/listing', async ({ request }) => {
		if (request.headers.get('authorization') !== 'mock-api-key') {
			return new HttpResponse(null, { status: 401 });
		}
		const body = await request.json() as Record<string, unknown>;
		return HttpResponse.json({ ...mockListing, ...body }, { status: 201 });
	}),

	http.put('http://127.0.0.1:3040/api/v0/listing/:id', async ({ request, params }) => {
		if (request.headers.get('authorization') !== 'mock-api-key') {
			return new HttpResponse(null, { status: 401 });
		}
		if (params.id === 'not-found') {
			return new HttpResponse(null, { status: 404 });
		}
		const body = await request.json() as Record<string, unknown>;
		return HttpResponse.json({ ...mockListing, id: params.id, ...body });
	}),

	http.delete('http://127.0.0.1:3040/api/v0/listing/:id', ({ request, params }) => {
		if (request.headers.get('authorization') !== 'mock-api-key') {
			return new HttpResponse(null, { status: 401 });
		}
		if (params.id === 'not-found') {
			return new HttpResponse(null, { status: 404 });
		}
		return new HttpResponse(null, { status: 204 });
	}),

	http.get('http://127.0.0.1:3040/api/v0/order', ({ request }) => {
		if (request.headers.get('authorization') !== 'mock-api-key') {
			return new HttpResponse(null, { status: 401 });
		}
		return HttpResponse.json([mockOrder]);
	}),

	http.put('http://127.0.0.1:3040/api/v0/order/:id', async ({ request }) => {
		if (request.headers.get('authorization') !== 'mock-api-key') {
			return new HttpResponse(null, { status: 401 });
		}
		const body = await request.json() as { status: string };
		return HttpResponse.json({ ...mockOrder, status: body.status });
	}),
);

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
