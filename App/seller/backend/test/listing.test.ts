import { describe, it, expect } from 'vitest';
import { request } from './setup';
import { server } from '../vitest.setup';
import { http, HttpResponse } from 'msw';

describe('get listings', () => {
	it('returns listings for authenticated seller', async () => {
		const res = await request
			.get('/api/v0/listing')
			.set('Cookie', 'authToken=mock-token');
		expect(res.status).toBe(200);
		expect(res.body.length).toBeGreaterThan(0);
		expect(res.body[0].title).toBe('My Widget');
	});

	it('returns 401 without auth cookie', async () => {
		const res = await request.get('/api/v0/listing');
		expect(res.status).toBe(401);
	});

    it('returns error when ListingService fails', async () => {
		server.use(
			http.get('http://127.0.0.1:3011/api/v0/listing', () => {
				return new HttpResponse(null, { status: 500 });
			}),
		);
		const res = await request
			.get('/api/v0/listing')
			.set('Cookie', 'authToken=mock-token');
		expect(res.status).toBe(500);
	});
});

describe('get listings by id', () => {
	it('returns listings for authenticated seller', async () => {
		const res = await request
			.get('/api/v0/listing/mock-1')
			.set('Cookie', 'authToken=mock-token');
		expect(res.status).toBe(200);
		expect(res.body.title).toBe('My Widget');
	});

	it('returns 404 on not found id', async () => {
		const res = await request
			.get('/api/v0/listing/eeeee')
			.set('Cookie', 'authToken=mock-token');
		expect(res.status).toBe(404);
	});
});