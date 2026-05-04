import { describe, it } from 'vitest';
import { request } from './setup';

describe('test', () => {
  it('returns 200', async () => {
    await request.get('/api/auth').expect(200);
  });
});
