'use server';

import { Listing } from '../../listing';
import { ListingService } from '../../listing/service';

export async function getListings(): Promise<Listing[]> {
	return new ListingService().getAll();
}

export async function deleteListing(id: string): Promise<void> {
	await new ListingService().deleteListing(id);
}
