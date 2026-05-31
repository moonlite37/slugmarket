import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
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
});
