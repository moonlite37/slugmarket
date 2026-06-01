import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { server } from '../vitest.setup';

import Dashboard from '@/Dashboard';

const listing = {
	id: 'mock-listing-id',
	title: 'Mock Listing',
	description: 'A mocked listing',
	price: 10,
	stock: 5,
	categories: ['test'],
	author: 'mock-id',
	created: '2026-05-31',
};

function LocationDisplay() {
	const location = useLocation();
	return <div>{location.pathname}</div>;
}

describe('edit listing', () => {
	it('renders an update aria label for the listing title', async () => {
		server.use(
			http.get('http://localhost:3000/seller/api/v0/listing', () => {
				return HttpResponse.json([listing]);
			}),
		);

		render(
			<MemoryRouter>
				<Dashboard />
			</MemoryRouter>,
		);

		expect(await screen.findByLabelText(`update ${listing.title}`)).toBeDefined();
	});

	it('changes route when clicking the update label', async () => {
		const user = userEvent.setup();

		server.use(
			http.get('http://localhost:3000/seller/api/v0/listing', () => {
				return HttpResponse.json([listing]);
			}),
		);

		render(
			<MemoryRouter initialEntries={['/']}>
				<Routes>
					<Route
						path="/"
						element={
							<>
								<Dashboard />
								<LocationDisplay />
							</>
						}
					/>
					<Route path="/listing/:id/edit" element={<LocationDisplay />} />
				</Routes>
			</MemoryRouter>,
		);

		await user.click(await screen.findByLabelText(`update ${listing.title}`));

		expect(screen.getByText(`/listing/${listing.id}/edit`)).toBeDefined();
	});
});
