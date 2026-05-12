const LISTING_MICROSERVICE = 'http://127.0.0.1:3011/api/v0';

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
	public async getListings(userId: string): Promise<Listing[]> {
		const res = await fetch(`${LISTING_MICROSERVICE}/listing?author=${userId}`);
		if (!res.ok) {
			throw new Error('Failed to fetch listings');
		}
		return res.json();
	}

	public async createListing(userId: string, listing: NewListing): Promise<Listing> {
		const res = await fetch(`${LISTING_MICROSERVICE}/listing`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ ...listing, authorId: userId }),
		});
		if (res.status !== 201) {
			throw new Error('Failed to create listing');
		}
		return res.json();
	}
}
