import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { server } from '../vitest.setup';
import { mockListings } from './mocks';
import ShopPage from '@/pages/Shop';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';

function CurrentLocation() {
	const location = useLocation();
	return <div>{location.pathname}</div>;
}

describe('listing list', () => {
	it('routes to cart page', async () => {
		const user = userEvent.setup();
		server.use(mockListings());
		render(
			<MemoryRouter initialEntries={['/']}>
				<ShopPage />
				<CurrentLocation />
			</MemoryRouter>,
		);
		await user.click(screen.getByLabelText(/view cart/i));
		expect(screen.getByText('/cart')).toBeInTheDocument();
	});

	it('shows filters when opened', async () => {
		const user = userEvent.setup();
		server.use(mockListings());
		render(
			<MemoryRouter>
				<ShopPage />
			</MemoryRouter>,
		);
		await user.click(screen.getByLabelText(/open filters/i));
		expect(await screen.findByText('Filters')).toBeInTheDocument();
	});

	it('hides filters when closed', async () => {
		const user = userEvent.setup();
		server.use(mockListings());
		render(
			<MemoryRouter>
				<ShopPage />
			</MemoryRouter>,
		);
		await user.click(screen.getByLabelText(/open filters/i));
		await screen.findByText('Filters');
		await user.keyboard('{Escape}');
		await waitFor(() =>
			expect(screen.queryByText('Filters')).not.toBeInTheDocument(),
		);
	});

	it('Displays app page and has functionality', async () => {
		const user = userEvent.setup();
		server.use(mockListings());
		render(
			<MemoryRouter>
				<ShopPage />
			</MemoryRouter>,
		);
		await user.click(screen.getByLabelText(/open filters/i));
		const minInput = screen.getByPlaceholderText("Min");
		const maxInput = screen.getByPlaceholderText("Max");
		await screen.findByText("Pork Chops");
		await user.type(minInput, "500");
		await user.type(maxInput, "1000");
		await user.tab();
		expect(await screen.queryByText('Pork Chops')).toBeNull();
	});
});

describe('search bar on main page', () => {
	it('shows search bar without opening filters', async () => {
		server.use(mockListings());
		render(
			<MemoryRouter>
				<ShopPage />
			</MemoryRouter>,
		);
		expect(screen.getByPlaceholderText('Search listings...')).toBeTruthy();
	});
	it('updates search value when typing', async () => {
		const user = userEvent.setup();
		server.use(mockListings());
		render(
			<MemoryRouter>
				<ShopPage />
			</MemoryRouter>,
		);
		const searchInput = screen.getByPlaceholderText('Search listings...');
		await user.type(searchInput, 'hoodie');
		expect(searchInput).toHaveValue('hoodie');
	});
});
