import { Listing } from '.';
const LISTING_MICROSERVICE = 'http://127.0.0.1:3011/api/v0';
export class ListingService {
	public async getListingById(id: string) {
		const res = await fetch(`${LISTING_MICROSERVICE}/listing/${id}`);
		return await res.json();
	}

	public async getListing(minPrice: number | undefined, maxPrice: number | undefined, sort?: string, search?: string): Promise<Listing[]> {
		const params = new URLSearchParams();
		if (minPrice !== undefined) {
			params.append('minPrice', String(minPrice));
		}
		if (maxPrice !== undefined) {
			params.append('maxPrice', String(maxPrice));
		}
		if (sort) {
			params.append('sort', sort);
		}
		if (search) {
			params.append('search', search);
		}
		const res = await fetch(`${LISTING_MICROSERVICE}/listing?${params.toString()}`);
		return await res.json();
	}
}
