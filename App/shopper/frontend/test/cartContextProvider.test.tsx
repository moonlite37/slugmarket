import {describe, it, expect, beforeEach, afterEach} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {http, HttpResponse} from 'msw';
import {MemoryRouter} from 'react-router-dom';
import {StrictMode, useContext} from 'react';

import {CartContext} from '../src/context/cartContext';
import {CartContextProvider} from '../src/context/CartContextProvider';
import Cart from '../src/cart/list';
import CartPage from '../src/pages/Cart';
import ListingList from '../src/listing/list';
import {server, cartItem} from '../vitest.setup';
import type {CartItem} from '../src/cart';

const mockLoggedIn = (cartItems: CartItem[] = []) => {
	server.use(
		http.get('/shopper/api/v0/protected', () => new HttpResponse(null, {status: 200})),
		http.get('/shopper/api/v0/cart', () => HttpResponse.json(cartItems)),
	);
};

const renderCart = () => render(
	<MemoryRouter>
		<CartContextProvider>
			<ListingList />
			<Cart />
		</CartContextProvider>
	</MemoryRouter>,
);

const renderCartOnly = () => render(
	<MemoryRouter>
		<CartContextProvider>
			<Cart />
		</CartContextProvider>
	</MemoryRouter>,
);

const renderCartPage = () => render(
	<MemoryRouter>
		<CartContextProvider>
			<CartPage />
		</CartContextProvider>
	</MemoryRouter>,
);

// Triggers syncCart on demand, so tests can run it after the provider has
// finished loading (avoiding a race with the initial cart fetch).
const SyncTrigger = () => {
	const {syncCart} = useContext(CartContext);
	return <button onClick={() => { void syncCart(); }}>run sync</button>;
};

const renderCartWithSync = () => render(
	<MemoryRouter>
		<CartContextProvider>
			<Cart />
			<SyncTrigger />
		</CartContextProvider>
	</MemoryRouter>,
);

beforeEach(() => {
	localStorage.clear();
	sessionStorage.clear();
});

describe('guest cart', () => {
	it('starts with an empty cart', async () => {
		renderCartOnly();
		await waitFor(() => screen.getByText('Your Cart is Empty'));
	});

	it('adds an item to the cart', async () => {
		renderCart();
		await userEvent.click(await screen.findByLabelText('add Pork Chops to cart'));
		expect(screen.getByLabelText('Pork Chops in cart')).toBeInTheDocument();
	});

	it('increments quantity when same item is added twice', async () => {
		renderCart();
		await userEvent.click(await screen.findByLabelText('add Pork Chops to cart'));
		await userEvent.click(screen.getByLabelText('add Iphone 7 to cart'));
		await userEvent.click(screen.getByLabelText('add Pork Chops to cart'));
		expect(screen.getByText('$839.97')).toBeInTheDocument();
	});

	it('removes an item from the cart', async () => {
		renderCart();
		await userEvent.click(await screen.findByLabelText('add Pork Chops to cart'));
		await userEvent.click(screen.getByLabelText('remove Pork Chops from cart'));
		expect(screen.getByText('Your Cart is Empty')).toBeInTheDocument();
	});
});

describe('guest cart merge on login', () => {
	it('merges localStorage guest cart into DB on login', async () => {
		localStorage.setItem('cart', JSON.stringify([cartItem]));
		mockLoggedIn([{...cartItem, quantity: 2}]);
		renderCartOnly();
		await waitFor(() => expect(screen.getByLabelText('Blue Hoodie in cart')).toBeInTheDocument());
		expect(localStorage.getItem('cart')).toBeNull();
	});

	it('merges the guest cart only once under StrictMode (no double POST)', async () => {
		localStorage.setItem('cart', JSON.stringify([cartItem]));
		let postCount = 0;
		server.use(
			http.get('/shopper/api/v0/protected', () => new HttpResponse(null, {status: 200})),
			http.get('/shopper/api/v0/cart', () => HttpResponse.json([])),
			http.post('/shopper/api/v0/cart/item', () => {
				postCount += 1;
				return new HttpResponse(null, {status: 201});
			}),
		);
		// StrictMode double-invokes effects in non-production builds, which used
		// to merge the guest cart twice and double the quantity in the DB.
		render(
			<StrictMode>
				<MemoryRouter>
					<CartContextProvider>
						<Cart />
					</CartContextProvider>
				</MemoryRouter>
			</StrictMode>,
		);
		await waitFor(() => expect(localStorage.getItem('cart')).toBeNull());
		expect(postCount).toBe(1);
	});
});

