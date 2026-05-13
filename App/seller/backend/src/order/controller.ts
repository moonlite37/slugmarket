import {
	Route,
	Controller,
	Get,
	Request,
	Security,
} from 'tsoa';
import * as express from 'express';
import { OrderService } from './service';

@Route('order')
export class OrderController extends Controller {
	@Get('')
	@Security('cookie')
	public async getOrders(
		@Request() req: express.Request,
	): Promise<unknown> {
		return new OrderService().getOrders(req.user?.id as string);
	}
}
