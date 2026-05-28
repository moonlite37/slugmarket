import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { request } from './setup';
import { server } from '../vitest.setup';

describe('gets a listing', () => {
	it('Returns correct status code', async () => {
		const res = await request.get('/api/v0/listing');
		expect(res.status).toBe(200);
	});
    it('Returns listings', async () => {
		const res = await request.get('/api/v0/listing');
		expect(res.body.length).toBe(1);
	});
	it('Accepts min and max price params', async () => {
		const res = await request.get('/api/v0/listing?minPrice=200&maxPrice=400');
		expect(res.status).toBe(200);
	});
});

describe('gets a listing by id', () => {
	it('returns 200 for an existing listing', async () => {
		const res = await request.get('/api/v0/listing/00000000-0000-0000-0000-000000000002');
		expect(res.status).toBe(200);
	});

	it('returns the listing data', async () => {
		const res = await request.get('/api/v0/listing/00000000-0000-0000-0000-000000000002');
		expect(res.body.title).toBe('Pork Chops');
	});

	it('returns 404 for a non-existing listing', async () => {
		server.use(
			http.get('http://127.0.0.1:3011/api/v0/listing/:id', () =>
				new HttpResponse(null, { status: 404 }),
			),
		);
		const res = await request.get('/api/v0/listing/00000000-0000-0000-0000-000000000000');
		expect(res.body).toEqual({});
	});
});