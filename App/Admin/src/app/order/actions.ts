'use server';

import { Order } from '../../order';
import { OrderService } from '../../order/service';

export async function getOrders(): Promise<Order[]> {
	return new OrderService().getAll();
}

export async function updateOrderStatus(id: string, status: string): Promise<void> {
	await new OrderService().updateStatus(id, status);
}
