export interface OrderItem {
  listingId: string;
  title: string;
  price: number;
  quantity: number;
}
export interface Order {
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
