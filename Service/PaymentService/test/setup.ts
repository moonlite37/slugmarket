import {afterAll} from 'vitest';
import {shutdown} from '../src/db';

afterAll(async () => {
	await shutdown();
});
