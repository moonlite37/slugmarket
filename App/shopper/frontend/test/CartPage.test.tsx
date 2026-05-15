import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MemoryRouter, useLocation } from 'react-router-dom';


import { CartContextProvider } from '@/context/CartContextProvider';
import CartPage from '@/pages/Cart';
import ShopPage from '@/pages/Shop';
import { server } from '../vitest.setup';
import { mockListings } from './mocks';

function CurrentLocation() {
	const location = useLocation();
	return <div>{location.pathname}</div>;
}

describe('cart page', () => {
	it('routes home', async () => {
		const user = userEvent.setup();
		render(
			<MemoryRouter initialEntries={['/cart']}>
				<CartContextProvider>
					<CartPage />
					<CurrentLocation />
				</CartContextProvider>
			</MemoryRouter>,
		);
		await user.click(screen.getByLabelText('slug market home'));
		expect(screen.getByText('/')).toBeInTheDocument();
	});
	it('shows an empty cart initially', () => {
		render(
			<MemoryRouter>
				<CartContextProvider>
					<CartPage />
				</CartContextProvider>
			</MemoryRouter>,
		);
		expect(screen.getByText('Your Cart is Empty')).toBeInTheDocument();
	});

	it('shows an item added from the shop page', async () => {
		const user = userEvent.setup();
		server.use(mockListings());
		render(
			<MemoryRouter>
				<CartContextProvider>
					<ShopPage />
					<CartPage />
				</CartContextProvider>
			</MemoryRouter>,
		);
		await user.click(await screen.findByLabelText('add Pork Chops to cart'));
		expect(screen.getByLabelText('Pork Chops in cart')).toBeInTheDocument();
	});

	it('removes an item from the cart page', async () => {
		const user = userEvent.setup();
		server.use(mockListings());
		render(
			<MemoryRouter>
				<CartContextProvider>
					<ShopPage />
					<CartPage />
				</CartContextProvider>
			</MemoryRouter>,
		);
		await user.click(await screen.findByLabelText('add Pork Chops to cart'));
		await user.click(screen.getByLabelText('remove Pork Chops from cart'));
		expect(screen.getByText('Your Cart is Empty')).toBeInTheDocument();
	});
});
