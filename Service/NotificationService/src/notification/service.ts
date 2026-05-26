import { SendEmailRequest, SendEmailResponse, SendTextRequest, SendTextResponse } from '.';

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY ?? '';
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN ?? '';
const MAILGUN_FROM = process.env.MAILGUN_FROM ?? `SlugMarket <noreply@${MAILGUN_DOMAIN}>`;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID ?? '';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN ?? '';
const TWILIO_FROM_NUMBER = process.env.TWILIO_FROM_NUMBER ?? '';

export class NotificationService {
	public async sendEmail(request: SendEmailRequest): Promise<SendEmailResponse> {
		const form = new URLSearchParams();
		form.append('from', MAILGUN_FROM);
		form.append('to', request.to);
		form.append('subject', request.subject);
		form.append('text', request.text);

		const res = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
			method: 'POST',
			headers: {
				'Authorization': `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64')}`,
			},
			body: form,
		});

		if (!res.ok) {
			return { success: false };
		}

		const data = await res.json();
		return { success: true, messageId: data.id };
	}

	public async sendText(request: SendTextRequest): Promise<SendTextResponse> {
		const form = new URLSearchParams();
		form.append('To', request.to);
		form.append('From', TWILIO_FROM_NUMBER);
		form.append('Body', request.body);

		const res = await fetch(
			`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
			{
				method: 'POST',
				headers: {
					'Authorization': `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')}`,
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: form,
			},
		);

		if (!res.ok) {
			return { success: false };
		}

		const data = await res.json();
		return { success: true, messageId: data.sid };
	}
}
