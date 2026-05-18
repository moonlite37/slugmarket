import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { request } from './setup';
import { server } from '../vitest.setup';

const AUTH = 'authToken=mock-token';
const AUTH_WITH_KEY = 'authToken=mock-token; apiKey=mock-api-key';

describe('GET /listing', () => {
	it('returns 401 without auth cookie', async () => {
		const res = await request.get('/api/v0/listing');
		expect(res.status).toBe(401);
	});

	it('returns 401 when apiKey cookie is missing', async () => {
		const res = await request.get('/api/v0/listing').set('Cookie', AUTH);
		expect(res.status).toBe(401);
	});

	it('returns listings with valid cookies', async () => {
		const res = await request.get('/api/v0/listing').set('Cookie', AUTH_WITH_KEY);
		expect(res.status).toBe(200);
		expect(res.body.length).toBeGreaterThan(0);
		expect(res.body[0].title).toBe('Test Widget');
	});

	it('returns 500 when CorporateService fails', async () => {
		server.use(
			http.get('http://127.0.0.1:3040/api/v0/listing', () => {
				return new HttpResponse(null, { status: 500 });
			}),
		);
		const res = await request.get('/api/v0/listing').set('Cookie', AUTH_WITH_KEY);
		expect(res.status).toBe(500);
	});
});

describe('POST /listing', () => {
	const newListing = {
		title: 'New Widget',
		description: 'A new widget',
		price: 9.99,
		stock: 5,
		categories: ['test'],
	};

	it('returns 401 without auth cookie', async () => {
		const res = await request.post('/api/v0/listing').send(newListing);
		expect(res.status).toBe(401);
	});

	it('returns 401 when apiKey cookie is missing', async () => {
		const res = await request.post('/api/v0/listing').set('Cookie', AUTH).send(newListing);
		expect(res.status).toBe(401);
	});

	it('creates listing and returns 201', async () => {
		const res = await request.post('/api/v0/listing').set('Cookie', AUTH_WITH_KEY).send(newListing);
		expect(res.status).toBe(201);
		expect(res.body.title).toBe('New Widget');
	});

	it('returns 500 when CorporateService fails', async () => {
		server.use(
			http.post('http://127.0.0.1:3040/api/v0/listing', () => {
				return new HttpResponse(null, { status: 500 });
			}),
		);
		const res = await request.post('/api/v0/listing').set('Cookie', AUTH_WITH_KEY).send(newListing);
		expect(res.status).toBe(500);
	});
});

describe('PUT /listing/:id', () => {
	const update = { title: 'Updated Widget', price: 14.99 };

	it('returns 401 without auth cookie', async () => {
		const res = await request.put('/api/v0/listing/mock-listing-id').send(update);
		expect(res.status).toBe(401);
	});

	it('returns 401 when apiKey cookie is missing', async () => {
		const res = await request.put('/api/v0/listing/mock-listing-id').set('Cookie', AUTH).send(update);
		expect(res.status).toBe(401);
	});

	it('updates listing and returns 200', async () => {
		const res = await request.put('/api/v0/listing/mock-listing-id').set('Cookie', AUTH_WITH_KEY).send(update);
		expect(res.status).toBe(200);
		expect(res.body.title).toBe('Updated Widget');
	});

	it('returns 404 when listing is not found', async () => {
		const res = await request.put('/api/v0/listing/not-found').set('Cookie', AUTH_WITH_KEY).send(update);
		expect(res.status).toBe(404);
	});

	it('returns 500 when CorporateService fails', async () => {
		server.use(
			http.put('http://127.0.0.1:3040/api/v0/listing/:id', () => {
				return new HttpResponse(null, { status: 500 });
			}),
		);
		const res = await request.put('/api/v0/listing/mock-listing-id').set('Cookie', AUTH_WITH_KEY).send(update);
		expect(res.status).toBe(500);
	});
});

describe('DELETE /listing/:id', () => {
	it('returns 401 without auth cookie', async () => {
		const res = await request.delete('/api/v0/listing/mock-listing-id');
		expect(res.status).toBe(401);
	});

	it('returns 401 when apiKey cookie is missing', async () => {
		const res = await request.delete('/api/v0/listing/mock-listing-id').set('Cookie', AUTH);
		expect(res.status).toBe(401);
	});

	it('deletes listing and returns 204', async () => {
		const res = await request.delete('/api/v0/listing/mock-listing-id').set('Cookie', AUTH_WITH_KEY);
		expect(res.status).toBe(204);
	});

	it('returns 404 when listing is not found', async () => {
		const res = await request.delete('/api/v0/listing/not-found').set('Cookie', AUTH_WITH_KEY);
		expect(res.status).toBe(404);
	});
});
