import { Route, Controller, Get, Query } from 'tsoa';
import { ListingService } from './service';

@Route('listing')
export class ListingController extends Controller {
	@Get('')
	public async getListing(
		@Query() minPrice?: number,
		@Query() maxPrice?: number
	) {
		const listings = await new ListingService().getListing(
			minPrice,
			maxPrice
		);
		return listings;
	}
}
