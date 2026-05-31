import {
	Route,
	Controller,
	Get,
	Put,
	Post,
	Body,
	Path,
	Request,
	Security,
	SuccessResponse,
} from 'tsoa';
import * as express from 'express';
import { NewListing, UpdateListing } from '.';
import { ListingService } from './service';

@Route('')
export class ListingController extends Controller {
	@Get('listing')
	@Security('cookie')
	public async getListings(
		@Request() req: express.Request,
	): Promise<unknown> {
		const res = await new ListingService().getListings(req.user?.id as string);
		return res;
	}

	@Post('listing')
	@Security('cookie')
	@SuccessResponse('201', 'Created')
	public async createListing(
		@Body() listing: NewListing,
		@Request() req: express.Request,
	): Promise<unknown> {
		this.setStatus(201);
		const res = await new ListingService().createListing(
			req.user?.id as string,
			listing,
		);
		return res;
	}

	@Put('listing/{id}')
	@Security('cookie')
	public async updateListing(
		@Path() id: string,
		@Body() listing: UpdateListing,
	): Promise<unknown> {
		const res = await new ListingService().updateListing(id, listing);
		return res;
	}
}
