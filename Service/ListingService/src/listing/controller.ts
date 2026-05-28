import {
	Route,
	Controller,
	Get,
	Post,
	Put,
	Delete,
	Body,
	Path,
	Query,
	Response,
	SuccessResponse,
} from 'tsoa';
import { Listing, CreateListingBody, UpdateListingBody } from '.';
import { ListingService } from './service';

@Route('')
export class ListingController extends Controller {
	@Get('listing/{id}')
	@Response('404', 'Not Found')
	public async getListingById(@Path() id: string): Promise<Listing | undefined> {
		const listing = await new ListingService().getListingById(id);
		if (!listing) {
			this.setStatus(404);
			return undefined;
		}
		return listing;
	}

	@Get('listing')
	public async getListing(
		@Query() author?: string,
		@Query() minPrice?: number,
		@Query() maxPrice?: number,
		@Query() sort?: string,
		@Query() search?: string,
	): Promise<Listing[]> {
		const res = await new ListingService().getListing(author, minPrice, maxPrice, sort, search);
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

	@Put('listing/{id}')
	@Response('404', 'Not Found')
	public async updateListing(
		@Path() id: string,
		@Body() body: UpdateListingBody,
	): Promise<Listing | undefined> {
		const res = await new ListingService().updateListing(id, body);
		if (!res) {
			this.setStatus(404);
			return undefined;
		}
		return res;
	}
}
