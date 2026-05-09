import {describe, expect, it} from 'vitest';
import supertest from 'supertest';
import {server} from './setup';

export const GetListing = (): Promise<supertest.Response>  => {
	return supertest(server)
		.get('/api/v0/listing');
};

it('Errors on invalid URL', async () => {
	await supertest(server).get('/api/v0/entirely-invalid-path')
		.expect(404);
});

it('Serves API Docs', async () => {
	await supertest(server).get('/api/v0/docs/')
		.expect(200);
});


describe('listing', () => {
	it('return code', async () => {
		const res = await GetListing();
		expect(res.status).toBe(200);
	});
	it('returns array', async () => {
		const res = await GetListing();
		expect(res.body.length).toBeGreaterThan(0);
	});
	it('has correct attributes (1)', async () => {
		const res = await GetListing();
		expect(res.body[0].title).toBeDefined();
	});
	it('has correct attributes(2)', async () => {
		const res = await GetListing();
		expect(res.body[0].price).toBeDefined();
	});
});

describe('create listing', () => {
	it('creates a listing and returns 201', async () => {
		const res = await supertest(server)
			.post('/api/v0/listing')
			.send({
				title: 'Test Widget',
				description: 'A test widget for sale',
				price: 9.99,
				stock: 10,
				categories: ['test'],
			});
		expect(res.status).toBe(201);
		expect(res.body.title).toBe('Test Widget');
		expect(res.body.id).toBeDefined();
	});
});
