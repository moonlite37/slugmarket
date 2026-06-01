import { describe, it, expect, vi, beforeEach } from 'vitest';
import { request } from './setup';

const {createCheckoutSession} = vi.hoisted(() => ({
	createCheckoutSession: vi.fn(),
}));

const {updateOrderStatus} = vi.hoisted(() => ({
	updateOrderStatus: vi.fn(),
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
});

describe('Payment webhook', () => {
	const orderId = 'order_123';

	beforeEach(() => {
		updateOrderStatus.mockClear();
		updateOrderStatus.mockResolvedValue(new Response('{}'));
		vi.stubGlobal('fetch', updateOrderStatus);
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
		const body = JSON.parse(updateOrderStatus.mock.calls[0][1].body);
		expect(body.variables).toEqual({
			id: orderId,
			status: 'paid',
		});
	});

	it('updates order status for failed checkout session', async () => {
		await failedCheckoutSession();
		const body = JSON.parse(updateOrderStatus.mock.calls[0][1].body);
		expect(body.variables).toEqual({
			id: orderId,
			status: 'failed',
		});
	});

	it('sends order confirmation email for completed checkout', async () => {
		await completedCheckoutSession();
		const emailCall = updateOrderStatus.mock.calls.find(
			(call: [string]) => call[0].includes('/email'),
		);
		expect(emailCall).toBeDefined();
	});

	it('does not send email for failed checkout', async () => {
		await failedCheckoutSession();
		const emailCall = updateOrderStatus.mock.calls.find(
			(call: [string]) => call[0].includes('/email'),
		);
		expect(emailCall).toBeUndefined();
	});
});

describe('docs', () => {
	it('GET /api/v0/docs/', async () => {
		await request.get('/api/v0/docs/').expect(200);
	});
});
