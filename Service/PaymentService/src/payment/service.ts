import dotenv from 'dotenv';
import path from 'path';
import Stripe from 'stripe';
import {
	CheckoutRequest,
	CheckoutResponse,
	StockItem,
	WebhookRequest,
} from '.';

dotenv.config({path: path.resolve(process.cwd(), '../../.env')});
dotenv.config({path: path.resolve(process.cwd(), '.env')});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const ORDER_GRAPHQL_URL = process.env.ORDER_GRAPHQL_URL ?? 'http://localhost:4000/graphql';
const NOTIFICATION_URL = process.env.NOTIFICATION_URL ?? 'http://127.0.0.1:3019/api/v0';
const LISTING_URL = process.env.LISTING_URL ?? 'http://127.0.0.1:3011/api/v0';
const UPDATE_ORDER_STATUS_MUTATION = 'mutation UpdateOrderStatus($id: String!, $status: String!) { updateOrderStatus(id: $id, status: $status) { id status } }';

export class PaymentService {
	public async checkout(request: CheckoutRequest): Promise<CheckoutResponse> {
		const orderIds = request.orders.map((o) => o.orderId).join(',');
		const session = await stripe.checkout.sessions.create({
			mode: 'payment',
			...(request.email ? { customer_email: request.email } : {}),
			line_items: request.orders.map((o) => ({
				price_data: {
					currency: 'usd',
					product_data: { name: o.name },
					unit_amount: o.unitAmount,
				},
				quantity: o.quantity,
			})),
			metadata: {
				orderIds,
				email: request.email ?? '',
				stockItems: JSON.stringify(request.stockItems || []),
			},
			success_url: 'https://slugmarket.shop/shopper/payment/success',
			cancel_url: 'https://slugmarket.shop/shopper/payment/failed',
		});
		return {url: session.url ?? ''};
	}

	public async webhook(request: WebhookRequest): Promise<void> {
		const status = request.type === 'checkout.session.completed' ? 'paid' : 'failed';
		const orderIds = request.data.object.metadata.orderIds.split(',');
		await Promise.all(orderIds.map((id) => this.updateOrderStatus(id, status)));
		if (status === 'paid') {
			const email = request.data.object.metadata.email;
			await Promise.all(orderIds.map((id) => this.sendOrderConfirmation(id, email)));
			await this.decreaseStock(request.data.object.metadata.stockItems);
		}
	}

	private async updateOrderStatus(orderId: string, status: string): Promise<void> {
		await fetch(ORDER_GRAPHQL_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				query: UPDATE_ORDER_STATUS_MUTATION,
				variables: { id: orderId, status },
			}),
		});
	}

	private async sendOrderConfirmation(orderId: string, email?: string): Promise<void> {
		await fetch(`${NOTIFICATION_URL}/email`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				to: email || 'order-notifications@slugmarket.shop',
				subject: `Order ${orderId} Confirmed`,
				text: `Your order ${orderId} has been paid and is being processed.`,
			}),
		}).catch(() => { /* notification failure should not break payment flow */ });
	}

	private async decreaseStock(stockItemsJson?: string): Promise<void> {
		const items: StockItem[] = JSON.parse(stockItemsJson || '[]');
		for (const item of items) {
			const res = await fetch(`${LISTING_URL}/listing/${item.listingId}`);
			if (!res.ok) continue;
			const listing = await res.json();
			await fetch(`${LISTING_URL}/listing/${item.listingId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ stock: Math.max(0, listing.stock - item.quantity) }),
			}).catch(() => { /* stock update non-critical */ });
		}
	}
}
