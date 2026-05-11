import {describe, it, expect} from 'vitest';
import supertest from 'supertest';
import {server} from './setup';

describe('delete listing', () => {
	it('deletes a listing and returns 204', async () => {
		const created = await supertest(server)
			.post('/api/v0/listing')
			.send({
				authorId: '00000000-0000-0000-0000-000000000030',
				title: 'To Be Deleted',
				description: 'Will be removed',
				price: 5,
				stock: 1,
				categories: ['test'],
			})
			.expect(201);

		await supertest(server)
			.delete(`/api/v0/listing/${created.body.id}`)
			.expect(204);

		const res = await supertest(server).get('/api/v0/listing');
		const titles = res.body.map((l: { title: string }) => l.title);
		expect(titles).not.toContain('To Be Deleted');
	});

	it('returns 404 for non-existent listing', async () => {
	    await supertest(server)
		    .delete('/api/v0/listing/00000000-0000-0000-0000-000000000099')
		    .expect(404);
	});
});