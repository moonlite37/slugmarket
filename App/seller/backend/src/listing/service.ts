import { Listing, NewListing, UpdateListing } from '.';

const LISTING_MICROSERVICE = 'http://127.0.0.1:3011/api/v0';

export class ListingService {
	public async getListings(userId: string): Promise<Listing[]> {
		const res = await fetch(`${LISTING_MICROSERVICE}/listing?author=${userId}`);
		if (!res.ok) {
			throw new Error('Failed to fetch listings');
		}
		return res.json();
	}

	public async getListingById(userId: string, id:string): Promise<Listing[]> {
		const res = await fetch(`${LISTING_MICROSERVICE}/listing?author=${userId}`);
		const listings = await res.json()
		const listing = listings.find((l:Listing) => l.id === id);
		return listing;
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

	public async updateListing(
		id: string,
		listing: UpdateListing,
	): Promise<Listing> {
		const res = await fetch(`${LISTING_MICROSERVICE}/listing/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(listing),
		});
		if (!res.ok) {
			throw new Error('Failed to update listing');
		}
		return res.json();
	}
}
