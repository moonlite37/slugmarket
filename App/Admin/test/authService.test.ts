import { describe, expect, it, vi, beforeAll, beforeEach } from 'vitest';
import { cookies } from 'next/headers';

import { AuthService } from '../src/auth/service';

describe('login', () => {
	beforeAll(() => {
		global.fetch = vi.fn();
	});

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns name', async () => {
		vi.mocked(global.fetch).mockResolvedValueOnce({
			status: 200,
			json: async () => ({
				name: 'John Pork',
				authToken: 'test-token-123',
			}),
		} as Response);

		const res = await new AuthService().login({
			email: 'johnpork@email.com',
			password: 'johnpork',
		});
		expect(res.name).toBe('John Pork');
	});

	it('sets auth cookie', async () => {
		vi.mocked(global.fetch).mockResolvedValueOnce({
			status: 200,
			json: async () => ({
				name: 'John Pork',
				authToken: 'test-token-123',
			}),
		} as Response);

		await new AuthService().login({
			email: 'johnpork@email.com',
			password: 'johnpork',
		});
		const cookieStore = await cookies();
		const cookie = cookieStore.get('session')?.value;
		expect(cookie).toBeDefined();
	});

	it('rejects fake creds', async () => {
		vi.mocked(global.fetch).mockResolvedValueOnce({
			status: 401,
			json: async () => ({}),
		} as Response);

		await expect(
			new AuthService().login({
				email: 'johnpork@email.com',
				password: 'jaypork',
			}),
		).rejects.toBe('Unauthorized');
	});
});
