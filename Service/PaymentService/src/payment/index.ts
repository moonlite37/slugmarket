export interface CheckoutRequest {
	name: string;
	quantity: number;
	unitAmount: number;
}

export interface CheckoutResponse {
	url: string;
}
