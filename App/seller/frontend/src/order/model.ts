export interface OrderItem {
        listingId: string;
        title: string;
        price: number;
        quantity: number;
}
export interface Order {
        id: string;
        shopperName?: string;
        shopperEmail?: string;
        items: OrderItem[];
        total: number;
        status: string;
        created: string;
}
export async function getOrders(): Promise<Order[]> {
        const res = await fetch('/seller/api/v0/order', {
                credentials: 'include',
        });
        if (!res.ok) return [];
        return res.json();
}
export async function updateOrderStatus(id: string, status: string): Promise<Pick<Order, 'status'> | null> {
        const res = await fetch(`/seller/api/v0/order/${id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
        });
        if (!res.ok) return null;
        return res.json();
}
