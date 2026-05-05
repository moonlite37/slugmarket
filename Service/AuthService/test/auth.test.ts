import {describe, expect, it} from 'vitest';
import supertest from 'supertest';
import {server} from './setup';

export const Login = (email: string, password: string): Promise<supertest.Response>  => {
	return supertest(server)
		.post('/api/v0/login')
		.send({ email, password });
};
describe('login', () => {
	it('return code', async () => {
		const res = await Login('johnpork@email.com', 'johnpork');
		expect(res.status).toBe(200);
	});
	it('returns name', async () => {
		const res = await Login('johnpork@email.com', 'johnpork');
		expect(res.body.name).toBe('John Pork');
	});
	it('returns auth token', async () => {
		const res = await Login('anna@books.com', 'annaadmin');
		expect(res.body.authToken).toBeDefined();
	});
	it('fake user', async () => {
		const res = await Login('johnny@email.com', 'johnpork');
		expect(res.status).toBe(401);
	});
});
