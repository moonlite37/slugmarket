const ORDER_SERVICE = 'http://127.0.0.1:4000/graphql';
const LISTING_URL = 'http://127.0.0.1:3011/api/v0';
const NOTIFICATION_URL = 'http://127.0.0.1:3019/api/v0';

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
        shopperName?: string;
        shopperEmail?: string;
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
                                                id shopper seller shopperName shopperEmail items { listingId title price quantity } total status created
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

        public async updateOrderStatus(id: string, status: string, sellerId: string): Promise<{ id: string; status: string }> {
                if (status === 'fulfilled') {
                        await this.sendShipmentEmail(id, sellerId);
                }
                if (status === 'cancelled') {
                        await this.restoreStock(id, sellerId);
                }

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

        private async restoreStock(orderId: string, sellerId: string): Promise<void> {
                const orders = await this.getOrders(sellerId);
                const order = orders.find((o) => o.id === orderId);
                if (!order) return;
                for (const item of order.items) {
                        const listingRes = await fetch(`${LISTING_URL}/listing/${item.listingId}`);
                        if (!listingRes.ok) continue;
                        const listing = await listingRes.json();
                        await fetch(`${LISTING_URL}/listing/${item.listingId}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ stock: listing.stock + item.quantity }),
                        }).catch(() => { /* non-critical */ });
                }
        }

        private async sendShipmentEmail(orderId: string, sellerId: string): Promise<void> {
                const orders = await this.getOrders(sellerId);
                const order = orders.find((o) => o.id === orderId);
                if (!order || !order.shopperEmail) return;
                await fetch(`${NOTIFICATION_URL}/email`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                                to: order.shopperEmail,
                                subject: `Order ${orderId} Shipped`,
                                text: `Hi ${order.shopperName || 'there'}, your order ${orderId} has been fulfilled and is on its way!`,
                        }),
                }).catch(() => { /* non-critical */ });
        }
}
