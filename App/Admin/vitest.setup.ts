import { beforeEach, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

vi.mock('next/headers', async (importOriginal) => {
	const actual = await importOriginal<typeof import('next/headers')>();
	const store = new Map<string, string>();
	return {
		...actual,
		cookies: async () => ({
			set: (key: string, value: string) => { store.set(key, value); },
			delete: (key: string) => { store.delete(key); },
			get: (key: string) => {
				const value = store.get(key);
				return value !== undefined ? { value } : undefined;
			},
		}),
	};
});

beforeEach(() => {
	vi.clearAllMocks();
});

afterEach(() => {
	cleanup();
});