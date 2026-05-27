import {describe, it, expect} from 'vitest';
import supertest from 'supertest';
import {server} from './setup';

describe('Sort listings', () => {
	it('sorts by price ascending', async () => {
		const res = await supertest(server)
			.get('/api/v0/listing?sort=price_asc');
		expect(res.status).toBe(200);
		const prices = res.body.map((l: {price: number}) => l.price);
		for (let i = 1; i < prices.length; i++) {
			expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
		}
	});

	it('sorts by price descending', async () => {
		const res = await supertest(server)
			.get('/api/v0/listing?sort=price_desc');
		expect(res.status).toBe(200);
		const prices = res.body.map((l: {price: number}) => l.price);
		for (let i = 1; i < prices.length; i++) {
			expect(prices[i]).toBeLessThanOrEqual(prices[i - 1]);
		}
	});

	it('sorts by date ascending (oldest first)', async () => {
		const res = await supertest(server)
			.get('/api/v0/listing?sort=date_asc');
		expect(res.status).toBe(200);
		expect(res.body.length).toBeGreaterThan(0);
	});

	it('defaults to date descending (newest first)', async () => {
		const res = await supertest(server)
			.get('/api/v0/listing');
		expect(res.status).toBe(200);
		expect(res.body.length).toBeGreaterThan(0);
	});
});

describe('Search listings', () => {
	it('searches by title keyword', async () => {
		const res = await supertest(server)
			.get('/api/v0/listing?search=Pork');
		expect(res.status).toBe(200);
		expect(res.body.length).toBeGreaterThan(0);
		expect(res.body[0].title.toLowerCase()).toContain('pork');
	});

	it('searches by description keyword', async () => {
		const res = await supertest(server)
			.get('/api/v0/listing?search=wireless');
		expect(res.status).toBe(200);
		expect(res.body.length).toBeGreaterThan(0);
	});

	it('returns empty for no match', async () => {
		const res = await supertest(server)
			.get('/api/v0/listing?search=xyznonexistent');
		expect(res.status).toBe(200);
		expect(res.body.length).toBe(0);
	});

	it('search combines with price filter', async () => {
		const res = await supertest(server)
			.get('/api/v0/listing?search=Pork&minPrice=10');
		expect(res.status).toBe(200);
		res.body.forEach((l: {price: number}) => {
			expect(l.price).toBeGreaterThanOrEqual(10);
		});
	});
});
