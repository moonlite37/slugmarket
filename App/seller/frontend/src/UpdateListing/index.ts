export interface EditableListing {
	id: string;
	title: string;
	price: number;
	description: string;
	stock: number;
	categories: string[];
	images?: string[];
	images?: string[];
}

export interface EditableListingUpdate {
	title: string;
	description: string;
	price: number;
	stock: number;
	categories: string[];
	images?: string[];
}
