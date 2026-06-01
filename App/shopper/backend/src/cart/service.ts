import { ListingService } from '../listing/service';
import { OrderService } from '../order/service';

const CART_MICROSERVICE = 'http://127.0.0.1:3017/api/v0';
const PAYMENT_SERVICE = 'http://127.0.0.1:3016/api/v0';
const LISTING_MICROSERVICE = 'http://127.0.0.1:3011/api/v0';

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

	public async checkout(userId: string, email?: string): Promise<string> {
		const cartItems = await this.getCart(userId);

		const bySeller = new Map<string, CartItem[]>();
		for (const item of cartItems) {
			const group = bySeller.get(item.seller) ?? [];
			group.push(item);
			bySeller.set(item.seller, group);
		}

		const paymentOrders: { orderId: string; name: string; quantity: number; unitAmount: number }[] = [];
		for (const [seller, items] of bySeller) {
			const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
			const order = await new OrderService().createOrder(userId, {
				seller,
				items: items.map((i) => ({ listingId: i.listing_id, title: i.name, price: i.price, quantity: i.quantity })),
				total,
			});
			for (const item of items) {
				paymentOrders.push({
					orderId: order.id,
					name: item.name,
					quantity: item.quantity,
					unitAmount: Math.round(item.price * 100),
				});
			}
		}

		const res = await fetch(`${PAYMENT_SERVICE}/checkout`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ orders: paymentOrders, email }),
		});
		const { url } = await res.json();

		for (const item of cartItems) {
			const listing = await new ListingService().getListingById(item.listing_id);
			if (listing && listing.stock > 0) {
				await fetch(`${LISTING_MICROSERVICE}/listing/${item.listing_id}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ stock: Math.max(0, listing.stock - item.quantity) }),
				});
			}
		}

		await Promise.all(cartItems.map((item) => this.deleteItem(userId, item.listing_id)));

		return url;
	}
}
