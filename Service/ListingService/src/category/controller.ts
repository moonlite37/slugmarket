import {
	Route,
	Controller,
	Get,
	SuccessResponse,
	Post,
	Body,
	Delete,
	Response,
	Path,
} from 'tsoa';
import { Category } from '.';
import { CategoryService } from './service';

@Route('category')
export class CategoryController extends Controller {
    @Get('')
	public async getCategories(
	): Promise<Category[]> {
		const res = await new CategoryService().getCategory();
		return res;
	}

    @Post('')
    @SuccessResponse('201', 'Created')
    public async createCategory(
        @Body() body: {name: string},
    ): Promise<Category> {
    	this.setStatus(201);
    	const res = await new CategoryService().createCategory(body.name);
    	return res;
    }
    
    @Delete('/{id}')
    @SuccessResponse('204', 'Deleted')
    @Response('404', 'Not Found')
    public async deleteListing(
        @Path() id: string,
    ): Promise<void> {
    	const deleted = await new CategoryService().deleteCategory(id);
    	if (!deleted) {
    		this.setStatus(404);
    		return;
    	}
    	this.setStatus(204);
    }
    
}
