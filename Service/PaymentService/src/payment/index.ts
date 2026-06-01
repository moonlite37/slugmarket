export interface CheckoutOrder {
	orderId: string;
	name: string;
	quantity: number;
	unitAmount: number;
}

export interface StockItem {
	listingId: string;
	quantity: number;
}

export interface CheckoutRequest {
	orders: CheckoutOrder[];
	email?: string;
	stockItems?: StockItem[];
}

export interface CheckoutResponse {
	url: string;
}

export interface WebhookSession {
	id: string;
	metadata: {
		orderIds: string;
		email?: string;
		stockItems?: string;
	};
}

export interface WebhookRequest {
	type: string;
	data: {
		object: WebhookSession;
	};
}
