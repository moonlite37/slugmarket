import {Controller, Post, Route, Body, Response} from 'tsoa';
import {CartService} from './service';

interface CartItem {
	listing_id: string;
	name: string;
	price: number;
	quantity: number;
	imageUrl: string;
}

interface AddItemBody {
	sessionId: string;
	userId?: string;
	item: CartItem;
}

@Route('cart')
export class CartController extends Controller {

	@Post('item')
	@Response('201', 'Created')
	public async addItem(@Body() body: AddItemBody): Promise<void> {
		await new CartService().addItem(body.sessionId, body.userId, body.item);
		this.setStatus(201);
	}
}