describe('logged-in cart', () => {
	it('loads cart from backend on mount', async () => {
		mockLoggedIn([cartItem]);
		renderCartOnly();
		await waitFor(() => expect(screen.getByLabelText('Blue Hoodie in cart')).toBeInTheDocument());
	});

	it('adds an item to the cart', async () => {
		mockLoggedIn();
		renderCart();
		await userEvent.click(await screen.findByLabelText('add Pork Chops to cart'));
		expect(screen.getByLabelText('Pork Chops in cart')).toBeInTheDocument();
	});

	it('increments quantity when same item is added twice', async () => {
		mockLoggedIn();
		renderCart();
		await userEvent.click(await screen.findByLabelText('add Pork Chops to cart'));
		await userEvent.click(screen.getByLabelText('add Iphone 7 to cart'));
		await userEvent.click(screen.getByLabelText('add Pork Chops to cart'));
		expect(screen.getByText('$839.97')).toBeInTheDocument();
	});

	it('removes an item from the cart', async () => {
		mockLoggedIn([cartItem]);
		renderCartOnly();
		await waitFor(() => screen.getByLabelText('Blue Hoodie in cart'));
		await userEvent.click(screen.getByLabelText('remove Blue Hoodie from cart'));
		expect(screen.getByText('Your Cart is Empty')).toBeInTheDocument();
	});
});

describe('syncCart (logged in)', () => {
	beforeEach(() => {
		server.use(
			http.get('/shopper/api/v0/protected', () => new HttpResponse(null, {status: 200})),
			http.get('/shopper/api/v0/cart', () => HttpResponse.json([{...cartItem, price: 29.99}])),
			http.post('/shopper/api/v0/cart/sync', () => HttpResponse.json([{...cartItem, price: 19.99}])),
		);
	});

	it('updates price when sync runs', async () => {
		renderCartWithSync();
		await screen.findByLabelText('Blue Hoodie in cart');
		await userEvent.click(screen.getByText('run sync'));
		expect((await screen.findAllByText('$19.99')).length).toBeGreaterThan(0);
	});

	it('removes out-of-stock items when sync runs', async () => {
		server.use(
			http.post('/shopper/api/v0/cart/sync', () => HttpResponse.json([])),
		);
		renderCartWithSync();
		await screen.findByLabelText('Blue Hoodie in cart');
		await userEvent.click(screen.getByText('run sync'));
		expect(await screen.findByText('Your Cart is Empty')).toBeInTheDocument();
	});

	it('caps quantity to available stock when sync runs', async () => {
		server.use(
			http.get('/shopper/api/v0/cart', () => HttpResponse.json([{...cartItem, quantity: 5}])),
			http.post('/shopper/api/v0/cart/sync', () => HttpResponse.json([{...cartItem, quantity: 3}])),
		);
		renderCartWithSync();
		await screen.findByLabelText('Blue Hoodie in cart');
		await userEvent.click(screen.getByText('run sync'));
		expect(await screen.findByText('Qty: 3')).toBeInTheDocument();
	});
});

