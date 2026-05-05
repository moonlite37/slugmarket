import { request } from './setup';
import { describe, it, expect, vi } from 'vitest';
import { LoginTicket } from 'google-auth-library';
import { GetTokenResponse } from 'google-auth-library/build/src/auth/oauth2client';
import { EncryptJWT } from 'jose';

const TEXT_ENCODED_SECRET = new TextEncoder().encode(process.env.SECRET);
const JWE_ALGORITHM = 'A256CBC-HS512';

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
        payload: { name: 'Mock Name' },
      }),
  };
});

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
    expect(res.status).toBe(302);
  });
});

describe.only('middleware auth', () => {
  it('returns 401 with no cookie', async () => {
    const res = await request.get('/api/v0/check');
    expect(res.status).toBe(401);
  });

  it('returns 200 with valid cookie', async () => {
    const token = await new EncryptJWT({
      name: 'Mock Name',
    })
      .setProtectedHeader({ alg: 'dir', enc: JWE_ALGORITHM })
      .setIssuedAt()
      .setExpirationTime('2h')
      .encrypt(TEXT_ENCODED_SECRET);

    const res = await request
      .get('/api/v0/check')
      .set('Cookie', `session=${token}`);

    expect(res.status).toBe(200);
  });

  it('returns 401 with invalid cookie', async () => {
    const res = await request
      .get('/api/v0/check')
      .set('Cookie', 'session=invalidtoken');

    expect(res.status).toBe(401);
  });
});
