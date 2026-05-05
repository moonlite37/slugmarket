import { request } from './setup';
import { describe, it, expect } from 'vitest';

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
});
