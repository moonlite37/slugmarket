import {describe, expect, it} from 'vitest';
import supertest from 'supertest';
import {server} from './setup';
import {GetListing} from './listing.test';

describe('GET /listing/:id', () => {
	it('returns 200 for an existing listing', async () => {
		const id = (await GetListing()).body[0].id;
		const res = await supertest(server).get(`/api/v0/listing/${id}`);
		expect(res.status).toBe(200);
	});

	it('returns the correct listing', async () => {
		const listings = (await GetListing()).body;
		const id = listings[0].id;
		const res = await supertest(server).get(`/api/v0/listing/${id}`);
		expect(res.body.id).toBe(id);
		expect(res.body.title).toBe(listings[0].title);
	});

	it('returns 404 for a non-existing listing', async () => {
		const res = await supertest(server).get('/api/v0/listing/00000000-0000-0000-0000-000000000000');
		expect(res.status).toBe(404);
	});
});
