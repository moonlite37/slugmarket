export interface NewListing {
	title: string;
	description: string;
	price: number;
	stock: number;
	categories: string[];
	images?: string[];
}

export interface Listing extends NewListing {
	id: string;
	created: string;
	author: string;
}

export type UpdateListing = Partial<NewListing>;
