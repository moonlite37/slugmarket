import { Listing } from ".";
const LISTING_MICROSERVICE = 'http://localhost:3011/api/v0';

export class ListingService {
	public async getListing(): Promise<Listing[]> {
		const res = await fetch(`${LISTING_MICROSERVICE}/listing`);
		return await res.json();
	}
}
