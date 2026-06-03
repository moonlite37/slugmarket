import { describe, it, expect, vi, beforeEach } from 'vitest';
import { request } from './setup';

const {createCheckoutSession} = vi.hoisted(() => ({
	createCheckoutSession: vi.fn(),
}));

const {mockFetch} = vi.hoisted(() => ({
	mockFetch: vi.fn(),
}));

vi.mock('stripe', () => {
	return {
		default: vi.fn().mockImplementation(function () {
			return {
				checkout: {
					sessions: {
						create: createCheckoutSession,
					},
				},
			};
		}),
	};
});

describe('Payment checkout', () => {
	const orderId = 'order_123';

	beforeEach(() => {
		createCheckoutSession.mockClear();
		createCheckoutSession.mockResolvedValue({
			id: 'cs_test_123',
			url: 'https://checkout.stripe.com/c/pay/cs_test_123',
		});
	});

	const checkout = () => {
		return request
			.post('/api/v0/checkout')
			.send({
				orders: [{ orderId, name: 'Pork Chop', quantity: 1, unitAmount: 1250 }],
			});
	};

	it('returns 200 for checkout session', async () => {
		const res = await checkout();
		expect(res.status).toBe(200);
	});

	it('returns url for checkout session', async () => {
		const res = await checkout();
		expect(res.body.url).toBe('https://checkout.stripe.com/c/pay/cs_test_123');
	});

	it('returns empty url when checkout session has no url', async () => {
		createCheckoutSession.mockResolvedValueOnce({
			id: 'cs_test_123',
			url: null,
		});
		const res = await checkout();
		expect(res.body.url).toBe('');
	});

	it('checkout session uses payment success URL', async () => {
		await checkout();
		const args = createCheckoutSession.mock.calls[0][0];
		expect(args.success_url).toContain('/payment/success');
	});

	it('checkout session uses payment failed URL', async () => {
		await checkout();
		const args = createCheckoutSession.mock.calls[0][0];
		expect(args.cancel_url).toContain('/payment/failed');
	});

	it('prefills the Stripe email when an email is provided', async () => {
		await request.post('/api/v0/checkout').send({
			orders: [{ orderId, name: 'Pork Chop', quantity: 1, unitAmount: 1250 }],
			email: 'shopper@test.com',
		});
		const args = createCheckoutSession.mock.calls[0][0];
		expect(args.customer_email).toBe('shopper@test.com');
	});

	it('omits customer_email when no email is provided', async () => {
		await checkout();
		const args = createCheckoutSession.mock.calls[0][0];
		expect(args.customer_email).toBeUndefined();
	});

	it('stores stockItems in metadata', async () => {
		await request.post('/api/v0/checkout').send({
			orders: [{ orderId, name: 'Pork Chop', quantity: 2, unitAmount: 1250 }],
			stockItems: [{ listingId: 'listing-1', quantity: 2 }],
		});
		const args = createCheckoutSession.mock.calls[0][0];
		expect(JSON.parse(args.metadata.stockItems)).toEqual([{ listingId: 'listing-1', quantity: 2 }]);
	});
});

describe('Payment webhook', () => {
	const orderId = 'order_123';

	beforeEach(() => {
		mockFetch.mockClear();
		mockFetch.mockResolvedValue(new Response(JSON.stringify({ stock: 10 })));
		vi.stubGlobal('fetch', mockFetch);
	});

	const checkoutSession = (type: string) => {
		return request
			.post('/api/v0/webhook')
			.send({
				type,
				data: {
					object: {
						id: 'cs_test_123',
						metadata: {
							orderIds: orderId,
							email: 'shopper@test.com',
							stockItems: JSON.stringify([{ listingId: 'listing-1', quantity: 2 }]),
						},
					},
				},
			});
	};

	const completedCheckoutSession = () => checkoutSession('checkout.session.completed');
	const failedCheckoutSession = () => checkoutSession('checkout.session.expired');

	it('returns 204 for completed checkout session', async () => {
		const res = await completedCheckoutSession();
		expect(res.status).toBe(204);
	});

	it('updates order status for completed checkout session', async () => {
		await completedCheckoutSession();
		const body = JSON.parse(mockFetch.mock.calls[0][1].body);
		expect(body.variables).toEqual({
			id: orderId,
			status: 'paid',
		});
	});

	it('updates order status for failed checkout session', async () => {
		await failedCheckoutSession();
		const body = JSON.parse(mockFetch.mock.calls[0][1].body);
		expect(body.variables).toEqual({
			id: orderId,
			status: 'failed',
		});
	});

	it('sends order confirmation email for completed checkout', async () => {
		await completedCheckoutSession();
		const emailCall = mockFetch.mock.calls.find(
			(call: unknown[]) => (call[0] as string).includes('/email'),
		);
		expect(emailCall).toBeDefined();
	});

	it('does not send email for failed checkout', async () => {
		await failedCheckoutSession();
		const emailCall = mockFetch.mock.calls.find(
			(call: unknown[]) => (call[0] as string).includes('/email'),
		);
		expect(emailCall).toBeUndefined();
	});

	it('decreases stock on successful payment', async () => {
		await completedCheckoutSession();
		const putCall = mockFetch.mock.calls.find(
			(call: unknown[]) => (call[1] as Record<string, string>)?.method === 'PUT',
		);
		const opts = (putCall as unknown[])[1] as Record<string, string>;
		const body = JSON.parse(opts.body);
		expect(body.stock).toBe(8);
	});

	it('does not decrease stock on failed payment', async () => {
		await failedCheckoutSession();
		const putCall = mockFetch.mock.calls.find(
			(call: unknown[]) => (call[1] as Record<string, string>)?.method === 'PUT',
		);
		expect(putCall).toBeUndefined();
	});
});

describe('docs', () => {
	it('GET /api/v0/docs/', async () => {
		await request.get('/api/v0/docs/').expect(200);
	});
});
