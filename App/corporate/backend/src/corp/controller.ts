import {
	Route,
	Controller,
	Post,
	Get,
	Put,
	Delete,
	Body,
	Path,
	Request,
	Security,
	Response,
	SuccessResponse,
} from 'tsoa';
import { Request as ExpressRequest } from 'express';
import { api_key, Listing, NewListing, UpdateListingBody, Order, UpdateOrderBody } from '.';
import { CorpService } from './service';

interface LoginBody {
	email: string;
	password: string;
}

interface LoginResponse {
	token: string;
}

@Route('')
export class CorpController extends Controller {
	@Post('login')
	@Response('401', 'Unauthorized')
	public async login(@Body() body: LoginBody): Promise<LoginResponse | undefined> {
		const authToken = await new CorpService().login(body.email, body.password);
		if (!authToken) {
			this.setStatus(401);
			return;
		}
		this.setStatus(200);
		return { token: authToken };
	}

	@Post('generate')
	@Security('bearer')
	@SuccessResponse('201', 'Created')
	public async createAPIKey(@Request() request: ExpressRequest): Promise<api_key | undefined> {
		const authToken = (request.headers.authorization as string).slice(7);
		const apiKey = await new CorpService().createAPIKey(authToken);
		if (!apiKey) {
			this.setStatus(401);
			return undefined;
		}
		this.setStatus(201);
		return apiKey;
	}

	@Get('listing')
	public async getListing(@Request() request: ExpressRequest): Promise<Listing[] | undefined> {
		const apiKey = request.headers['x-api-key'] as string | undefined;
		const res = await new CorpService().getListing(apiKey);
		if (!res) {
			this.setStatus(401);
			return undefined;
		}
		return res;
	}

	@Post('listing')
	@SuccessResponse('201', 'Created')
	public async createListing(
		@Body() body: NewListing,
		@Request() request: ExpressRequest,
	): Promise<Listing | undefined> {
		const apiKey = request.headers['x-api-key'] as string | undefined;
		const res = await new CorpService().createListing(apiKey, body);
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
		const apiKey = request.headers['x-api-key'] as string | undefined;
		const res = await new CorpService().updateListing(apiKey, id, body);
		if (res === null) {
			this.setStatus(401);
			return undefined;
		}
		if (!res) {
			this.setStatus(404);
			return undefined;
		}
		return res;
	}

	@Delete('listing/{id}')
	@Response('404', 'Not Found')
	public async deleteListing(
		@Path() id: string,
		@Request() request: ExpressRequest,
	): Promise<void> {
		const apiKey = request.headers['x-api-key'] as string | undefined;
		try {
			const ok = await new CorpService().deleteListing(apiKey, id);
			if (!ok) {
				this.setStatus(404);
				return;
			}
			this.setStatus(204);
		} catch {
			this.setStatus(401);
		}
	}

	@Get('order')
	public async getOrders(@Request() request: ExpressRequest): Promise<Order[] | undefined> {
		const apiKey = request.headers['x-api-key'] as string | undefined;
		const res = await new CorpService().getOrders(apiKey);
		if (!res) {
			this.setStatus(401);
			return undefined;
		}
		return res;
	}

	@Put('order/{id}')
	public async updateOrderStatus(
		@Path() id: string,
		@Body() body: UpdateOrderBody,
		@Request() request: ExpressRequest,
	): Promise<Order | undefined> {
		const apiKey = request.headers['x-api-key'] as string | undefined;
		const res = await new CorpService().updateOrderStatus(apiKey, id, body.status);
		if (!res) {
			this.setStatus(401);
			return undefined;
		}
		return res;
	}
}
