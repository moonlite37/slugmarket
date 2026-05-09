import {
	Route,
	Controller,
	Get,
	Post,
  	Body,
  	SuccessResponse,
} from 'tsoa';

import { Listing, NewListing } from '.';
import { ListingService } from './service';

// endpoint is currently unauthenticated
// it technically doesn't need to be, but will add authcheck when implemented in authservice
@Route('')
export class ListingController extends Controller {
    @Get('listing')
	public async getListing(
	): Promise<Listing[]> {
		const res = await new ListingService().getListing();
		return res;
	}

	@Post('listing')
	@SuccessResponse('201', 'Created')
    public async createListing(
		@Body() listing: NewListing,
    ): Promise<Listing> {
    	this.setStatus(201);
    	const res = await new ListingService().createListing(
    		'00000000-0000-0000-0000-000000000001',
    		listing,
    	);
    	return res;
    }
}