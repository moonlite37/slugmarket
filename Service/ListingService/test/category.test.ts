import {describe, expect, it} from 'vitest';
import supertest from 'supertest';
import {server} from './setup';

describe('get category', () => {
	it('success', async () => {
		const res = await supertest(server).get('/api/v0/category');
		expect(res.status).toBe(200);
	});
	it('is iterable', async () => {
		const res = await supertest(server).get('/api/v0/category');
		expect(res.body.length).toBeGreaterThan(0);
	});
	it('has name', async () => {
		const res = await supertest(server).get('/api/v0/category');
		expect(res.body[0].name).toBeDefined();
	});
});

describe('post category', () => {
	it('success', async () => {
		const res = await supertest(server).post('/api/v0/category')
			.send({name: 'new category'});
		expect(res.status).toBe(201);
	});
	it('returns uuid', async () => {
		const res = await supertest(server).post('/api/v0/category')
			.send({name: 'new category'});
		expect(res.body.id).toBeDefined();
	});
});

describe('delete category', () => {
	const badId = '00000000-0000-0000-0000-000000002222';
	it('success', async () => {
		const {id} = (await supertest(server).post('/api/v0/category')
			.send({name: 'new category'})).body;
		const res = await supertest(server).delete(`/api/v0/category/${id}`);
		expect(res.status).toBe(204);
	});
	it('not found', async () => {
		const res = await supertest(server).delete(`/api/v0/category/${badId}`);
		expect(res.status).toBe(404);
	});
});

