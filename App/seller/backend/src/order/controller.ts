import {
	Route,
	Controller,
	Get,
	Put,
	Path,
	Body,
	Request,
	Security,
} from 'tsoa';
import * as express from 'express';
import { OrderService } from './service';

interface UpdateOrderBody {
	status: string;
}

@Route('order')
export class OrderController extends Controller {
	@Get('')
	@Security('cookie')
	public async getOrders(
		@Request() req: express.Request,
	): Promise<unknown> {
		return new OrderService().getOrders(req.user?.id as string);
	}

	@Put('{id}')
	@Security('cookie')
	public async updateOrderStatus(
		@Path() id: string,
		@Body() body: UpdateOrderBody,
	): Promise<unknown> {
		return new OrderService().updateOrderStatus(id, body.status);
	}
}
