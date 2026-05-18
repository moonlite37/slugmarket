import {
	Route,
	Controller,
	Post,
	Security,
	Response,
	Request,
	Body,
	Get,
	Delete,
	Path,
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

	@Get('listing')
	public async getListing(
		@Request() request: ExpressRequest,
	): Promise<Listing[] | undefined> {
		const key = request.headers.authorization;
		const res = await new ApiService().getListing(key);
		this.setStatus(200);
		if(!res){
			this.setStatus(401);
			return undefined;
		}
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

	@Delete('listing/{id}')
	@Response('404', 'Not Found')
	public async deleteListing(
		@Path() id: string,
		@Request() request: ExpressRequest,
	): Promise<Listing[] | undefined> {
		const key = request.headers.authorization;
		this.setStatus(200);
		try {
			const res = await new ApiService().deleteListing(key, id);
			if(!res){
				this.setStatus(404);
				return undefined;
			}
			this.setStatus(204);
		} catch {
			this.setStatus(401);
			return undefined;
		}
	}
}
