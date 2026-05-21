import {describe, expect, it} from 'vitest';
import {request} from './setup';
import {sessionId, userId, item} from './data';

describe('GET /api/v0/cart', () => {
	it('returns empty array for a guest with no cart', async () => {
		const res = await request.get('/api/v0/cart').query({sessionId});
		expect(res.body).toEqual([]);
	});

	it('returns item for a guest after adding one', async () => {
		await request.post('/api/v0/cart/item').send({sessionId, item});
		const res = await request.get('/api/v0/cart').query({sessionId});
		expect(res.body).toHaveLength(1);
		expect(res.body[0].listing_id).toBe(item.listing_id);
	});

	it('returns item for a logged-in user after adding one', async () => {
		await request.post('/api/v0/cart/item').send({
			sessionId: '00000000-0000-0000-0000-000000000003',
			userId,
			item,
		});
		const res = await request.get('/api/v0/cart').query({userId});
		expect(res.body).toHaveLength(1);
		expect(res.body[0].listing_id).toBe(item.listing_id);
	});

	it('increments quantity when same item is added again', async () => {
		await request.post('/api/v0/cart/item').send({sessionId, item});
		await request.post('/api/v0/cart/item').send({sessionId, item});
		const res = await request.get('/api/v0/cart').query({sessionId});
		expect(res.body[0].quantity).toBe(2);
	});

	it('returns two items when different items are added', async () => {
		await request.post('/api/v0/cart/item').send({sessionId, item});
		await request.post('/api/v0/cart/item').send({
			sessionId,
			item: {...item, listing_id: '00000000-0000-0000-0000-000000000011', name: 'Red Hoodie'},
		});
		const res = await request.get('/api/v0/cart').query({sessionId});
		expect(res.body).toHaveLength(2);
	});
});
