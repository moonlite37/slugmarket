import {
	Route,
	Controller,
	Get,
	Post,
	Body,
	Query,
	SuccessResponse,
} from 'tsoa';
import { Listing, CreateListingBody } from '.';
import { ListingService } from './service';

@Route('')
export class ListingController extends Controller {
	@Get('listing')
	public async getListing(
		@Query() author?: string,
	): Promise<Listing[]> {
		const res = await new ListingService().getListing(author);
		return res;
	}

	@Post('listing')
	@SuccessResponse('201', 'Created')
	public async createListing(
		@Body() body: CreateListingBody,
	): Promise<Listing> {
		this.setStatus(201);
		const { authorId, ...listing } = body;
		const res = await new ListingService().createListing(authorId, listing);
		return res;
	}
}
