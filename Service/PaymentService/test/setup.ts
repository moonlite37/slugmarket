import {beforeAll, afterAll} from 'vitest';
import supertest from 'supertest';
import TestAgent from 'supertest/lib/agent';

import * as http from 'http';
import {shutdown} from '../src/db';
import app from '../src/app';

let server: http.Server<
	typeof http.IncomingMessage,
	typeof http.ServerResponse
>;

export let request: TestAgent;

beforeAll(() => {
	server = http.createServer(app);
	server.listen();
	request = supertest(server);
});

afterAll(async () => {
	await shutdown();
	server.close();
});
