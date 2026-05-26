import Stripe from 'stripe';
import {
	CheckoutRequest,
	CheckoutResponse,
	WebhookRequest,
} from '.';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const ORDER_GRAPHQL_URL = process.env.ORDER_GRAPHQL_URL ?? 'http://localhost:4000/graphql';
const NOTIFICATION_URL = process.env.NOTIFICATION_URL ?? 'http://127.0.0.1:3019/api/v0';
const UPDATE_ORDER_STATUS_MUTATION = 'mutation UpdateOrderStatus($id: String!, $status: String!) { updateOrderStatus(id: $id, status: $status) { id status } }';

export class PaymentService {
	public async checkout(request: CheckoutRequest): Promise<CheckoutResponse> {
		const session = await stripe.checkout.sessions.create({
			mode: 'payment',
			line_items: [
				{
					price_data: {
						currency: 'usd',
						product_data: {
							name: request.name,
						},
						unit_amount: request.unitAmount,
					},
					quantity: request.quantity,
				},
			],
			metadata: {
				orderId: request.orderId,
			},
			success_url: `https://slugmarket.shop/shopper/order/${request.orderId}`,
			cancel_url: 'https://slugmarket.shop/shopper/',
		});
		return {url: session.url ?? ''};
	}

	public async webhook(request: WebhookRequest): Promise<void> {
		const status = request.type === 'checkout.session.completed' ? 'paid' : 'failed';
		await this.updateOrderStatus(request.data.object.metadata.orderId, status);
		if (status === 'paid') {
			await this.sendOrderConfirmation(request.data.object.metadata.orderId);
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

	private async sendOrderConfirmation(orderId: string): Promise<void> {
		await fetch(`${NOTIFICATION_URL}/email`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				to: 'order-notifications@slugmarket.shop',
				subject: `Order ${orderId} Confirmed`,
				text: `Your order ${orderId} has been paid and is being processed.`,
			}),
		}).catch(() => { /* notification failure should not break payment flow */ });
	}
}
