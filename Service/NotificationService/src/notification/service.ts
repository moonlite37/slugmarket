import { SendEmailRequest, SendEmailResponse, SendTextRequest, SendTextResponse } from '.';

export class NotificationService {
	public async sendEmail(request: SendEmailRequest): Promise<SendEmailResponse> {
		const apiKey = process.env.MAILGUN_API_KEY ?? '';
		const domain = process.env.MAILGUN_DOMAIN ?? '';
		const from = process.env.MAILGUN_FROM ?? `SlugMarket <noreply@${domain}>`;

		const form = new URLSearchParams();
		form.append('from', from);
		form.append('to', request.to);
		form.append('subject', request.subject);
		form.append('text', request.text);

		const res = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
			method: 'POST',
			headers: {
				'Authorization': `Basic ${Buffer.from(`api:${apiKey}`).toString('base64')}`,
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
		const sid = process.env.TWILIO_ACCOUNT_SID ?? '';
		const token = process.env.TWILIO_AUTH_TOKEN ?? '';
		const fromNumber = process.env.TWILIO_FROM_NUMBER ?? '';

		const form = new URLSearchParams();
		form.append('To', request.to);
		form.append('From', fromNumber);
		form.append('Body', request.body);

		const res = await fetch(
			`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
			{
				method: 'POST',
				headers: {
					'Authorization': `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`,
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
