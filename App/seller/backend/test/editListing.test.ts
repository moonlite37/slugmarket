import { beforeEach, describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import type { Response } from 'supertest';
import { request } from './setup';
import { server } from '../vitest.setup';

const listingServiceUpdateUrl = 'http://127.0.0.1:3011/api/v0/listing/:id';

const originalListing = {
	title: 'Original Listing',
	description: 'Original description',
	price: 10,
	stock: 5,
	categories: ['test'],
};

const editedListing = {
	title: 'Edited Listing',
	description: 'Edited description',
	price: 12.5,
	stock: 3,
	categories: ['test'],
};

const successfulUpdateHandler = http.put(
	listingServiceUpdateUrl,
	async ({ params, request }) => {
		const body = (await request.json()) as Record<string, unknown>;

		return HttpResponse.json({
			id: params.id,
			...originalListing,
			created: '2026-05-31',
			author: 'mock-id',
			...body,
		});
	},
);

describe('edit listing', () => {
	let listingId: string;
	let res: Response;

	beforeEach(async () => {
		server.use(successfulUpdateHandler);
		const created = await request
			.post('/api/v0/listing')
			.set('Cookie', 'authToken=mock-token')
			.send(originalListing);

		listingId = created.body.id;
	});

	const updateListing = async () => {
		res = await request
			.put(`/api/v0/listing/${listingId}`)
			.set('Cookie', 'authToken=mock-token')
			.send(editedListing);
	};

	it('creates a listing, edits its contents, and returns 200', async () => {
		await updateListing();
		expect(res.status).toBe(200);
	});

	it('returns the updated listing id', async () => {
		await updateListing();
		expect(res.body.id).toBe(listingId);
	});

	it('returns the updated listing title', async () => {
		await updateListing();
		expect(res.body.title).toBe(editedListing.title);
	});

	it('returns the updated listing description', async () => {
		await updateListing();
		expect(res.body.description).toBe(editedListing.description);
	});

	it('returns the updated listing price', async () => {
		await updateListing();
		expect(res.body.price).toBe(editedListing.price);
	});

	it('returns the updated listing stock', async () => {
		await updateListing();
		expect(res.body.stock).toBe(editedListing.stock);
	});

	it('returns the updated listing categories', async () => {
		await updateListing();
		expect(res.body.categories).toEqual(editedListing.categories);
	});

	it('returns the updated listing created date', async () => {
		await updateListing();
		expect(res.body.created).toBe('2026-05-31');
	});

	it('returns the updated listing author', async () => {
		await updateListing();
		expect(res.body.author).toBe('mock-id');
	});

	it('returns error when ListingService update fails', async () => {
		server.use(
			http.put(listingServiceUpdateUrl, () => {
				return new HttpResponse(null, { status: 500 });
			}),
		);

		await updateListing();
		expect(res.status).toBe(500);
	});
});
