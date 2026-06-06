import {Body, Controller, Post, Request, Route} from 'tsoa';
import * as express from 'express';
import {
	CheckoutRequest,
	CheckoutResponse,
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
		@Request() req: express.Request,
	): Promise<void> {
		this.setStatus(204);
		return new PaymentService().webhook(req.body);
	}
}
