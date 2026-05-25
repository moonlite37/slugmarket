import {describe, expect, it} from 'vitest';
import {request} from './setup';

describe('GET /api/v0/image/health', () => {
	it('returns image service health', async () => {
		const res = await request.get('/api/v0/image/health');

		expect(res.status).toBe(200);
		expect(res.body).toEqual({
			status: 'ok',
			service: 'ImageSerivce',
		});
	});
});

describe('docs', () => {
	it('GET /api/v0/docs/', async () => {
		await request.get('/api/v0/docs/').expect(200);
	});
});

