import request from 'supertest';
import {describe, test} from 'vitest';
import app from '../src/app';

describe('Payment service', () => {
	test('health', async () => {
		await request(app).get('/api/v0/payment/health')
			.expect(200);
	});
});
