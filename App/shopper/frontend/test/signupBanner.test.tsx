import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { server } from '../vitest.setup';
import { http, HttpResponse } from 'msw';
import SignupBanner from '@/components/SignupBanner';

describe('SignupBanner', () => {
	it('shows sign in prompt when not logged in', async () => {
		render(
			<MemoryRouter>
				<SignupBanner />
			</MemoryRouter>,
		);
		await waitFor(() => {
			screen.getByText(/Sign in to save/i);
		});
	});

	it('has sign in link', async () => {
		render(
			<MemoryRouter>
				<SignupBanner />
			</MemoryRouter>,
		);
		await waitFor(() => {
			screen.getByRole('link', { name: /Sign In/i });
		});
	});

	it('hides when logged in', async () => {
		server.use(
			http.get('/shopper/api/v0/protected', () => {
				return new HttpResponse(null, { status: 200 });
			}),
		);
		render(
			<MemoryRouter>
				<SignupBanner />
			</MemoryRouter>,
		);
		await waitFor(() => {
			expect(screen.queryByText(/Sign in to save/i)).toBeNull();
		});
	});
});
