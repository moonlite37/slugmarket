import {
	Route,
	Controller,
	Get,
	Post,
	Body,
	Request,
	Security,
	SuccessResponse,
} from 'tsoa';
import * as express from 'express';
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
}
