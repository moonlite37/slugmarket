import 'server-only';

import { Listing } from '.';

const LISTING_MICROSERVICE = 'http://localhost:3011/api/v0';

export class ListingService {
	public async getAll(): Promise<Listing[]> {
		const res = await fetch(`${LISTING_MICROSERVICE}/listing`);
		if (!res.ok) {
			throw new Error('Failed to fetch listings');
		}
		return res.json();
	}

	public async deleteListing(id: string): Promise<void> {
		const res = await fetch(`${LISTING_MICROSERVICE}/listing/${id}`, {
			method: 'DELETE',
		});
		if (!res.ok) {
			throw new Error('Failed to delete listing');
		}
	}
}