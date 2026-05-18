import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { request } from './setup';
import { server } from '../vitest.setup';

const AUTH = 'authToken=mock-token';
const AUTH_WITH_KEY = 'authToken=mock-token; apiKey=mock-api-key';

describe('GET /order', () => {
	it('returns 401 without auth cookie', async () => {
		const res = await request.get('/api/v0/order');
		expect(res.status).toBe(401);
	});

	it('returns 401 when apiKey cookie is missing', async () => {
		const res = await request.get('/api/v0/order').set('Cookie', AUTH);
		expect(res.status).toBe(401);
	});

	it('returns orders with valid cookies', async () => {
		const res = await request.get('/api/v0/order').set('Cookie', AUTH_WITH_KEY);
		expect(res.status).toBe(200);
		expect(res.body.length).toBeGreaterThan(0);
		expect(res.body[0].id).toBe('mock-order-id');
	});

	it('returns 500 when CorporateService fails', async () => {
		server.use(
			http.get('http://127.0.0.1:3040/api/v0/order', () => {
				return new HttpResponse(null, { status: 500 });
			}),
		);
		const res = await request.get('/api/v0/order').set('Cookie', AUTH_WITH_KEY);
		expect(res.status).toBe(500);
	});
});

describe('PUT /order/:id', () => {
	it('returns 401 without auth cookie', async () => {
		const res = await request.put('/api/v0/order/mock-order-id').send({ status: 'shipped' });
		expect(res.status).toBe(401);
	});

	it('returns 401 when apiKey cookie is missing', async () => {
		const res = await request
			.put('/api/v0/order/mock-order-id')
			.set('Cookie', AUTH)
			.send({ status: 'shipped' });
		expect(res.status).toBe(401);
	});

	it('updates order status and returns 200', async () => {
		const res = await request
			.put('/api/v0/order/mock-order-id')
			.set('Cookie', AUTH_WITH_KEY)
			.send({ status: 'shipped' });
		expect(res.status).toBe(200);
		expect(res.body.status).toBe('shipped');
	});

	it('returns 500 when CorporateService fails', async () => {
		server.use(
			http.put('http://127.0.0.1:3040/api/v0/order/:id', () => {
				return new HttpResponse(null, { status: 500 });
			}),
		);
		const res = await request
			.put('/api/v0/order/mock-order-id')
			.set('Cookie', AUTH_WITH_KEY)
			.send({ status: 'shipped' });
		expect(res.status).toBe(500);
	});
});
