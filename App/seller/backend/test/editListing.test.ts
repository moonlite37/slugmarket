import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { request } from './setup';
import { server } from '../vitest.setup';

describe('edit listing', () => {
	it('creates a listing, edits its contents, and returns 200', async () => {
		server.use(
			http.put(
				'http://127.0.0.1:3011/api/v0/listing/:id',
				async ({ params, request }) => {
					const body = (await request.json()) as Record<string, unknown>;

					return HttpResponse.json({
						id: params.id,
						title: 'Original Listing',
						description: 'Original description',
						price: 10,
						stock: 5,
						categories: ['test'],
						created: '2026-05-31',
						author: 'mock-id',
						...body,
					});
				},
			),
		);

		const created = await request
			.post('/api/v0/listing')
			.set('Cookie', 'authToken=mock-token')
			.send({
				title: 'Original Listing',
				description: 'Original description',
				price: 10,
				stock: 5,
				categories: ['test'],
			});

		const res = await request
			.put(`/api/v0/listing/${created.body.id}`)
			.set('Cookie', 'authToken=mock-token')
			.send({
				title: 'Edited Listing',
				description: 'Edited description',
				price: 12.5,
				stock: 3,
				categories: ['test'],
			});

		expect(res.status).toBe(200);
	});

	it('returns error when ListingService update fails', async () => {
		server.use(
			http.put('http://127.0.0.1:3011/api/v0/listing/:id', () => {
				return new HttpResponse(null, { status: 500 });
			}),
		);

		const res = await request
			.put('/api/v0/listing/mock-listing-id')
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
});
