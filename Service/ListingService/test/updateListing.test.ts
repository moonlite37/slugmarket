import {describe, it, expect} from 'vitest';
import supertest from 'supertest';
import {server} from './setup';

describe('update listing', () => {
	it('updates a listing and returns 200', async () => {
		const created = await supertest(server)
			.post('/api/v0/listing')
			.send({
				authorId: '00000000-0000-0000-0000-000000000002',
				title: 'Before Update',
				description: 'Original description',
				price: 10,
				stock: 5,
				categories: ['test'],
			})
			.expect(201);

		const res = await supertest(server)
			.put(`/api/v0/listing/${created.body.id}`)
			.send({
				title: 'After Update',
				price: 20,
			});
		expect(res.status).toBe(200);
		expect(res.body.title).toBe('After Update');
		expect(res.body.price).toBe(20);
		expect(res.body.description).toBe('Original description');
	});

	it('returns 404 for non-existent listing', async () => {
		await supertest(server)
			.put('/api/v0/listing/00000000-0000-0000-0000-000000000099')
			.send({ title: 'Nope' })
			.expect(404);
	});

	it('updates only provided fields', async () => {
		const created = await supertest(server)
			.post('/api/v0/listing')
			.send({
				authorId: '00000000-0000-0000-0000-000000000002',
				title: 'Partial Test',
				description: 'Keep this',
				price: 50,
				stock: 10,
				categories: ['partial'],
			})
			.expect(201);

		const res = await supertest(server)
			.put(`/api/v0/listing/${created.body.id}`)
			.send({ stock: 99 });
		expect(res.status).toBe(200);
		expect(res.body.stock).toBe(99);
		expect(res.body.title).toBe('Partial Test');
		expect(res.body.description).toBe('Keep this');
		expect(res.body.price).toBe(50);
	});
});

it('updates categories and images', async () => {
	const created = await supertest(server)
		.post('/api/v0/listing')
		.send({
			authorId: '00000000-0000-0000-0000-000000000002',
			title: 'Cat and Img Test',
			description: 'Testing categories and images update',
			price: 25,
			stock: 5,
			categories: ['old'],
			images: ['old.jpg'],
		})
		.expect(201);

	const res = await supertest(server)
		.put(`/api/v0/listing/${created.body.id}`)
		.send({
			categories: ['new', 'updated'],
			images: ['new1.jpg', 'new2.jpg'],
		});
	expect(res.status).toBe(200);
	expect(res.body.categories).toEqual(['new', 'updated']);
	expect(res.body.images).toEqual(['new1.jpg', 'new2.jpg']);
});

it('updates description only', async () => {
	const created = await supertest(server)
		.post('/api/v0/listing')
		.send({
			authorId: '00000000-0000-0000-0000-000000000002',
			title: 'Desc Test',
			description: 'Old desc',
			price: 10,
			stock: 1,
			categories: ['test'],
		})
		.expect(201);

	const res = await supertest(server)
		.put(`/api/v0/listing/${created.body.id}`)
		.send({ description: 'New desc' });
	expect(res.status).toBe(200);
	expect(res.body.description).toBe('New desc');
	expect(res.body.title).toBe('Desc Test');
});
