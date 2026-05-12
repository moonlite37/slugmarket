import { describe, it, expect } from 'vitest';
import { request } from './setup';
import { server } from '../vitest.setup';
import { http, HttpResponse } from 'msw';

describe('create listing', () => {
	it('proxies create listing to ListingService', async () => {
		const res = await request
			.post('/api/v0/listing')
			.set('Cookie', 'authToken=mock-token')
			.send({
				title: 'Proxy Test',
				description: 'Testing proxy',
				price: 9.99,
				stock: 5,
				categories: ['test'],
			});
		expect(res.status).toBe(201);
		expect(res.body.title).toBe('Proxy Test');
	});

	it('returns error when ListingService fails', async () => {
		server.use(
			http.post('http://127.0.0.1:3011/api/v0/listing', () => {
				return new HttpResponse(null, { status: 500 });
			}),
		);
		const res = await request
			.post('/api/v0/listing')
			.set('Cookie', 'authToken=mock-token')
			.send({
				title: 'Will Fail',
				description: 'Service down',
				price: 9.99,
				stock: 1,
				categories: ['test'],
			});
		expect(res.status).toBe(500);
	});

	it('returns 401 when no auth cookie', async () => {
		const res = await request
			.post('/api/v0/listing')
			.send({
				title: 'No Auth',
				description: 'Missing token',
				price: 9.99,
				stock: 1,
				categories: ['test'],
			});
		expect(res.status).toBe(401);
	});
});
