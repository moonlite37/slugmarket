import {Route, Controller, Get, Post, Body, Request, Security} from 'tsoa';
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

	@Post('item')
	@Security('cookie')
	public async addItem(
		@Body() body: AddItemBody,
		@Request() req: express.Request,
	): Promise<void> {
		await new CartService().addItem(req.user?.id as string, body.item);
		this.setStatus(201);
	}
}
