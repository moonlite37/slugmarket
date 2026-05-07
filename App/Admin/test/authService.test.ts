import { describe, expect, it } from 'vitest';
import { AuthService } from '../src/auth/service';


describe('login', () => {
	it('returns name', async () => {
		const res = await new AuthService().login({
			email: 'johnpork@email.com', 
			password: 'johnpork',
		});
		expect(res.name).toBe('John Pork');
	});
});