export interface CheckoutRequest {
	orderId: string;
	name: string;
	quantity: number;
	unitAmount: number;
}

export interface CheckoutResponse {
	url: string;
}
