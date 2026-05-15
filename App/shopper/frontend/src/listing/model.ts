export interface Listing {
  id: string;
  author: string;
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
	maxPrice: number | undefined
) {
	const params = new URLSearchParams();
	if (minPrice !== undefined) {
		params.append("minPrice", String(minPrice));
	}
	if (maxPrice !== undefined) {
		params.append("maxPrice", String(maxPrice));
	}
	const query = `/shopper/api/v0/listing?${params.toString()}`;
	const res = await fetch(query);
	return res.json();
}