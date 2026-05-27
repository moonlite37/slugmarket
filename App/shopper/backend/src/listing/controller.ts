import { Route, Controller, Get, Query } from 'tsoa';
import { ListingService } from './service';
@Route('listing')
export class ListingController extends Controller {
	@Get('')
	public async getListing(
		@Query() minPrice?: number,
		@Query() maxPrice?: number,
		@Query() sort?: string,
		@Query() search?: string,
	) {
		const listings = await new ListingService().getListing(
			minPrice,
			maxPrice,
			sort,
			search,
		);
		return listings;
	}
}
