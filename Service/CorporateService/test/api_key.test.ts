import { describe, it, beforeAll, afterAll, afterEach } from 'vitest';
import supertest from 'supertest';
import { server } from './setup';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const authServer = setupServer(
	http.get('http://127.0.0.1:3010/api/v0/check', ({request}) => {
		const cookie = request.headers.get('authorization') ?? '';
		if (!cookie) {
			return new HttpResponse(null, { status: 401 });
		}
		if (cookie === 'invalid') {
			return HttpResponse.json({
				id: '00000000-0000-0000-0000-000000000001',
				name: 'something',
				roles: ['shopper'],
			});
		}
		return HttpResponse.json({
			id: '00000000-0000-0000-0000-000000000001',
			name: 'something',
			roles: ['seller'],
		});
	}),
	http.post('http://127.0.0.1:3011/api/v0/listing', () => {
		return HttpResponse.json(
			{ id: 'mock-id', title: 'Test Widget' },
			{ status: 201 },
		);	}),
	http.get('http://127.0.0.1:3011/api/v0/listing', () => {
		return HttpResponse.json([{ id: 'mock-1', title: 'Mock Listing' }]);
	}),
	http.put('http://127.0.0.1:3011/api/v0/listing/exists', async ({request}) => {
		const body = await request.json();
		return HttpResponse.json({ id: 'exists', ...body as object });
	}),
	http.put('http://127.0.0.1:3011/api/v0/listing/noexists', () => {
		return new HttpResponse(null, { status: 404 });
	}),
	http.delete('http://127.0.0.1:3011/api/v0/listing/exists', () => {
		return HttpResponse.text('', { status: 204 });
	}),
	http.delete('http://127.0.0.1:3011/api/v0/listing/noexists', () => {
		return HttpResponse.text('', { status: 404 });
	}),
	http.post('http://127.0.0.1:4000/graphql', async ({request}) => {
		const body = await request.json() as {query: string};
		if (body.query.includes('ordersBySeller')) {
			return HttpResponse.json({
				data: { ordersBySeller: [{ id: 'o1', items: 'Widget', total: 10, status: 'pending' }] },
			});
		}
		if (body.query.includes('updateOrderStatus')) {
			return HttpResponse.json({
				data: { updateOrderStatus: { id: 'o1', status: 'fulfilled' } },
			});
		}
		return HttpResponse.json({ data: {} });
	}),
);

beforeAll(() => {
	authServer.listen({ onUnhandledRequest: 'bypass' });
});
afterEach(() => {
	authServer.resetHandlers();
});
afterAll(() => {
	authServer.close();
});


describe('docs', () => {
	it('GET /api/v0/docs/', async () => {
		await supertest(server).get('/api/v0/docs/').expect(200);
	});
});

describe('Generate Key', () => {
	it('Can generate key with correct credentials', async () => {
		await supertest(server).post('/api/v0/generate')
			.set('Authorization', 'valid')
			.expect(201);
	});
	it('Cant generate key with no perms', async () => {
		await supertest(server).post('/api/v0/generate')
			.expect(401);
	});
	it('Cant generate key with incorrect perms', async () => {
		await supertest(server).post('/api/v0/generate')
			.set('Authorization', 'invalid')
			.expect(401);
	});
});

const newListing = {
	title: 'Test Widget',
	description: 'A test widget for sale',
	price: 9.99,
	stock: 10,
	categories: ['test'],
};

describe('Create listing with API', () => {
	it('Rejects invalid key', async () => {
		await supertest(server).post('/api/v0/listing')
			.set('Authorization', 'failing_api_key')
			.send(newListing)
			.expect(401);
	});
	it('Correct status on good creation', async () => {
		const res = await supertest(server).post('/api/v0/generate')
			.set('Authorization', 'valid');
		const key = res.text;
		await supertest(server).post('/api/v0/listing')
			.set('Authorization', key)
			.send(newListing)
			.expect(201);
	});
});

describe('Get listing with API', () => {
	it('Correct status on good auth', async () => {
		const res = await supertest(server).post('/api/v0/generate')
			.set('Authorization', 'valid');
		const key = res.text;
		await supertest(server).get('/api/v0/listing')
			.set('Authorization', key)
			.expect(200);
	});
	it('Correct status on bad auth', async () => {
		await supertest(server).get('/api/v0/listing')
			.set('Authorization', 'poopity scoop')
			.expect(401);
	});
});

describe('Delete listing with API', () => {
	it('Correct status on good auth', async () => {
		const res = await supertest(server).post('/api/v0/generate')
			.set('Authorization', 'valid');
		const key = res.text;
		await supertest(server).delete('/api/v0/listing/exists')
			.set('Authorization', key)
			.expect(204);
	});
	it('Correct status on not found', async () => {
		const res = await supertest(server).post('/api/v0/generate')
			.set('Authorization', 'valid');
		const key = res.text;
		await supertest(server).delete('/api/v0/listing/noexists')
			.set('Authorization', key)
			.expect(404);
	});
	it('Correct status on bad auth', async () => {
		await supertest(server).delete('/api/v0/listing/exists')
			.set('Authorization', 'poopity scoop')
			.expect(401);
	});
});

describe('Update listing with API', () => {
	it('Updates a listing with valid key', async () => {
		const res = await supertest(server).post('/api/v0/generate')
			.set('Authorization', 'valid');
		const key = res.text;
		await supertest(server).put('/api/v0/listing/exists')
			.set('Authorization', key)
			.send({ title: 'Updated Title', price: 99 })
			.expect(200);
	});
	it('Returns 404 for non-existent listing', async () => {
		const res = await supertest(server).post('/api/v0/generate')
			.set('Authorization', 'valid');
		const key = res.text;
		await supertest(server).put('/api/v0/listing/noexists')
			.set('Authorization', key)
			.send({ title: 'Nope' })
			.expect(404);
	});
	it('Rejects update with invalid key', async () => {
		await supertest(server).put('/api/v0/listing/exists')
			.set('Authorization', 'poopity scoop')
			.send({ title: 'Nope' })
			.expect(401);
	});
});

describe('Get orders with API', () => {
	it('Gets orders with valid key', async () => {
		const res = await supertest(server).post('/api/v0/generate')
			.set('Authorization', 'valid');
		const key = res.text;
		await supertest(server).get('/api/v0/order')
			.set('Authorization', key)
			.expect(200);
	});
	it('Rejects with invalid key', async () => {
		await supertest(server).get('/api/v0/order')
			.set('Authorization', 'poopity scoop')
			.expect(401);
	});
});

describe('Update order status with API', () => {
	it('Updates order with valid key', async () => {
		const res = await supertest(server).post('/api/v0/generate')
			.set('Authorization', 'valid');
		const key = res.text;
		await supertest(server).put('/api/v0/order/o1')
			.set('Authorization', key)
			.send({ status: 'fulfilled' })
			.expect(200);
	});
	it('Rejects with invalid key', async () => {
		await supertest(server).put('/api/v0/order/o1')
			.set('Authorization', 'poopity scoop')
			.send({ status: 'fulfilled' })
			.expect(401);
	});
});

describe('Error handling', () => {
	it('Returns 404 on invalid route', async () => {
		await supertest(server).get('/api/v0/nonexistent')
			.expect(404);
	});
});
