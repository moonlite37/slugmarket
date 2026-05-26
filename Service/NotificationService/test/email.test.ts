import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { request } from './setup';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const mockServer = setupServer(
	http.post('https://api.mailgun.net/v3/*/messages', () => {
		return HttpResponse.json({ id: '<mock-message-id>', message: 'Queued' });
	}),
);

beforeAll(() => mockServer.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => mockServer.resetHandlers());
afterAll(() => mockServer.close());

describe('POST /api/v0/email', () => {
	it('sends email successfully', async () => {
		const res = await request.post('/api/v0/email')
			.send({
				to: 'shopper@example.com',
				subject: 'Order Confirmation',
				text: 'Your order has been placed!',
			});
		expect(res.status).toBe(200);
		expect(res.body.success).toBe(true);
		expect(res.body.messageId).toBeDefined();
	});

	it('rejects missing fields', async () => {
		const res = await request.post('/api/v0/email')
			.send({ to: 'shopper@example.com' });
		expect(res.status).toBe(400);
	});

	it('rejects empty body', async () => {
		const res = await request.post('/api/v0/email')
			.send({});
		expect(res.status).toBe(400);
	});

	it('handles Mailgun failure', async () => {
		mockServer.use(
			http.post('https://api.mailgun.net/v3/*/messages', () => {
				return new HttpResponse(null, { status: 500 });
			}),
		);
		const res = await request.post('/api/v0/email')
			.send({
				to: 'shopper@example.com',
				subject: 'Order Confirmation',
				text: 'Your order has been placed!',
			});
		expect(res.status).toBe(500);
		expect(res.body.success).toBe(false);
	});
});
