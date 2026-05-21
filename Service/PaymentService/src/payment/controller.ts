import {Body, Controller, Post, Route} from 'tsoa';
import {
	CheckoutRequest,
	CheckoutResponse,
	WebhookRequest,
} from '.';
import {PaymentService} from './service';

@Route('')
export class PaymentController extends Controller {
	@Post('checkout')
	public async checkout(
		@Body() body: CheckoutRequest,
	): Promise<CheckoutResponse> {
		return new PaymentService().checkout(body);
	}

	@Post('webhook')
	public async webhook(
		@Body() body: WebhookRequest,
	): Promise<void> {
		return new PaymentService().webhook(body);
	}
}
