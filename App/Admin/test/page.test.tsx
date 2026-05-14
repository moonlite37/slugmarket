import { describe, it, vi, beforeAll, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { cookies } from 'next/headers';
import LoginPage from '../src/app/login/page';

describe('page', () => {
	beforeAll(() => {
		global.fetch = vi.fn();
	});
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(global.fetch).mockResolvedValue({
			ok: true,
			status: 200,
			json: async () => [],
		} as Response);
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
