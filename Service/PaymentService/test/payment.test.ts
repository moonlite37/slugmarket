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

const sampleCheckout = {
	lineItems: [{ name: 'Pork Chop', quantity: 1, unitAmount: 1250 }],
	shopperId: 'shopper-1',
	shopperName: 'John',
	shopperEmail: 'john@test.com',
	orderData: [{ seller: 'seller-1', items: [{ listingId: 'l1', title: 'Pork Chop', price: 12.5, quantity: 1 }], total: 12.5 }],
	stockItems: [{ listingId: 'l1', quantity: 1 }],
};

describe('Payment checkout', () => {
	beforeEach(() => {
		createCheckoutSession.mockClear();
		createCheckoutSession.mockResolvedValue({
			id: 'cs_test_123',
			url: 'https://checkout.stripe.com/c/pay/cs_test_123',
		});
	});

	const checkout = (body = sampleCheckout) => {
		return request.post('/api/v0/checkout').send(body);
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
		createCheckoutSession.mockResolvedValueOnce({ id: 'cs_test_123', url: null });
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

	it('restricts payment methods to card only', async () => {
		await checkout();
		const args = createCheckoutSession.mock.calls[0][0];
		expect(args.payment_method_types).toEqual(['card']);
	});

	it('prefills Stripe email when provided', async () => {
		await checkout();
		const args = createCheckoutSession.mock.calls[0][0];
		expect(args.customer_email).toBe('john@test.com');
	});

	it('omits customer_email when no email provided', async () => {
		await checkout({ ...sampleCheckout, shopperEmail: '' });
		const args = createCheckoutSession.mock.calls[0][0];
		expect(args.customer_email).toBeUndefined();
	});

	it('falls back to empty name and stockItems when omitted', async () => {
		await request.post('/api/v0/checkout').send({
			lineItems: [{ name: 'X', quantity: 1, unitAmount: 100 }],
			shopperId: 's1',
			orderData: [],
		});
		const args = createCheckoutSession.mock.calls[0][0];
		expect(args.metadata.shopperName).toBe('');
		expect(args.metadata.stockItems).toBe('[]');
	});

	it('stores orderData in metadata', async () => {
		await checkout();
		const args = createCheckoutSession.mock.calls[0][0];
		const stored = JSON.parse(args.metadata.orderData);
		expect(stored[0].seller).toBe('seller-1');
	});

	it('stores stockItems in metadata', async () => {
		await checkout();
		const args = createCheckoutSession.mock.calls[0][0];
		expect(JSON.parse(args.metadata.stockItems)).toEqual([{ listingId: 'l1', quantity: 1 }]);
	});
});

describe('Payment webhook', () => {
	beforeEach(() => {
		mockFetch.mockClear();
		mockFetch.mockImplementation(() => Promise.resolve(new Response(JSON.stringify({
			data: { createOrder: { id: 'order-new-1', status: 'pending' } },
			stock: 10,
		}))));
		vi.stubGlobal('fetch', mockFetch);
	});

	const webhookEvent = (type: string) => {
		return request.post('/api/v0/webhook').send({
			type,
			data: {
				object: {
					id: 'cs_test_123',
					metadata: {
						shopperId: 'shopper-1',
						shopperName: 'John',
						shopperEmail: 'john@test.com',
						orderData: JSON.stringify([{
							seller: 'seller-1',
							items: [{ listingId: 'l1', title: 'Pork Chop', price: 12.5, quantity: 1 }],
							total: 12.5,
						}]),
						stockItems: JSON.stringify([{ listingId: 'l1', quantity: 1 }]),
					},
				},
			},
		});
	};

	it('returns 204 for completed checkout', async () => {
		const res = await webhookEvent('checkout.session.completed');
		expect(res.status).toBe(204);
	});

	it('creates order on successful payment', async () => {
		await webhookEvent('checkout.session.completed');
		const graphqlCall = mockFetch.mock.calls.find(
			(call: unknown[]) => (call[0] as string).includes('graphql'),
		);
		expect(graphqlCall).toBeDefined();
		const body = JSON.parse(((graphqlCall as unknown[])[1] as Record<string, string>).body);
		expect(body.query).toContain('createOrder');
		expect(body.variables.input.shopper).toBe('shopper-1');
	});

	it('does not create order on failed payment', async () => {
		await webhookEvent('checkout.session.expired');
		const graphqlCall = mockFetch.mock.calls.find(
			(call: unknown[]) => (call[0] as string).includes('graphql'),
		);
		expect(graphqlCall).toBeUndefined();
	});

	it('sends confirmation email on success', async () => {
		await webhookEvent('checkout.session.completed');
		const emailCall = mockFetch.mock.calls.find(
			(call: unknown[]) => (call[0] as string).includes('/email'),
		);
		expect(emailCall).toBeDefined();
	});

	it('does not send email on failure', async () => {
		await webhookEvent('checkout.session.expired');
		expect(mockFetch.mock.calls.length).toBe(0);
	});

	it('decreases stock on success', async () => {
		await webhookEvent('checkout.session.completed');
		const putCall = mockFetch.mock.calls.find(
			(call: unknown[]) => (call[1] as Record<string, string>)?.method === 'PUT',
		);
		expect(putCall).toBeDefined();
	});

	it('does not decrease stock on failure', async () => {
		await webhookEvent('checkout.session.expired');
		const putCall = mockFetch.mock.calls.find(
			(call: unknown[]) => (call[1] as Record<string, string>)?.method === 'PUT',
		);
		expect(putCall).toBeUndefined();
	});

	it('clears the cart on success', async () => {
		await webhookEvent('checkout.session.completed');
		const deleteCall = mockFetch.mock.calls.find(
			(call: unknown[]) =>
				(call[1] as Record<string, string>)?.method === 'DELETE' &&
				(call[0] as string).includes('/cart/item/'),
		);
		expect((deleteCall as unknown[])[0] as string).toContain('userId=shopper-1');
	});

	it('does not clear the cart on failure', async () => {
		await webhookEvent('checkout.session.expired');
		const deleteCall = mockFetch.mock.calls.find(
			(call: unknown[]) => (call[1] as Record<string, string>)?.method === 'DELETE',
		);
		expect(deleteCall).toBeUndefined();
	});

	const webhookWith = (metadata: Record<string, string>) =>
		request.post('/api/v0/webhook').send({
			type: 'checkout.session.completed',
			data: { object: { id: 'cs_test_123', metadata } },
		});

	it('handles a completed event with no order or stock metadata', async () => {
		const res = await webhookWith({ shopperId: 'shopper-1' });
		expect(res.status).toBe(204);
		expect(mockFetch.mock.calls.length).toBe(0);
	});

	it('skips orders the order service does not create', async () => {
		mockFetch.mockImplementation(() => Promise.resolve(new Response(JSON.stringify({}))));
		await webhookWith({
			shopperId: 'shopper-1', shopperName: '', shopperEmail: '',
			orderData: JSON.stringify([{ seller: 's1', items: [], total: 1 }]),
			stockItems: '[]',
		});
		const emailCall = mockFetch.mock.calls.find(
			(call: unknown[]) => (call[0] as string).includes('/email'),
		);
		expect(emailCall).toBeUndefined();
	});

	it('uses the fallback email when the shopper has none', async () => {
		mockFetch.mockImplementation(() =>
			Promise.resolve(new Response(JSON.stringify({ data: { createOrder: { id: 'o1' } } }))),
		);
		await webhookWith({
			shopperId: 'shopper-1', shopperName: '', shopperEmail: '',
			orderData: JSON.stringify([{ seller: 's1', items: [], total: 1 }]),
			stockItems: '[]',
		});
		const emailCall = mockFetch.mock.calls.find(
			(call: unknown[]) => (call[0] as string).includes('/email'),
		);
		const opts = (emailCall as unknown[])[1] as { body: string };
		expect(JSON.parse(opts.body).to).toBe('order-notifications@slugmarket.shop');
	});

	it('still returns 204 when downstream calls fail', async () => {
		mockFetch.mockImplementation((url: string, opts?: { method?: string }) => {
			if (url.includes('graphql')) {
				return Promise.resolve(new Response(JSON.stringify({ data: { createOrder: { id: 'o1' } } })));
			}
			if (url.includes('/listing/') && opts?.method === 'PUT') {
				return Promise.reject(new Error('listing down'));
			}
			if (url.includes('/listing/')) {
				return Promise.resolve(new Response(JSON.stringify({ stock: 5 })));
			}
			return Promise.reject(new Error('down'));
		});
		const res = await webhookWith({
			shopperId: 'shopper-1', shopperName: 'John', shopperEmail: 'j@t.com',
			orderData: JSON.stringify([{ seller: 's1', items: [], total: 1 }]),
			stockItems: JSON.stringify([{ listingId: 'l1', quantity: 1 }]),
		});
		expect(res.status).toBe(204);
	});

	it('skips the stock update when the listing is unavailable', async () => {
		mockFetch.mockImplementation((url: string) => {
			if (url.includes('graphql')) {
				return Promise.resolve(new Response(JSON.stringify({ data: { createOrder: { id: 'o1' } } })));
			}
			if (url.includes('/listing/')) {
				return Promise.resolve(new Response(null, { status: 500 }));
			}
			return Promise.resolve(new Response('{}'));
		});
		await webhookWith({
			shopperId: 'shopper-1', shopperName: 'John', shopperEmail: 'j@t.com',
			orderData: JSON.stringify([{ seller: 's1', items: [], total: 1 }]),
			stockItems: JSON.stringify([{ listingId: 'l1', quantity: 1 }]),
		});
		const putCall = mockFetch.mock.calls.find(
			(call: unknown[]) => (call[1] as Record<string, string>)?.method === 'PUT',
		);
		expect(putCall).toBeUndefined();
	});

	it('tolerates a null order entry', async () => {
		mockFetch.mockImplementation(() =>
			Promise.resolve(new Response(JSON.stringify({ data: { createOrder: { id: 'o1' } } }))),
		);
		const res = await webhookWith({
			shopperId: 'shopper-1', shopperName: 'John', shopperEmail: 'j@t.com',
			orderData: JSON.stringify([null]),
			stockItems: '[]',
		});
		expect(res.status).toBe(204);
	});
});

describe('docs', () => {
	it('GET /api/v0/docs/', async () => {
		await request.get('/api/v0/docs/').expect(200);
	});
});
