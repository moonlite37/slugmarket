import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { request } from './setup';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const mockServer = setupServer(
	http.post('https://api.twilio.com/2010-04-01/Accounts/*/Messages.json', () => {
		return HttpResponse.json({ sid: 'SM_mock_sid', status: 'queued' });
	}),
);

beforeAll(() => mockServer.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => mockServer.resetHandlers());
afterAll(() => mockServer.close());

describe('POST /api/v0/text', () => {
	it('sends text successfully', async () => {
		const res = await request.post('/api/v0/text')
			.send({
				to: '+15551234567',
				body: 'Your SlugMarket order has been placed!',
			});
		expect(res.status).toBe(200);
		expect(res.body.success).toBe(true);
		expect(res.body.messageId).toBeDefined();
	});

	it('rejects missing fields', async () => {
		const res = await request.post('/api/v0/text')
			.send({ to: '+15551234567' });
		expect(res.status).toBe(400);
	});

	it('rejects empty body', async () => {
		const res = await request.post('/api/v0/text')
			.send({});
		expect(res.status).toBe(400);
	});

	it('handles Twilio failure', async () => {
		mockServer.use(
			http.post('https://api.twilio.com/2010-04-01/Accounts/*/Messages.json', () => {
				return new HttpResponse(null, { status: 500 });
			}),
		);
		const res = await request.post('/api/v0/text')
			.send({
				to: '+15551234567',
				body: 'Your order has been placed!',
			});
		expect(res.status).toBe(500);
		expect(res.body.success).toBe(false);
	});
});
