const ORDER_SERVICE = 'http://127.0.0.1:4000/graphql';

interface OrderItem {
	listingId: string;
	title: string;
	price: number;
	quantity: number;
}

interface Order {
	id: string;
	shopper: string;
	seller: string;
	items: OrderItem[];
	total: number;
	status: string;
	created: string;
}

export class OrderService {
	public async getOrders(sellerId: string): Promise<Order[]> {
		const res = await fetch(ORDER_SERVICE, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				query: `query OrdersBySeller($sellerId: String!) {
					ordersBySeller(sellerId: $sellerId) {
						id shopper seller items { listingId title price quantity } total status created
					}
				}`,
				variables: { sellerId },
			}),
		});
		if (!res.ok) {
			throw new Error('Failed to fetch orders');
		}
		const data = await res.json();
		return data.data.ordersBySeller;
	}

	public async updateOrderStatus(id: string, status: string): Promise<{ id: string; status: string }> {
		const res = await fetch(ORDER_SERVICE, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				query: `mutation UpdateOrderStatus($id: String!, $status: String!) {
					updateOrderStatus(id: $id, status: $status) {
						id status
					}
				}`,
				variables: { id, status },
			}),
		});
		if (!res.ok) {
			throw new Error('Failed to update order status');
		}
		const data = await res.json();
		return data.data.updateOrderStatus;
	}
}
