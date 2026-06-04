import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { request } from './setup';
import { server } from '../vitest.setup';

describe('POST /api/v0/image', () => {
	it('returns 201 with image URL', async () => {
		server.use(
			http.post('http://127.0.0.1:3018/api/v0/image', () => {
				return HttpResponse.json({ url: 'https://s3.amazonaws.com/test-image.png' }, { status: 201 });
			}),
		);
		const res = await request.post('/api/v0/image')
			.set('Cookie', 'authToken=mock-token')
			.attach('image', Buffer.from('fake-png-data'), 'test.png');
		expect(res.status).toBe(201);
		expect(res.body.url).toBe('https://s3.amazonaws.com/test-image.png');
	});

	it('returns 401 without auth', async () => {
		const res = await request.post('/api/v0/image')
			.attach('image', Buffer.from('fake-png-data'), 'test.png');
		expect(res.status).toBe(401);
	});
});
