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

@Route('')
export class CorpController extends Controller {
	@Post('login')
	@Response('401', 'Unauthorized')
	public async login(@Body() body: LoginBody): Promise<void> {
		const authToken = await new CorpService().login(body.email, body.password);
		if (!authToken) {
			this.setStatus(401);
			return;
		}
		this.setHeader('Set-Cookie', `authToken=${authToken}; HttpOnly; Path=/; SameSite=Lax; Max-Age=3600`);
		this.setStatus(200);
	}

	/*
	@Get('protected')
	@Security('cookie')
	public async protected(): Promise<{ message: string }> {
		return { message: 'ok' };
	}
	*/

	@Post('generate')
	@Security('cookie')
	@SuccessResponse('201', 'Created')
	public async createAPIKey(@Request() request: ExpressRequest): Promise<api_key | undefined> {
		const authToken = request.cookies?.authToken;
		const apiKey = await new CorpService().createAPIKey(authToken);
		if (!apiKey) {
			this.setStatus(401);
			return undefined;
		}
		this.setHeader('Set-Cookie', `apiKey=${apiKey}; HttpOnly; Path=/; SameSite=Lax; Max-Age=86400`);
		this.setStatus(201);
		return apiKey;
	}

	@Get('listing')
	@Security('cookie')
	public async getListing(@Request() request: ExpressRequest): Promise<Listing[] | undefined> {
		const apiKey = request.cookies?.apiKey;
		const res = await new CorpService().getListing(apiKey);
		if (!res) {
			this.setStatus(401);
			return undefined;
		}
		return res;
	}

	@Post('listing')
	@Security('cookie')
	@SuccessResponse('201', 'Created')
	public async createListing(
		@Body() body: NewListing,
		@Request() request: ExpressRequest,
	): Promise<Listing | undefined> {
		const apiKey = request.cookies?.apiKey;
		const res = await new CorpService().createListing(apiKey, body);
		if (!res) {
			this.setStatus(401);
			return undefined;
		}
		this.setStatus(201);
		return res;
	}

	@Put('listing/{id}')
	@Security('cookie')
	@Response('404', 'Not Found')
	public async updateListing(
		@Path() id: string,
		@Body() body: UpdateListingBody,
		@Request() request: ExpressRequest,
	): Promise<Listing | undefined> {
		const apiKey = request.cookies?.apiKey;
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
	@Security('cookie')
	@Response('404', 'Not Found')
	public async deleteListing(
		@Path() id: string,
		@Request() request: ExpressRequest,
	): Promise<void> {
		const apiKey = request.cookies?.apiKey;
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
	@Security('cookie')
	public async getOrders(@Request() request: ExpressRequest): Promise<Order[] | undefined> {
		const apiKey = request.cookies?.apiKey;
		const res = await new CorpService().getOrders(apiKey);
		if (!res) {
			this.setStatus(401);
			return undefined;
		}
		return res;
	}

	@Put('order/{id}')
	@Security('cookie')
	public async updateOrderStatus(
		@Path() id: string,
		@Body() body: UpdateOrderBody,
		@Request() request: ExpressRequest,
	): Promise<Order | undefined> {
		const apiKey = request.cookies?.apiKey;
		const res = await new CorpService().updateOrderStatus(apiKey, id, body.status);
		if (!res) {
			this.setStatus(401);
			return undefined;
		}
		return res;
	}
}
