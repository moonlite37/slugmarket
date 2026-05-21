import Stripe from 'stripe';
import {CheckoutRequest, CheckoutResponse} from '.';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

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
}
