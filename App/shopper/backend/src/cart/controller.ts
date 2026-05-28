import {Route, Controller, Get, Post, Delete, Body, Path, Request, Security} from 'tsoa';
import * as express from 'express';
import {CartService, CartItem} from './service';

interface AddItemBody {
	item: CartItem;
}

@Route('cart')
export class CartController extends Controller {
	@Get('')
	@Security('cookie')
	public async getCart(@Request() req: express.Request): Promise<CartItem[]> {
		return new CartService().getCart(req.user?.id as string);
	}

	@Delete('item/{listingId}')
	@Security('cookie')
	public async deleteItem(
		@Path() listingId: string,
		@Request() req: express.Request,
	): Promise<void> {
		await new CartService().deleteItem(req.user?.id as string, listingId);
	}

	@Post('item')
	@Security('cookie')
	public async addItem(
		@Body() body: AddItemBody,
		@Request() req: express.Request,
	): Promise<void> {
		await new CartService().addItem(req.user?.id as string, body.item);
		this.setStatus(201);
	}

	@Post('sync')
	@Security('cookie')
	public async syncCart(@Request() req: express.Request): Promise<CartItem[]> {
		return new CartService().syncCart(req.user?.id as string);
	}
}
