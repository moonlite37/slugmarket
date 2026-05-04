import { describe, it } from 'vitest';
import { request } from './setup';

describe('test', () => {
  it('GET /api/v0/docs/', async () => {
    await request.get('/api/v0/docs/').expect(200);
  });
  it('returns 200', async () => {
    await request.get('/api/v0/auth').expect(200);
  });
});
