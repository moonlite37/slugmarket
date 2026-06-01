export interface CheckoutOrder {
	orderId: string;
	name: string;
	quantity: number;
	unitAmount: number;
}

export interface CheckoutRequest {
	orders: CheckoutOrder[];
	email?: string;
}

export interface CheckoutResponse {
	url: string;
}

export interface WebhookSession {
	id: string;
	metadata: {
		orderIds: string;
		email?: string;
	};
}

export interface WebhookRequest {
	type: string;
	data: {
		object: WebhookSession;
	};
}
