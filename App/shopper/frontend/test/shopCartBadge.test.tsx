import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { CartContextProvider } from '../src/context/CartContextProvider';
import Cart from '../src/cart/list';
import ShopPage from '@/pages/Shop';
import { server } from '../vitest.setup';
import { mockListings } from './mocks';

// The count lives in the badge that wraps the cart icon inside the "view cart" button.
const cartBadge = () => within(screen.getByLabelText(/view cart/i));

const renderShop = () =>
	render(
		<MemoryRouter>
			<CartContextProvider>
				<ShopPage />
			</CartContextProvider>
		</MemoryRouter>,
	);

const renderShopAndCart = () =>
	render(
		<MemoryRouter>
			<CartContextProvider>
				<ShopPage />
				<Cart />
			</CartContextProvider>
		</MemoryRouter>,
	);

beforeEach(() => localStorage.clear());

describe('cart icon count badge', () => {
	it('hides the badge when the cart is empty', async () => {
		server.use(mockListings());
		renderShop();
		await screen.findByLabelText('add Pork Chops to cart');
		// MUI keeps the "0" in the DOM but hides it via the invisible class.
		expect(cartBadge().getByText('0')).toHaveClass('MuiBadge-invisible');
	});

	it('shows the badge once an item is added', async () => {
		const user = userEvent.setup();
		server.use(mockListings());
		renderShop();
		await user.click(await screen.findByLabelText('add Pork Chops to cart'));
		expect(cartBadge().getByText('1')).not.toHaveClass('MuiBadge-invisible');
	});

	it('shows 1 after adding a single item', async () => {
		const user = userEvent.setup();
		server.use(mockListings());
		renderShop();
		await user.click(await screen.findByLabelText('add Pork Chops to cart'));
		expect(cartBadge().getByText('1')).toBeInTheDocument();
	});

	it('counts total quantity when the same item is added twice', async () => {
		const user = userEvent.setup();
		server.use(mockListings());
		renderShop();
		const add = await screen.findByLabelText('add Pork Chops to cart');
		await user.click(add);
		await user.click(add);
		expect(cartBadge().getByText('2')).toBeInTheDocument();
	});

	it('counts across different items', async () => {
		const user = userEvent.setup();
		server.use(mockListings());
		renderShop();
		await user.click(await screen.findByLabelText('add Pork Chops to cart'));
		await user.click(screen.getByLabelText('add Iphone 7 to cart'));
		expect(cartBadge().getByText('2')).toBeInTheDocument();
	});

	it('decreases the count when an item is removed', async () => {
		const user = userEvent.setup();
		server.use(mockListings());
		renderShopAndCart();
		await user.click(await screen.findByLabelText('add Pork Chops to cart'));
		await user.click(screen.getByLabelText('add Iphone 7 to cart'));
		expect(cartBadge().getByText('2')).toBeInTheDocument();

		await user.click(screen.getByLabelText('remove Pork Chops from cart'));
		expect(cartBadge().getByText('1')).toBeInTheDocument();
	});
});
