import {
	Route,
	Controller,
	Post,
	Security,
	Response,
	Request,
	Body,
	Get,
	Put,
	Delete,
	Path,
} from 'tsoa';
import { Request as ExpressRequest } from 'express';
import { api_key, Listing, NewListing, UpdateListingBody, Order, UpdateOrderBody } from '.';
import { ApiService } from './service';

@Route('')
export class CorporateController extends Controller {
	@Post('generate')
	@Security('jwt', ['corporate'])
	@Response('201', 'Created')
	public async createAPIKey(@Request() request: ExpressRequest): Promise<api_key> {
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
		if (!res) {
			this.setStatus(401);
			return undefined;
		}
		this.setStatus(200);
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
		if (!res) {
			this.setStatus(401);
			return undefined;
		}
		this.setStatus(201);
		return res;
	}

	@Put('listing/{id}')
	@Response('404', 'Not Found')
	public async updateListing(
		@Path() id: string,
		@Body() body: UpdateListingBody,
		@Request() request: ExpressRequest,
	): Promise<Listing | undefined> {
		const key = request.headers.authorization;
		const res = await new ApiService().updateListing(key, id, body);
		if (res === null) {
			this.setStatus(401);
			return undefined;
		}
		if (!res) {
			this.setStatus(404);
			return undefined;
		}
		this.setStatus(200);
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
			if (!res) {
				this.setStatus(404);
				return undefined;
			}
			this.setStatus(204);
		} catch {
			this.setStatus(401);
			return undefined;
		}
	}

	@Get('order')
	public async getOrders(
		@Request() request: ExpressRequest,
	): Promise<Order[] | undefined> {
		const key = request.headers.authorization;
		const res = await new ApiService().getOrders(key);
		if (!res) {
			this.setStatus(401);
			return undefined;
		}
		this.setStatus(200);
		return res;
	}

	@Put('order/{id}')
	public async updateOrderStatus(
		@Path() id: string,
		@Body() body: UpdateOrderBody,
		@Request() request: ExpressRequest,
	): Promise<Order | undefined> {
		const key = request.headers.authorization;
		const res = await new ApiService().updateOrderStatus(key, id, body.status);
		if (!res) {
			this.setStatus(401);
			return undefined;
		}
		this.setStatus(200);
		return res;
	}
}
