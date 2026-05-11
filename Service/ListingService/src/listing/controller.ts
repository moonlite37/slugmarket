import {
	Route,
	Controller,
	Get,
	Post,
	Delete,
	Body,
	Path,
	Query,
	Response,
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

	@Delete('listing/{id}')
	@SuccessResponse('204', 'Deleted')
	@Response('404', 'Not Found')
	public async deleteListing(
		@Path() id: string,
	): Promise<void> {
		const deleted = await new ListingService().deleteListing(id);
		if (!deleted) {
			this.setStatus(404);
			return;
		}
		this.setStatus(204);
	}
}
