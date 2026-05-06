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
	it('sets http only cookie', async () => {
		const res = await Login('johnpork@email.com', 'johnpork');
		const setCookie = res.headers['set-cookie'];
		const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];
		const authCookie = cookies?.find((cookie) => cookie.startsWith('authToken='));
		expect(authCookie).toContain('HttpOnly');
	});
	it('rejects fake cred', async () => {
		const res = await Login('johnny@email.com', 'johnpork');
		expect(res.status).toBe(401);
	});
});
