'use server';
import { Category } from '../../category';
import { CategoryService } from '../../category/service';

export async function getCategories(): Promise<Category[]> {
	return new CategoryService().getAll();
}

export async function createCategory(name: string): Promise<Category> {
	return new CategoryService().create(name);
}

export async function deleteCategory(id: string): Promise<void> {
	await new CategoryService().delete(id);
}
