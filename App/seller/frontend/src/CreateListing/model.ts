export interface NewListing {
	title: string;
	description: string;
	price: number;
	stock: number;
	categories: string[];
}

export async function createListing(listing: NewListing) {
	return fetch('/seller/api/v0/listing', {
		method: 'POST',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(listing),
	});
}
