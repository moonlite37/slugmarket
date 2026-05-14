import { afterEach, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import proxy from '../src/proxy';

afterEach(() => {
	vi.unstubAllGlobals();
	vi.resetModules();
});

it('Allows Public Routes', async () => {
	const req = new NextRequest(new URL('http://localhost:3000/login'));
	const res = await proxy(req);
	expect(res.headers.get('location')).toBeNull();
});

it('Accepts Session Cookie', async () => {
	const req = new NextRequest(new URL('http://localhost:3000'), {
		headers: { cookie: 'session=valid-token' },
	});
	const res = await proxy(req);
	expect(res.headers.get('location')).toBeNull();
});

it('Rejects Missing Session Cookie', async () => {
	const req = new NextRequest(new URL('http://localhost:3000'));
	const res = await proxy(req);
	expect(res.headers.get('location')).toBe('http://localhost:3000/login');
});

it('Accepts Cookie', async () => {
	const req = new NextRequest(new URL('http://localhost:3000'), {
		headers: { cookie: 'session=valid-token' },
	});
	const res = await proxy(req);
	expect(res.headers.get('location')).toBeNull();
});

it('Rejects Bad Token', async () => {
	const req = new NextRequest(new URL('http://localhost:3000'));
	const res = await proxy(req);
	expect(res.headers.get('location')).toBe('http://localhost:3000/login');
});
