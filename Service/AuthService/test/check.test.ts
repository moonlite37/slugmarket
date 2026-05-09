import { describe, it, expect, vi } from 'vitest';
import { request } from './setup';

vi.mock('jose', () => {
	return {
		EncryptJWT: vi.fn(
			class {
				setProtectedHeader = vi.fn().mockReturnThis();
				setIssuedAt = vi.fn().mockReturnThis();
				setExpirationTime = vi.fn().mockReturnThis();
				encrypt = vi.fn().mockResolvedValue('mocked-jwe');
			},
		),
		jwtDecrypt: vi.fn().mockResolvedValue({
			payload: { id: 'mock-user-id', role: 'admin' },
		}),
	};
});

describe('check', () => {
	it('returns 200 with valid token', async () => {
		const res = await request
			.get('/api/v0/check')
			.set('Authorization', 'Bearer mocked-jwe');
		expect(res.status).toBe(200);
		expect(res.body.id).toBe('mock-user-id');
		expect(res.body.role).toBe('admin');
	});
	it('returns 401 with no auth header', async () => {
	    const res = await request.get('/api/v0/check');
	    expect(res.status).toBe(401);
	});

	it('returns 401 with invalid token', async () => {
	    const { jwtDecrypt } = await import('jose');
	    (jwtDecrypt as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Invalid token'));
	    const res = await request
		    .get('/api/v0/check')
		    .set('Authorization', 'Bearer garbage-token');
	    expect(res.status).toBe(401);
	});
});