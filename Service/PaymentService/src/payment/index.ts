export interface CheckoutRequest {
	orderId: string;
	name: string;
	quantity: number;
	unitAmount: number;
}

export interface CheckoutResponse {
	url: string;
}

export interface WebhookSession {
	id: string;
	metadata: {
		orderId: string;
	};
}

export interface WebhookRequest {
	type: string;
	data: {
		object: WebhookSession;
	};
}
