import dotenv from 'dotenv';
import path from 'path';
import Stripe from 'stripe';
import {
	CheckoutRequest,
	CheckoutResponse,
	OrderData,
	StockItem,
	WebhookRequest,
} from '.';

dotenv.config({path: path.resolve(process.cwd(), '../../.env')});
dotenv.config({path: path.resolve(process.cwd(), '.env')});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const ORDER_GRAPHQL_URL = process.env.ORDER_GRAPHQL_URL ?? 'http://localhost:4000/graphql';
const NOTIFICATION_URL = process.env.NOTIFICATION_URL ?? 'http://127.0.0.1:3019/api/v0';
const LISTING_URL = process.env.LISTING_URL ?? 'http://127.0.0.1:3011/api/v0';

const CREATE_ORDER_MUTATION = `mutation CreateOrder($input: CreateOrderInput!) {
	createOrder(input: $input) { id status }
}`;

export class PaymentService {
	public async checkout(request: CheckoutRequest): Promise<CheckoutResponse> {
		const session = await stripe.checkout.sessions.create({
			mode: 'payment',
			payment_method_types: ['card'],
			...(request.shopperEmail ? { customer_email: request.shopperEmail } : {}),
			line_items: request.lineItems.map((item) => ({
				price_data: {
					currency: 'usd',
					product_data: { name: item.name },
					unit_amount: item.unitAmount,
				},
				quantity: item.quantity,
			})),
			metadata: {
				shopperId: request.shopperId,
				shopperName: request.shopperName || '',
				shopperEmail: request.shopperEmail || '',
				orderData: JSON.stringify(request.orderData),
				stockItems: JSON.stringify(request.stockItems || []),
			},
			success_url: 'https://slugmarket.shop/shopper/payment/success',
			cancel_url: 'https://slugmarket.shop/shopper/payment/failed',
		});
		return { url: session.url ?? '' };
	}

	public async webhook(request: WebhookRequest): Promise<void> {
		if (request.type !== 'checkout.session.completed') return;

		const meta = request.data.object.metadata;
		const orderDataList: OrderData[] = JSON.parse(meta.orderData || '[]');

		const orderIds: string[] = [];
		for (const orderData of orderDataList) {
			const order = await this.createOrder(
				meta.shopperId, meta.shopperName, meta.shopperEmail, orderData,
			);
			if (order) orderIds.push(order.id);
		}

		await Promise.all(orderIds.map((id) => this.sendOrderConfirmation(id, meta.shopperEmail)));
		await this.decreaseStock(meta.stockItems);
	}

	private async createOrder(
		shopperId: string, shopperName?: string, shopperEmail?: string, orderData?: OrderData,
	): Promise<{ id: string } | null> {
		const res = await fetch(ORDER_GRAPHQL_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				query: CREATE_ORDER_MUTATION,
				variables: {
					input: {
						shopper: shopperId,
						seller: orderData?.seller,
						shopperName: shopperName || '',
						shopperEmail: shopperEmail || '',
						items: orderData?.items,
						total: orderData?.total,
					},
				},
			}),
		});
		const data = await res.json();
		return data.data?.createOrder ?? null;
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
