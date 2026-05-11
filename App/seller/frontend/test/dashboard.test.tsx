import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { server } from '../vitest.setup';
import { http, HttpResponse } from 'msw';

import Dashboard from '@/Dashboard';

describe('Seller Dashboard', () => {
	it('renders My Listings heading', () => {
		render(
			<MemoryRouter>
				<Dashboard />
			</MemoryRouter>,
		);
		screen.getByText('My Listings');
	});

	it('displays listings from backend', async () => {
		render(
			<MemoryRouter>
				<Dashboard />
			</MemoryRouter>,
		);
		await waitFor(() => {
			screen.getByText('My Widget');
		});
		screen.getByText('Another Widget');
	});

	it('renders create new listing link', () => {
		render(
			<MemoryRouter>
				<Dashboard />
			</MemoryRouter>,
		);
		expect(screen.getByRole('link', { name: /create new listing/i })).toBeDefined();
	});

    it('handles fetch failure gracefully', async () => {
	server.use(
		http.get('http://localhost:3013/api/v0/listing', () => {
			return new HttpResponse(null, { status: 500 });
		}),
	);
	render(
		<MemoryRouter>
			<Dashboard />
		</MemoryRouter>,
	);
	await waitFor(() => {
		screen.getByText('No listings yet');
	});
});
});