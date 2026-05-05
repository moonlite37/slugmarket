import { request } from './setup';
import { describe, it, expect, vi } from 'vitest';
import { LoginTicket } from 'google-auth-library';
import { GetTokenResponse } from 'google-auth-library/build/src/auth/oauth2client';

vi.mock('google-auth-library', async (importOriginal) => {
  const actual = await importOriginal<typeof import('google-auth-library')>();
  return {
    OAuth2Client: class extends actual.OAuth2Client {
      override getToken = vi.fn(
        (): Promise<GetTokenResponse> =>
          Promise.resolve({
            tokens: { id_token: 'test-token' },
            res: null,
          } as GetTokenResponse),
      );

      override verifyIdToken = vi.fn(
        (): Promise<LoginTicket> =>
          Promise.resolve({
            getPayload: () => ({
              email: 'test@example.com',
              name: 'Test User',
            }),
          } as LoginTicket),
      );
    },
  };
});

describe('docs', () => {
  it('GET /api/v0/docs/', async () => {
    await request.get('/api/v0/docs/').expect(200);
  });
});

describe('login', () => {
  it('redirects to google', async () => {
    const res = await request.get('/api/v0/login');
    expect(res.headers.location).toContain('accounts.google.com');
  });

  it('google login callback', async () => {
    const res = await request.get('/api/v0/login/callback?code=fakeCode');
    expect(res.status).toBe(204);
  });
});
