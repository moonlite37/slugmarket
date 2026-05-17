import { describe, it, beforeAll, afterAll,  afterEach } from 'vitest';
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
				roles: ['seller', 'shopper'],
		    });
		}
		return HttpResponse.json({
			id: '00000000-0000-0000-0000-000000000001',
			roles: ['seller','corporate'],
		});
	}),
	http.post('http://127.0.0.1:3011/api/v0/listing', ({request}) => {
		return HttpResponse.json({
			...request.body,
		});
	}),
);

beforeAll(() => {
	authServer.listen({
		onUnhandledRequest: 'bypass',
	});
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


describe('Create post with API', () => {
	it('Rejects invalid key', async () => {
		await supertest(server).post('/api/v0/listing')
			.set('Authorization', 'failing_api_key')
			.send(newListing)
			.expect(401);
	});
	it('Correct status on good creation', async () => {
		const res = (await supertest(server).post('/api/v0/generate')
			.set('Authorization', 'valid'));
		const key = res.text;
		console.log(key);
		await supertest(server).post('/api/v0/listing')
			.set('Authorization', key)
			.send(newListing)
			.expect(201);
	});
});