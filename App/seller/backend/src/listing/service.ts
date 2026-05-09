const LISTING_MICROSERVICE = 'http://localhost:3011/api/v0';

interface NewListing {
	title: string;
	description: string;
	price: number;
	stock: number;
	categories: string[];
	images?: string[];
}

interface Listing {
	id: string;
	title: string;
	description: string;
	price: number;
	stock: number;
	categories: string[];
	images?: string[];
	created: string;
	author: string;
}

export class ListingService {
	public async createListing(token: string | undefined, listing: NewListing): Promise<Listing> {
		if (!token) {
			throw new Error('Unauthorized');
		}
		const res = await fetch(`${LISTING_MICROSERVICE}/listing`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
			body: JSON.stringify(listing),
		});
		if (res.status !== 201) {
			throw new Error('Failed to create listing');
		}
		return res.json();
	}
}