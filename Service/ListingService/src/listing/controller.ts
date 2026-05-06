import {
	Route,
	Controller,
	Get,
} from 'tsoa';

import { Listing } from '.';
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
}