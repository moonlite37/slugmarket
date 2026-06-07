export interface LineItem {
	name: string;
	quantity: number;
	unitAmount: number;
}

export interface OrderItemData {
	listingId: string;
	title: string;
	price: number;
	quantity: number;
}

export interface OrderData {
	seller: string;
	items: OrderItemData[];
	total: number;
}

export interface StockItem {
	listingId: string;
	quantity: number;
}

export interface CheckoutRequest {
	lineItems: LineItem[];
	shopperId: string;
	shopperName?: string;
	shopperEmail?: string;
	orderData: OrderData[];
	stockItems?: StockItem[];
}

export interface CheckoutResponse {
	url: string;
}

export interface WebhookSession {
	id: string;
	metadata: {
		shopperId: string;
		shopperName?: string;
		shopperEmail?: string;
		[key: string]: string | undefined;
	};
}

export interface WebhookRequest {
	type: string;
	data: {
		object: WebhookSession;
	};
}
