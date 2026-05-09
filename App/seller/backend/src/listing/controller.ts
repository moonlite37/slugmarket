import {
	Route,
	Controller,
	Post,
	Body,
	Request,
	Response,
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
	@Post('listing')
	@SuccessResponse('201', 'Created')
	@Response('401', 'Unauthorized')
	public async createListing(
		@Body() listing: NewListing,
		@Request() req: express.Request,
	): Promise<unknown> {
		try {
			const token = req.headers.authorization?.split(' ')[1];
			const res = await new ListingService().createListing(token, listing);
			this.setStatus(201);
			return res;
		} catch {
			this.setStatus(401);
			return undefined;
		}
	}
}