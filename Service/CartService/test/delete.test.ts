import {describe, expect, it} from 'vitest';
import {request} from './setup';
import {userId, item} from './data';

const secondItem = {
	listing_id: '00000000-0000-0000-0000-000000000011',
	name: 'Red Hoodie',
	price: 39.99,
	quantity: 1,
};

describe('DELETE /api/v0/cart/item/:listingId', () => {
	it('removes an item from the cart', async () => {
		await request.post('/api/v0/cart/item').send({userId, item});
		await request.delete(`/api/v0/cart/item/${item.listing_id}`).query({userId});
		const res = await request.get('/api/v0/cart').query({userId});
		expect(res.body).toEqual([]);
	});

	it('only removes the specified item leaving others intact', async () => {
		await request.post('/api/v0/cart/item').send({userId, item});
		await request.post('/api/v0/cart/item').send({userId, item: secondItem});
		await request.delete(`/api/v0/cart/item/${item.listing_id}`).query({userId});
		const res = await request.get('/api/v0/cart').query({userId});
		expect(res.body).toHaveLength(1);
		expect(res.body[0].listing_id).toBe(secondItem.listing_id);
	});
});
