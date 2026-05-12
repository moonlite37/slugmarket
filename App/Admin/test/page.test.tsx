import { describe, it, vi, beforeAll, beforeEach } from 'vitest';
import { render } from '@testing-library/react';

import Page from '../src/app/page';
import LoginPage from '../src/app/login/page';

describe('page', () => {
	beforeAll(() => {
		global.fetch = vi.fn();
	});

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(global.fetch).mockResolvedValue({
			ok: true,
			status: 200,
			json: async () => [],
		} as Response);
	});

	it('Renders', async () => {
		render(<Page />);
	});

	it('Renders Login', async () => {
		render(<LoginPage />);
	});
});