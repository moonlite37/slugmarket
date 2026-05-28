const CART_MICROSERVICE = 'http://127.0.0.1:3017/api/v0';

export interface CartItem {
	listing_id: string;
	name: string;
	price: number;
	quantity: number;
	seller: string;
}

export class CartService {
	public async getCart(userId: string): Promise<CartItem[]> {
		const res = await fetch(`${CART_MICROSERVICE}/cart?userId=${userId}`);
		return await res.json();
	}

	public async deleteItem(userId: string, listingId: string): Promise<void> {
		await fetch(`${CART_MICROSERVICE}/cart/item/${listingId}?userId=${userId}`, {
			method: 'DELETE',
		});
	}

	public async addItem(userId: string, item: CartItem): Promise<void> {
		await fetch(`${CART_MICROSERVICE}/cart/item`, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({userId, item}),
		});
	}
}
