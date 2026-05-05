import {expect, it} from 'vitest'
import supertest from 'supertest'
import {server} from './setup';

it('return code', async () => {
    const res = await supertest(server)
    .post('/api/v0/login')
    .send({ email: 'johnpork@email.com', password: 'johnpork' });
    expect(res.status).toBe(200)
})
