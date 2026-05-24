import {Controller, Get, Post, Route, Body, Query, Response} from 'tsoa';
import {CartService} from './service';

interface CartItem {
	listing_id: string;
	name: string;
	price: number;
	quantity: number;
	imageUrl: string;
}

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

	@Post('item')
	@Response('201', 'Created')
	public async addItem(@Body() body: AddItemBody): Promise<void> {
		await new CartService().addItem(body.userId, body.item);
		this.setStatus(201);
	}
}
