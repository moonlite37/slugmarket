import 'server-only';
import { Category } from '.';

const LISTING_MICROSERVICE = 'http://localhost:3011/api/v0';

export class CategoryService {
	public async getAll(): Promise<Category[]> {
		const res = await fetch(`${LISTING_MICROSERVICE}/category`, {
			cache: 'no-store',
		});
		if (!res.ok) throw new Error('Failed to fetch categories');
		return res.json();
	}

	public async create(name: string): Promise<Category> {
		const res = await fetch(`${LISTING_MICROSERVICE}/category`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name }),
		});
		if (!res.ok) throw new Error('Failed to create category');
		return res.json();
	}

	public async delete(id: string): Promise<void> {
		const res = await fetch(`${LISTING_MICROSERVICE}/category/${id}`, {
			method: 'DELETE',
		});
		if (!res.ok) throw new Error('Failed to delete category');
	}
}
