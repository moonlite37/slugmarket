import {
	Route,
	Controller,
	Post,
	Security,
	Response,
	Request,
	Body,
} from 'tsoa';
import { Request as ExpressRequest } from 'express';
import { api_key, Listing, NewListing } from '.';
import { ApiService } from './service';

@Route('')
@Security('jwt', ['corporate'])
export class CorporateController extends Controller {
	@Post('generate')
	@Response('201', 'Created')
	public async createAPIKey(@Request() request: ExpressRequest,
	): Promise<api_key> {
		const currentId = request.user.id;
		const res = await new ApiService().createAPIKey(currentId);
		this.setStatus(201);
		return res;
	}

	@Post('listing')
	@Response('201', 'Created')
	public async createListing(
		@Body() body: NewListing,
		@Request() request: ExpressRequest,
	): Promise<Listing[] | undefined> {
		const key = request.headers.authorization;
		const res = await new ApiService().createListing(key, body);
		this.setStatus(201);
		if(!res){
			this.setStatus(401);
			return undefined;
		}
		return res;
	}
}
