import Stripe from 'stripe';
import {
	CheckoutRequest,
	CheckoutResponse,
	WebhookRequest,
} from '.';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const ORDER_GRAPHQL_URL = process.env.ORDER_GRAPHQL_URL ?? 'http://localhost:4000/graphql';
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
			success_url: 'http://localhost:3000/success',
			cancel_url: 'http://localhost:3000/cancel',
		});

		return {url: session.url ?? ''};
	}

	public async webhook(request: WebhookRequest): Promise<void> {
		const status = request.type === 'checkout.session.completed' ? 'paid' : 'failed';
		await this.updateOrderStatus(request.data.object.metadata.orderId, status);
	}

	private async updateOrderStatus(orderId: string, status: string): Promise<void> {
		await fetch(ORDER_GRAPHQL_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				query: UPDATE_ORDER_STATUS_MUTATION,
				variables: {
					id: orderId,
					status,
				},
			}),
		});
	}
}
