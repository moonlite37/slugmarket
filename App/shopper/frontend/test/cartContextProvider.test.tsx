import {describe, it, expect, beforeEach} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {http, HttpResponse} from 'msw';

import {CartContextProvider} from '../src/context/CartContextProvider';
import Cart from '../src/cart/list';
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
	<CartContextProvider>
		<ListingList />
		<Cart />
	</CartContextProvider>,
);

beforeEach(() => localStorage.clear());

describe('guest cart', () => {
	it('starts with an empty cart', async () => {
		render(<CartContextProvider><Cart /></CartContextProvider>);
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
		render(<CartContextProvider><Cart /></CartContextProvider>);
		await waitFor(() => expect(screen.getByLabelText('Blue Hoodie in cart')).toBeInTheDocument());
		expect(localStorage.getItem('cart')).toBeNull();
	});
});

describe('logged-in cart', () => {
	it('loads cart from backend on mount', async () => {
		mockLoggedIn([cartItem]);
		render(<CartContextProvider><Cart /></CartContextProvider>);
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
		render(<CartContextProvider><Cart /></CartContextProvider>);
		await waitFor(() => screen.getByLabelText('Blue Hoodie in cart'));
		await userEvent.click(screen.getByLabelText('remove Blue Hoodie from cart'));
		expect(screen.getByText('Your Cart is Empty')).toBeInTheDocument();
	});
});
