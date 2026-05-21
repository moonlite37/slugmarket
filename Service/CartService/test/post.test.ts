import {describe, expect, it} from 'vitest';
import {request} from './setup';
import {sessionId, userId, item} from './data';

describe('docs', () => {
	it('GET /api/v0/docs/ returns 200', async () => {
		await request.get('/api/v0/docs/').expect(200);
	});
});

describe('POST /api/v0/cart/item', () => {
	it('returns 201 for a guest adding an item', async () => {
		const res = await request.post('/api/v0/cart/item').send({
			sessionId,
			item,
		});
		expect(res.status).toBe(201);
	});

	it('returns 201 for a logged-in user adding an item', async () => {
		const res = await request.post('/api/v0/cart/item').send({
			sessionId: '00000000-0000-0000-0000-000000000003',
			userId,
			item,
		});
		expect(res.status).toBe(201);
	});

	it('increments quantity when same item is added again', async () => {
		await request.post('/api/v0/cart/item').send({ sessionId, item });
		const res = await request
			.post('/api/v0/cart/item')
			.send({ sessionId, item });
		expect(res.status).toBe(201);
	});

	it('appends a different item to the cart', async () => {
		const res = await request.post('/api/v0/cart/item').send({
			sessionId,
			item: {
				...item,
				listing_id: '00000000-0000-0000-0000-000000000011',
				name: 'Red Hoodie',
			},
		});
		expect(res.status).toBe(201);
	});

	it('returns 400 when sessionId is missing', async () => {
		const res = await request.post('/api/v0/cart/item').send({ item });
		expect(res.status).toBe(400);
	});

	it('returns 400 when item is missing', async () => {
		const res = await request.post('/api/v0/cart/item').send({ sessionId });
		expect(res.status).toBe(400);
	});
});
