export type api_key = string

export interface SessionUser {
	id: string
}

declare module 'express-serve-static-core' {
	interface Request {
		user: SessionUser;
	}
}
export {};

export interface Listing {
	id: string;
	author: string;
	title: string;
	description: string;
	created: string;
	price: number;
	stock: number;
	categories: string[];
	images?: string[];
}

export interface NewListing {
	title: string;
	description: string;
	price: number;
	stock: number;
	categories: string[];
	images?: string[];
}

export interface UpdateListingBody {
	title?: string;
	description?: string;
	price?: number;
	stock?: number;
	categories?: string[];
	images?: string[];
}

export interface Order {
	id: string;
	items: string;
	total: number;
	status: string;
}

export interface UpdateOrderBody {
	status: string;
}
