import {describe, it, expect} from 'vitest';
import supertest from 'supertest';
import {server} from './setup';

const GetListing = (): Promise<supertest.Response> => {
	return supertest(server).get('/api/v0/listing');
};

describe('create listing', () => {
	it('creates a listing and returns 201', async () => {
		const res = await supertest(server)
			.post('/api/v0/listing')
			.send({
				authorId: '00000000-0000-0000-0000-000000000002',
				title: 'Test Widget',
				description: 'A test widget for sale',
				price: 9.99,
				stock: 10,
				categories: ['00000000-0000-0000-0000-000000000011'],
			});
		expect(res.status).toBe(201);
		expect(res.body.title).toBe('Test Widget');
		expect(res.body.id).toBeDefined();
		expect(res.body.author).toBe('00000000-0000-0000-0000-000000000002');
	});

	it('created listing appears in listing list', async () => {
		await supertest(server)
			.post('/api/v0/listing')
			.send({
				authorId: '00000000-0000-0000-0000-000000000002',
				title: 'Findable Widget',
				description: 'Should appear in list',
				price: 5.00,
				stock: 3,
				categories: ['00000000-0000-0000-0000-000000000011'],
			})
			.expect(201);

		const res = await GetListing();
		const titles = res.body.map((l: { title: string }) => l.title);
		expect(titles).toContain('Findable Widget');
	});

	it('creates listing with images', async () => {
		const res = await supertest(server)
			.post('/api/v0/listing')
			.send({
				authorId: '00000000-0000-0000-0000-000000000002',
				title: 'With Images',
				description: 'Has photos',
				price: 15.00,
				stock: 2,
				categories: ['00000000-0000-0000-0000-000000000011'],
				images: ['img1.jpg', 'img2.jpg'],
			});
		expect(res.status).toBe(201);
		expect(res.body.images).toContain('img1.jpg');
	});
	it('creates listing with no categories', async () => {
		const res = await supertest(server)
			.post('/api/v0/listing')
			.send({
				authorId: '00000000-0000-0000-0000-000000000002',
				title: 'With Images',
				description: 'Has photos',
				price: 15.00,
				stock: 2,
				categories: [],
				images: ['img1.jpg', 'img2.jpg'],
			});
		expect(res.status).toBe(201);
	});
});
