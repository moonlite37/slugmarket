export interface SendEmailRequest {
	to: string;
	subject: string;
	text: string;
}

export interface SendEmailResponse {
	success: boolean;
	messageId?: string;
}

export interface SendTextRequest {
	to: string;
	body: string;
}

export interface SendTextResponse {
	success: boolean;
	messageId?: string;
}
