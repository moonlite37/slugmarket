import { ListingService } from '../listing/service';

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

	public async syncCart(userId: string): Promise<CartItem[]> {
		const cartItems = await this.getCart(userId);
		const listings = await Promise.all(
			cartItems.map((item) => new ListingService().getListingById(item.listing_id)),
		);

		const synced: CartItem[] = [];

		for (let i = 0; i < cartItems.length; i++) {
			const item = cartItems[i];
			const listing = listings[i];

			if (!listing || listing.stock === 0) {
				await this.deleteItem(userId, item.listing_id);
				continue;
			}

			const newPrice = listing.discountPrice ?? listing.price;
			const newQuantity = Math.min(item.quantity, listing.stock);

			if (newPrice !== item.price || newQuantity !== item.quantity) {
				await this.deleteItem(userId, item.listing_id);
				await this.addItem(userId, { ...item, price: newPrice, quantity: newQuantity });
			}

			synced.push({ ...item, price: newPrice, quantity: newQuantity });
		}

		return synced;
	}
}
