import type { EditableListing, EditableListingUpdate } from '.';
	
export async function getListing(id: string): Promise<EditableListing | null> {
	const res = await fetch(`/seller/api/v0/listing/${id}`, {
		credentials: 'include',
	});
	if (!res.ok) return null;
	return res.json();
}

export async function updateListing(id: string, listing: EditableListingUpdate) {
	return fetch(`/seller/api/v0/listing/${id}`, {
		method: 'PUT',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(listing),
	});
}
