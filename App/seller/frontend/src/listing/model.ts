export interface Listing {
	id: string;
	title: string;
	description: string;
	price: number;
	stock: number;
	created: string;
}

export async function getListings(): Promise<Listing[]> {
	const res = await fetch('/seller/api/v0/listing', {
		credentials: 'include',
	});
	if (!res.ok) return [];
	return res.json();
}
