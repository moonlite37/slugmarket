import { beforeAll, beforeEach, afterAll } from 'vitest';
import { createApp } from '../src/app';
import { shutdown } from '../src/db';
import { reset } from './db';
import http from 'http';

let server: http.Server;

beforeAll(async () => {
	const app = await createApp();
	server = http.createServer(app);
	server.listen(0);
});

beforeEach(async () => {
	await reset();
});

afterAll(async () => {
	server.close();
	await shutdown();
});

export { server };
