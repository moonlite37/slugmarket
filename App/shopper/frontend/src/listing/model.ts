export interface Listing {
	id: string;
	author: string;
	username: string;
	title: string;
	description: string;
	created: string;
	price: number;
	discountPrice?: number;
	stock: number;
	categories: string[];
	images: string[];
}
export async function getListing(
	minPrice: number | undefined,
	maxPrice: number | undefined,
	sort?: string,
	search?: string,
	category?: string,
) {
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
	if (category) {
		params.append('category', category);
	}
	const query = `/shopper/api/v0/listing?${params.toString()}`;
	const res = await fetch(query);
	return res.json();
}

export async function getListingById(id: string): Promise<Listing | null> {
	const res = await fetch(`/shopper/api/v0/listing/${id}`);
	if (!res.ok) return null;
	return res.json();
}
