import { Route, Controller, Get } from 'tsoa';
import { Category } from '.';
import { CategoryService } from './service';

@Route('category')
export class CategoryController extends Controller {
	@Get('')
	public async getCategories(): Promise<Category[]> {
		return new CategoryService().getCategories();
	}
}
