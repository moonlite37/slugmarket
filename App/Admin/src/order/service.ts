import 'server-only';
import { Order } from '.';

const ORDER_SERVICE = 'http://localhost:4000/graphql';

export class OrderService {
        public async getAll(): Promise<Order[]> {
                const res = await fetch(ORDER_SERVICE, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        cache: 'no-store',
                        body: JSON.stringify({
                                query: '{ allOrders { id shopper seller items { listingId title price quantity } total status created } }',
                        }),
                });
                if (!res.ok) {
                        throw new Error('Failed to fetch orders');
                }
                const data = await res.json();
                return data.data.allOrders;
        }

        public async updateStatus(id: string, status: string): Promise<void> {
                const res = await fetch(ORDER_SERVICE, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                                query: 'mutation UpdateStatus($id: String!, $status: String!) { updateOrderStatus(id: $id, status: $status) { id status } }',
                                variables: { id, status },
                        }),
                });
                if (!res.ok) {
                        throw new Error('Failed to update order status');
                }
        }
}
