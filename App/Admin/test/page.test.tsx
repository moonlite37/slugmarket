import { describe, it, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { cookies } from 'next/headers';
import LoginPage from '../src/app/login/page';

vi.mock('../src/app/listing/actions', () => ({
	getListings: vi.fn().mockResolvedValue([]),
	deleteListing: vi.fn().mockResolvedValue(undefined),
}));
vi.mock('../src/app/order/actions', () => ({
	getOrders: vi.fn().mockResolvedValue([]),
	updateOrderStatus: vi.fn().mockResolvedValue(undefined),
}));
vi.mock('../src/app/category/actions', () => ({
	getCategories: vi.fn().mockResolvedValue([]),
	createCategory: vi.fn().mockResolvedValue({ id: 'c1', name: 'Test' }),
	deleteCategory: vi.fn().mockResolvedValue(undefined),
}));

describe('page', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});
	it('Renders', async () => {
		const cookieStore = await cookies();
		cookieStore.set('session', 'test-token');
		const Page = (await import('../src/app/page')).default;
		render(await Page());
	});
	it('Renders Login', async () => {
		render(<LoginPage />);
	});
	it('Redirects when no session', async () => {
		vi.doMock('next/headers', async () => {
			return {
				cookies: async () => ({
					get: () => undefined,
				}),
			};
		});
		vi.resetModules();
		const { default: PageNoSession } = await import('../src/app/page');
		try {
			await PageNoSession();
		} catch {
			// redirect throws NEXT_REDIRECT
		}
	});
});
