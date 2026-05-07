import { afterEach, describe, expect, it, vi } from 'vitest';
import { cookies } from 'next/headers';

import { AuthService } from '../src/auth/service';

afterEach(() => {
	vi.restoreAllMocks();
});

describe('login', () => {
	it('returns name', async () => {
		const res = await new AuthService().login({
			email: 'johnpork@email.com',
			password: 'johnpork',
		});
		expect(res.name).toBe('John Pork');
	});
	it('sets auth cookie', async () => {
		await new AuthService().login({
			email: 'johnpork@email.com',
			password: 'johnpork',
		});
		const cookieStore = await cookies();
		const cookie = cookieStore.get('session')?.value;
		expect(cookie).toBeDefined();
	});
	it('rejects fake creds', async () => {
		await expect(
			new AuthService().login({
				email: 'johnpork@email.com',
				password: 'jaypork',
			}),
		).rejects.toBe('Unauthorized');
	});
});
