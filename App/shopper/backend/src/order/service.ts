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
  shopperName?: string;
  shopperEmail?: string;
  items: OrderItem[];
  total: number;
  status: string;
  created: string;
}

interface CreateOrderInput {
  seller: string;
  items: OrderItem[];
  total: number;
}

export class OrderService {
  public async createOrder(shopperId: string, shopperName?: string, shopperEmail?: string, input?: CreateOrderInput): Promise<Order> {
    const res = await fetch(ORDER_SERVICE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `mutation CreateOrder($input: CreateOrderInput!) {
          createOrder(input: $input) {
            id shopper seller shopperName shopperEmail items { listingId title price quantity } total status created
          }
        }`,
        variables: {
          input: {
            shopper: shopperId,
            seller: input?.seller,
            shopperName: shopperName || '',
            shopperEmail: shopperEmail || '',
            items: input?.items,
            total: input?.total,
          },
        },
      }),
    });
    if (!res.ok) {
      throw new Error('Failed to create order');
    }
    const data = await res.json();
    return data.data.createOrder;
  }

  public async getOrders(shopperId: string): Promise<Order[]> {
    const res = await fetch(ORDER_SERVICE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query OrdersByShopper($shopperId: String!) {
          ordersByShopper(shopperId: $shopperId) {
            id shopper seller shopperName shopperEmail items { listingId title price quantity } total status created
          }
        }`,
        variables: { shopperId },
      }),
    });
    if (!res.ok) {
      throw new Error('Failed to fetch orders');
    }
    const data = await res.json();
    return data.data.ordersByShopper;
  }
}
