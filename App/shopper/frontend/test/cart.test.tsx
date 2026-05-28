import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CartItem from '../src/cart/card'
import Cart from '../src/cart/list'
import ListingList from '@/listing/list';

import { CartContext } from '../src/context/cartContext';
import { CartContextProvider } from '../src/context/CartContextProvider';
import { server } from '../vitest.setup';
import { mockListings } from './mocks';

const porkChop = { listing_id: 'pork-chop', name: 'Pork Chop', price: 10.99, quantity: 1, seller: '00000000-0000-0000-0000-000000000001' };
const singleItemContext = { items: [porkChop], addToCart: async () => {}, removeFromCart: async () => {} };

describe('cart item', () => {
	it('renders item', () => {
		render(<CartItem {...porkChop} />)
		expect(screen.getByText('Pork Chop')).toBeInTheDocument()
	})
	it('renders price', () => {
		render(<CartItem {...porkChop} />)
		expect(screen.getByText('$10.99')).toBeInTheDocument()
	})
})

describe('cart list', () => {
	it('renders', () => {
		render(
			<CartContextProvider>
				<Cart />
			</CartContextProvider>,
		);
		expect(screen.getByText('Shopping Cart')).toBeInTheDocument()
	})
	it('renders a item name', () => {
		render(
			<CartContext.Provider value={singleItemContext}>
				<Cart />
			</CartContext.Provider>,
		);
		expect(screen.getByText('Pork Chop')).toBeInTheDocument();
	});
	it('renders a item price', () => {
		render(
			<CartContext.Provider value={singleItemContext}>
				<Cart />
			</CartContext.Provider>,
		);
		expect(screen.getAllByText('$10.99').length).toBeGreaterThan(0);
	});
	it('renders the total for two items', () => {
		render(
			<CartContext.Provider value={{ items: [porkChop, { listing_id: 'chicken', name: 'Iphone 7', price: 9.99, quantity: 1, seller: '00000000-0000-0000-0000-000000000002' }], addToCart: async () => {}, removeFromCart: async () => {} }}>
				<Cart />
			</CartContext.Provider>,
		);
		expect(screen.getByText('$20.98')).toBeInTheDocument();
	});
	it('renders empty list', () => {
		render(
			<CartContextProvider>
				<Cart />
			</CartContextProvider>,
		);
		expect(screen.getByText('Your Cart is Empty')).toBeInTheDocument();
	})
})

describe('add and remove items', () => {
	it('add item to cart', async () => {
		server.use(mockListings());
		render(
			<CartContextProvider>
				<ListingList />
				<Cart />
			</CartContextProvider>,
		);
		await userEvent.click(await screen.findByLabelText('add Pork Chops to cart'))
		expect(screen.getByLabelText('Pork Chops in cart')).toBeInTheDocument();
	})
	it('remove items from shopping cart', async () => {
		server.use(mockListings());
		render(
			<CartContextProvider>
				<ListingList />
				<Cart />
			</CartContextProvider>,
		);
		await userEvent.click(await screen.findByLabelText('add Pork Chops to cart'))
		await userEvent.click(await screen.findByLabelText('remove Pork Chops from cart'))
		expect(screen.getByText('Your Cart is Empty')).toBeInTheDocument();
	})
})
