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

let currentListing = { ...listing };
const updateLabel = `update ${listing.title}`;
const updatePath = `/listing/${listing.id}/edit`;
const wrongUpdatePath = '/listing/wrong-listing-id/edit';

function LocationDisplay() {
	const location = useLocation();
	return <div>{location.pathname}</div>;
}

function mockListings() {
	server.use(
		http.get('http://localhost:3000/seller/api/v0/listing', () => {
			return HttpResponse.json([currentListing]);
		}),
	);
}

function mockListing() {
	server.use(
		http.get('http://localhost:3000/seller/api/v0/listing/:id', () => {
			return HttpResponse.json(currentListing);
		}),
	);
}

function mockListingUpdate() {
	server.use(
		http.put('http://localhost:3000/seller/api/v0/listing/:id', async ({ request }) => {
			const body = (await request.json()) as Partial<typeof listing>;
			currentListing = {
				...currentListing,
				...body,
			};
			return HttpResponse.json(currentListing);
		}),
	);
}

function mockListingNotFound() {
	server.use(
		http.get('http://localhost:3000/seller/api/v0/listing/:id', () => {
			return new HttpResponse(null, { status: 404 });
		}),
	);
}

function mockListingUpdateNotFound() {
	server.use(
		http.put('http://localhost:3000/seller/api/v0/listing/:id', () => {
			return new HttpResponse(null, { status: 404 });
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
	mockListingUpdate();
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

function renderUpdateListingToDashboard() {
	mockListing();
	mockListingUpdate();
	mockListings();
	render(
		<MemoryRouter initialEntries={[updatePath]}>
			<Routes>
				<Route path="/listing/:id/edit" element={<UpdateListing />} />
				<Route path="/" element={<Dashboard />} />
			</Routes>
		</MemoryRouter>,
	);
}

async function editFieldAndSave(label: string, value: string) {
	const user = userEvent.setup();
	const field = await screen.findByLabelText(label);
	await user.clear(field);
	await user.type(field, value);
	await user.click(screen.getByRole('button', { name: /save edits/i }));
}

function renderUpdateListingWithoutId() {
	render(
		<MemoryRouter initialEntries={['/listing/edit']}>
			<Routes>
				<Route
					path="/listing/edit"
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

function renderWrongUpdateListingRoute() {
	render(
		<MemoryRouter initialEntries={[wrongUpdatePath]}>
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

describe('update listing page', () => {
	beforeEach(() => {
		currentListing = { ...listing };
	});

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

	it('updates the dashboard listing title after editing title', async () => {
		renderUpdateListingToDashboard();
		await editFieldAndSave('Title', 'Edited Listing');
		expect(await screen.findByText('Edited Listing')).toBeDefined();
	});

	it('updates the dashboard listing description after editing description', async () => {
		renderUpdateListingToDashboard();
		await editFieldAndSave('Description', 'Edited description');
		expect(await screen.findByText('Edited description')).toBeDefined();
	});

	it('updates the dashboard listing price after editing price', async () => {
		renderUpdateListingToDashboard();
		await editFieldAndSave('Price', '25');
		expect(await screen.findByText(/\$25/)).toBeDefined();
	});

	it('updates the dashboard listing stock after editing stock', async () => {
		renderUpdateListingToDashboard();
		await editFieldAndSave('Stock', '12');
		expect(await screen.findByText(/12 in stock/)).toBeDefined();
	});

	it('updates the dashboard listing categories after editing categories', async () => {
		renderUpdateListingToDashboard();
		await editFieldAndSave('Categories', 'updated, books');
		expect(await screen.findByText('updated, books')).toBeDefined();
	});

	it('does not load listing values when no id is present', () => {
		renderUpdateListingWithoutId();
		expect(screen.getByLabelText('Title')).toHaveProperty('value', '');
	});

	it('stays on the update page when saving without an id', async () => {
		const user = userEvent.setup();
		renderUpdateListingWithoutId();
		await user.click(screen.getByRole('button', { name: /save edits/i }));
		expect(screen.getByText('/listing/edit')).toBeDefined();
	});

	it('keeps fields empty when listing get returns 404 for a wrong id', async () => {
		mockListingNotFound();
		renderWrongUpdateListingRoute();
		expect(await screen.findByLabelText('Title')).toHaveProperty('value', '');
	});

	it('stays on the update page when save returns 404 for a wrong id', async () => {
		const user = userEvent.setup();
		mockListing();
		mockListingUpdateNotFound();
		renderWrongUpdateListingRoute();
		await user.click(await screen.findByRole('button', { name: /save edits/i }));
		expect(screen.getByText(wrongUpdatePath)).toBeDefined();
	});
});

describe('update listing button', () => {
	beforeEach(() => {
		currentListing = { ...listing };
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
