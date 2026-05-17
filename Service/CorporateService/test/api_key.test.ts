import { describe, it, beforeAll, afterAll,  afterEach } from 'vitest';
import supertest from 'supertest';
import { server } from './setup';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const authServer = setupServer(
	http.get('http://127.0.0.1:3010/api/v0/check', ({request}) => {
		const cookie = request.headers.get('authorization') ?? '';
		console.log(cookie);
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
);

beforeAll(() => {
	authServer.listen();
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


