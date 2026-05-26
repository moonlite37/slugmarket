import { describe, it } from 'vitest';
import { request } from './setup';

describe('Swagger docs', () => {
	it('GET /api/v0/docs/', async () => {
		await request.get('/api/v0/docs/').expect(200);
	});
});
