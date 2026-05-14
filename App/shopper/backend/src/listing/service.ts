import { Listing } from ".";
const LISTING_MICROSERVICE = 'http://127.0.0.1:3011/api/v0';

export class ListingService {
	public async getListing(minPrice:number|undefined, maxPrice:number|undefined): Promise<Listing[]> {
		const params = new URLSearchParams();
		if (minPrice !== undefined) {
			params.append("minPrice", String(minPrice));
		}
		if (maxPrice !== undefined) {
			params.append("maxPrice", String(maxPrice));
		}
		const res = await fetch(`${LISTING_MICROSERVICE}/listing?${params.toString()}`);
		return await res.json();
	}
}
