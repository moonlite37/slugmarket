import { Category } from '.';

const LISTING_MICROSERVICE = 'http://127.0.0.1:3011/api/v0';

export class CategoryService {
	public async getCategories(): Promise<Category[]> {
		const res = await fetch(`${LISTING_MICROSERVICE}/category`);
		return res.json();
	}
}
