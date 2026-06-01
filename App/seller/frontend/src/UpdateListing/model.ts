export interface EditableListing {
	id: string;
	title: string;
	description: string;
	price: number;
	stock: number;
	categories: string[];
	images?: string[];
}

export async function getListing(id: string): Promise<EditableListing | null> {
	const res = await fetch(`/seller/api/v0/listing/${id}`, {
		credentials: 'include',
	});
	if (!res.ok) return null;
	return res.json();
}
