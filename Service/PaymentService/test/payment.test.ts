import { describe, it, expect, vi, beforeEach } from 'vitest';
import { request } from './setup';

const {createCheckoutSession} = vi.hoisted(() => ({
	createCheckoutSession: vi.fn(),
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
	beforeEach(() => {
		createCheckoutSession.mockResolvedValue({
			id: 'cs_test_123',
			url: 'https://checkout.stripe.com/c/pay/cs_test_123',
		});
	});

	const checkout = () => {
		return request
			.post('/api/v0/checkout')
			.send({
				name: 'Pork Chop',
				quantity: 1,
				unitAmount: 1250,
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
});

describe('docs', () => {
	it('GET /api/v0/docs/', async () => {
		await request.get('/api/v0/docs/').expect(200);
	});
});
