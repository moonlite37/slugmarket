import {Controller, Get, Post, Delete, Route, Body, Query, Path, Response} from 'tsoa';
import {CartService} from './service';
import {CartItem} from '.';

interface AddItemBody {
	userId: string;
	item: CartItem;
}

@Route('cart')
export class CartController extends Controller {
	@Get()
	public async getCart(@Query() userId: string): Promise<CartItem[]> {
		const cart = await new CartService().getCart(userId);
		return cart?.items ?? [];
	}

	@Delete('item/{listingId}')
	@Response('204', 'No Content')
	public async deleteItem(
		@Query() userId: string,
		@Path() listingId: string,
	): Promise<void> {
		await new CartService().deleteItem(userId, listingId);
		this.setStatus(204);
	}

	@Post('item')
	@Response('201', 'Created')
	public async addItem(@Body() body: AddItemBody): Promise<void> {
		await new CartService().addItem(body.userId, body.item);
		this.setStatus(201);
	}
}