describe('checkout (logged in)', () => {
	beforeEach(() => {
		server.use(
			http.get('/shopper/api/v0/protected', () => new HttpResponse(null, {status: 200})),
			http.get('/shopper/api/v0/cart', () => HttpResponse.json([cartItem])),
		);
	});

	it('shows the redirect screen and checks out', async () => {
		let checkoutCalled = false;
		server.use(
			http.post('/shopper/api/v0/cart/sync', () => HttpResponse.json([cartItem])),
			http.post('/shopper/api/v0/cart/checkout', () => {
				checkoutCalled = true;
				return HttpResponse.json({url: 'https://checkout.stripe.com/test'});
			}),
		);
		renderCartOnly();
		await screen.findByLabelText('Blue Hoodie in cart');
		await userEvent.click(screen.getByText('Proceed to Checkout'));
		expect(screen.getByText('Redirecting to checkout…')).toBeInTheDocument();
		await waitFor(() => expect(checkoutCalled).toBe(true));
	});

	it('reveals the cart instead of redirecting when sync empties it', async () => {
		let checkoutCalled = false;
		server.use(
			http.post('/shopper/api/v0/cart/sync', () => HttpResponse.json([])),
			http.post('/shopper/api/v0/cart/checkout', () => {
				checkoutCalled = true;
				return HttpResponse.json({url: ''});
			}),
		);
		renderCartOnly();
		await screen.findByLabelText('Blue Hoodie in cart');
		await userEvent.click(screen.getByText('Proceed to Checkout'));
		expect(await screen.findByText('Your Cart is Empty')).toBeInTheDocument();
		expect(checkoutCalled).toBe(false);
	});
});

describe('syncCart (guest)', () => {
	beforeEach(() => {
		localStorage.setItem('cart', JSON.stringify([{...cartItem, price: 29.99}]));
		server.use(
			http.get('/shopper/api/v0/listing/:id', () =>
				HttpResponse.json({id: cartItem.listing_id, price: 19.99, stock: 42}),
			),
		);
	});

	afterEach(() => localStorage.removeItem('cart'));

	it('updates price from listing API on mount', async () => {
		renderCartPage();
		expect((await screen.findAllByText('$19.99')).length).toBeGreaterThan(0);
	});

	it('removes out-of-stock items on mount', async () => {
		server.use(
			http.get('/shopper/api/v0/listing/:id', () =>
				HttpResponse.json({id: cartItem.listing_id, price: 19.99, stock: 0}),
			),
		);
		renderCartPage();
		expect(await screen.findByText('Your Cart is Empty')).toBeInTheDocument();
	});
});

describe('resume checkout after login', () => {
	it('redirects to Stripe when the checkout intent flag is set', async () => {
		sessionStorage.setItem('checkoutOnLogin', 'true');
		let checkoutCalled = false;
		server.use(
			http.get('/shopper/api/v0/protected', () => new HttpResponse(null, {status: 200})),
			http.get('/shopper/api/v0/cart', () => HttpResponse.json([cartItem])),
			http.post('/shopper/api/v0/cart/sync', () => HttpResponse.json([cartItem])),
			http.post('/shopper/api/v0/cart/checkout', () => {
				checkoutCalled = true;
				return HttpResponse.json({url: 'https://checkout.stripe.com/test'});
			}),
		);
		renderCartOnly();
		// Shows the redirect screen immediately instead of flashing the app.
		expect(screen.getByText('Redirecting to checkout…')).toBeInTheDocument();
		await waitFor(() => expect(checkoutCalled).toBe(true));
		expect(sessionStorage.getItem('checkoutOnLogin')).toBeNull();
	});

	it('does not redirect when the synced cart is empty', async () => {
		sessionStorage.setItem('checkoutOnLogin', 'true');
		let checkoutCalled = false;
		server.use(
			http.get('/shopper/api/v0/protected', () => new HttpResponse(null, {status: 200})),
			http.get('/shopper/api/v0/cart', () => HttpResponse.json([])),
			http.post('/shopper/api/v0/cart/sync', () => HttpResponse.json([])),
			http.post('/shopper/api/v0/cart/checkout', () => {
				checkoutCalled = true;
				return HttpResponse.json({url: ''});
			}),
		);
		renderCartOnly();
		await waitFor(() => screen.getByText('Your Cart is Empty'));
		expect(checkoutCalled).toBe(false);
		expect(sessionStorage.getItem('checkoutOnLogin')).toBeNull();
	});

	it('clears a stale intent flag when the user is not logged in', async () => {
		sessionStorage.setItem('checkoutOnLogin', 'true');
		renderCartOnly();
		await waitFor(() => expect(sessionStorage.getItem('checkoutOnLogin')).toBeNull());
	});
});
