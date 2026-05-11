import { describe, it, expect, vi, beforeEach } from 'vitest';

import { getListings, deleteListing } from '../src/app/listing/actions';

const mockListings = [
	{ id: 'mock-1', author: 'a1', title: 'Widget', description: 'A widget', price: 10, stock: 5, created: '2026-05-10' },
];

beforeEach(() => {
	vi.restoreAllMocks();
});

describe('listing actions', () => {
	it('getListings returns listings', async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve(mockListings),
		});
		const listings = await getListings();
		expect(listings.length).toBe(1);
		expect(listings[0].title).toBe('Widget');
	});

	it('deleteListing calls delete', async () => {
		global.fetch = vi.fn().mockResolvedValue({ ok: true });
		await deleteListing('mock-1');
		expect(global.fetch).toHaveBeenCalledWith(
			'http://localhost:3011/api/v0/listing/mock-1',
			{ method: 'DELETE' },
		);
	});
});