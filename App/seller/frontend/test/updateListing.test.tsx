import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { server } from '../vitest.setup';

import Dashboard from '@/Dashboard';
import UpdateListing from '@/UpdateListing/page';

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

const updateLabel = `update ${listing.title}`;
const updatePath = `/listing/${listing.id}/edit`;

function LocationDisplay() {
	const location = useLocation();
	return <div>{location.pathname}</div>;
}

function mockListings() {
	server.use(
		http.get('http://localhost:3000/seller/api/v0/listing', () => {
			return HttpResponse.json([listing]);
		}),
	);
}

function mockListing() {
	server.use(
		http.get('http://localhost:3000/seller/api/v0/listing/:id', () => {
			return HttpResponse.json(listing);
		}),
	);
}

function renderDashboard() {
	render(
		<MemoryRouter>
			<Dashboard />
		</MemoryRouter>,
	);
}

function renderDashboardWithRoutes() {
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
}

function renderUpdateListing() {
	render(
		<MemoryRouter>
			<UpdateListing />
		</MemoryRouter>,
	);
}

function renderUpdateListingWithRoutes() {
	mockListing();
	render(
		<MemoryRouter initialEntries={[updatePath]}>
			<Routes>
				<Route
					path="/listing/:id/edit"
					element={
						<>
							<UpdateListing />
							<LocationDisplay />
						</>
					}
				/>
				<Route path="/" element={<LocationDisplay />} />
			</Routes>
		</MemoryRouter>,
	);
}

function renderUpdateListingAtEditRoute() {
	mockListing();
	render(
		<MemoryRouter initialEntries={[updatePath]}>
			<Routes>
				<Route path="/listing/:id/edit" element={<UpdateListing />} />
			</Routes>
		</MemoryRouter>,
	);
}

describe('update listing page', () => {
	it('has a save icon button with a save edits aria label', () => {
		renderUpdateListing();
		expect(screen.getByRole('button', { name: /save edits/i })).toBeDefined();
	});

	it('routes back to the dashboard when clicking save', async () => {
		const user = userEvent.setup();
		renderUpdateListingWithRoutes();
		await user.click(screen.getByRole('button', { name: /save edits/i }));
		expect(screen.getByText('/')).toBeDefined();
	});

	it('initially shows the listing title', async () => {
		renderUpdateListingAtEditRoute();
		expect(await screen.findByLabelText('Title')).toHaveProperty('value', listing.title);
	});

	it('initially shows the listing description', async () => {
		renderUpdateListingAtEditRoute();
		expect(await screen.findByLabelText('Description')).toHaveProperty('value', listing.description);
	});

	it('initially shows the listing price', async () => {
		renderUpdateListingAtEditRoute();
		expect(await screen.findByLabelText('Price')).toHaveProperty('value', String(listing.price));
	});

	it('initially shows the listing stock', async () => {
		renderUpdateListingAtEditRoute();
		expect(await screen.findByLabelText('Stock')).toHaveProperty('value', String(listing.stock));
	});

	it('initially shows the listing categories', async () => {
		renderUpdateListingAtEditRoute();
		expect(await screen.findByLabelText('Categories')).toHaveProperty(
			'value',
			listing.categories.join(', '),
		);
	});
});

describe('update listing button', () => {
	beforeEach(() => {
		mockListings();
	});

	it('renders an update aria label for the listing title', async () => {
		renderDashboard();
		expect(await screen.findByLabelText(updateLabel)).toBeDefined();
	});

	it('changes route when clicking the update label', async () => {
		const user = userEvent.setup();
		renderDashboardWithRoutes();
		await user.click(await screen.findByLabelText(updateLabel));
		expect(screen.getByText(updatePath)).toBeDefined();
	});
});
