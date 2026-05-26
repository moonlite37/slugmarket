import {beforeAll, afterAll} from 'vitest';
import supertest from 'supertest';
import * as http from 'http';
import app from '../src/app';

let server: http.Server;
export let request: ReturnType<typeof supertest>;

beforeAll(() => {
	server = http.createServer(app);
	server.listen();
	request = supertest(server);
});
afterAll(() => {
	server.close();
});
