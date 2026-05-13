import {
  Route,
  Controller,
  Get,
  Post,
  Body,
  Request,
  Security,
  SuccessResponse,
} from 'tsoa';
import * as express from 'express';
import { OrderService } from './service';

interface OrderItemInput {
  listingId: string;
  title: string;
  price: number;
  quantity: number;
}

interface CreateOrderBody {
  seller: string;
  items: OrderItemInput[];
  total: number;
}

@Route('order')
export class OrderController extends Controller {
  @Post('')
  @Security('cookie')
  @SuccessResponse('201', 'Created')
  public async createOrder(
    @Body() body: CreateOrderBody,
    @Request() req: express.Request,
  ): Promise<unknown> {
    this.setStatus(201);
    return new OrderService().createOrder(req.user?.id as string, body);
  }

  @Get('')
  @Security('cookie')
  public async getOrders(
    @Request() req: express.Request,
  ): Promise<unknown> {
    return new OrderService().getOrders(req.user?.id as string);
  }
}
