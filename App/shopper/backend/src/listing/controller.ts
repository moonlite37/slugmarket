import { Route, Controller, Get } from 'tsoa';
import { ListingService } from './service';

@Route('listing')
export class ListingController extends Controller {
  @Get('')
  public async getListing(){
    const listings = await new ListingService().getListing();
    return listings;
  }
}
