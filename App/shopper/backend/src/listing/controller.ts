import { Route, Controller, Get, Query, Path } from 'tsoa';
import { ListingService } from './service';
@Route('listing')
export class ListingController extends Controller {
	@Get('{id}')
	public async getListingById(@Path() id: string) {
		return new ListingService().getListingById(id);
	}

	@Get('')
	public async getListing(
		@Query() minPrice?: number,
		@Query() maxPrice?: number,
		@Query() sort?: string,
		@Query() search?: string,
		@Query() category?: string,
	) {
		const listings = await new ListingService().getListing(
			minPrice,
			maxPrice,
			sort,
			search,
			category,
		);
		return listings;
	}
}
