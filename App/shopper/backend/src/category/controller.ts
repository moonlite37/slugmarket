import { Route, Controller, Get } from 'tsoa';
import { CategoryService } from './service';

@Route('category')
export class CategoryController extends Controller {
    @Get('')
    public async getListing() {
        const categories = await new CategoryService().getCategory();
        return categories;
    }
}
