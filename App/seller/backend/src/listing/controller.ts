import {
	Route,
	Controller,
	Post,
	Body,
	SuccessResponse,
} from 'tsoa';

import { ListingService } from './service';

interface NewListing {
	title: string;
	description: string;
	price: number;
	stock: number;
	categories: string[];
	images?: string[];
}

@Route('')
export class ListingController extends Controller {
	@Post('listing')
	@SuccessResponse('201', 'Created')
	public async createListing(
		@Body() listing: NewListing,
	): Promise<unknown> {
		this.setStatus(201);
		const res = await new ListingService().createListing(listing);
		return res;
	}
}