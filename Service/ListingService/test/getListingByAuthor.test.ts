import {describe, it, expect} from 'vitest';
import supertest from 'supertest';
import {server} from './setup';

describe('get listing by author', () => {
	it('returns only listings for the specified author', async () => {
		const authorA = '00000000-0000-0000-0000-000000000010';
		const authorB = '00000000-0000-0000-0000-000000000020';

		await supertest(server)
			.post('/api/v0/listing')
			.send({
				authorId: authorA,
				title: 'Author A Widget',
				description: 'By author A',
				price: 10,
				stock: 5,
				categories: ['00000000-0000-0000-0000-000000000011'],
			})
			.expect(201);

		await supertest(server)
			.post('/api/v0/listing')
			.send({
				authorId: authorB,
				title: 'Author B Widget',
				description: 'By author B',
				price: 20,
				stock: 3,
				categories: ['00000000-0000-0000-0000-000000000011'],
			})
			.expect(201);

		const res = await supertest(server)
			.get(`/api/v0/listing?author=${authorA}`);
		expect(res.status).toBe(200);
		const titles = res.body.map((l: { title: string }) => l.title);
		expect(titles).toContain('Author A Widget');
		expect(titles).not.toContain('Author B Widget');
	});
});