import { describe, it, expect, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { http, HttpResponse } from 'msw';

import CartItem from '../src/cart/card'
import Cart from '../src/cart/list'
import ListingList from '@/listing/list';

import { CartContext } from '../src/context/cartContext';
import { CartContextProvider } from '../src/context/CartContextProvider';
import { server } from '../vitest.setup';
import { mockListings } from './mocks';

const porkChop = { listing_id: 'pork-chop', name: 'Pork Chop', price: 10.99, quantity: 1, seller: '00000000-0000-0000-0000-000000000001' };
const singleItemContext = { items: [porkChop], loggedIn: false, addToCart: async () => {}, removeFromCart: async () => {}, syncCart: async () => {}, checkout: async () => {} };

function LoginPage() {
	const location = useLocation();
	return (
		<div>
			<span>Login Page</span>
			<span>{location.search}</span>
		</div>
	);
}

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
			<MemoryRouter>
				<CartContextProvider>
					<Cart />
				</CartContextProvider>
			</MemoryRouter>,
		);
		expect(screen.getByText('Shopping Cart')).toBeInTheDocument()
	})
	it('renders a item name', () => {
		render(
			<MemoryRouter>
				<CartContext.Provider value={singleItemContext}>
					<Cart />
				</CartContext.Provider>
			</MemoryRouter>,
		);
		expect(screen.getByText('Pork Chop')).toBeInTheDocument();
	});
	it('renders a item price', () => {
		render(
			<MemoryRouter>
				<CartContext.Provider value={singleItemContext}>
					<Cart />
				</CartContext.Provider>
			</MemoryRouter>,
		);
		expect(screen.getAllByText('$10.99').length).toBeGreaterThan(0);
	});
	it('renders the total for two items', () => {
		render(
			<MemoryRouter>
				<CartContext.Provider value={{ items: [porkChop, { listing_id: 'chicken', name: 'Iphone 7', price: 9.99, quantity: 1, seller: '00000000-0000-0000-0000-000000000002' }], loggedIn: false, addToCart: async () => {}, removeFromCart: async () => {}, syncCart: async () => {}, checkout: async () => {} }}>
					<Cart />
				</CartContext.Provider>
			</MemoryRouter>,
		);
		expect(screen.getByText('$20.98')).toBeInTheDocument();
	});
	it('renders empty list', () => {
		render(
			<MemoryRouter>
				<CartContextProvider>
					<Cart />
				</CartContextProvider>
			</MemoryRouter>,
		);
		expect(screen.getByText('Your Cart is Empty')).toBeInTheDocument();
	})
})

describe('add and remove items', () => {
	it('add item to cart', async () => {
		server.use(mockListings());
		render(
			<MemoryRouter>
				<CartContextProvider>
					<ListingList />
					<Cart />
				</CartContextProvider>
			</MemoryRouter>,
		);
		await userEvent.click(await screen.findByLabelText('add Pork Chops to cart'))
		expect(screen.getByLabelText('Pork Chops in cart')).toBeInTheDocument();
	})
	it('remove items from shopping cart', async () => {
		server.use(mockListings());
		render(
			<MemoryRouter>
				<CartContextProvider>
					<ListingList />
					<Cart />
				</CartContextProvider>
			</MemoryRouter>,
		);
		await userEvent.click(await screen.findByLabelText('add Pork Chops to cart'))
		await userEvent.click(await screen.findByLabelText('remove Pork Chops from cart'))
		expect(screen.getByText('Your Cart is Empty')).toBeInTheDocument();
	})
})

describe('checkout button', () => {
	afterEach(() => {
		sessionStorage.clear();
	});

	it('redirects to login when not logged in', async () => {
		render(
			<MemoryRouter initialEntries={['/cart']}>
				<CartContext.Provider value={singleItemContext}>
					<Routes>
						<Route path="/cart" element={<Cart />} />
						<Route path="/login" element={<LoginPage />} />
					</Routes>
				</CartContext.Provider>
			</MemoryRouter>,
		);
		await userEvent.click(screen.getByText('Proceed to Checkout'));
		expect(screen.getByText(/Login Page/)).toBeInTheDocument();
		expect(screen.getByText('?source=cart')).toBeInTheDocument();
		// Remembers the intent so checkout can resume after login.
		expect(sessionStorage.getItem('checkoutOnLogin')).toBe('true');
	});

	it('calls checkout and receives a Stripe URL when logged in', async () => {
		let checkoutCalled = false;
		server.use(
			http.get('/shopper/api/v0/protected', () => new HttpResponse(null, { status: 200 })),
			http.get('/shopper/api/v0/cart', () => HttpResponse.json([porkChop])),
			http.post('/shopper/api/v0/cart/sync', () => HttpResponse.json([porkChop])),
			http.post('/shopper/api/v0/cart/checkout', () => {
				checkoutCalled = true;
				return HttpResponse.json({ url: 'https://checkout.stripe.com/test' });
			}),
		);
		render(
			<MemoryRouter>
				<CartContextProvider>
					<Cart />
				</CartContextProvider>
			</MemoryRouter>,
		);
		await userEvent.click(await screen.findByText('Proceed to Checkout'));
		expect(checkoutCalled).toBe(true);
	});
})
