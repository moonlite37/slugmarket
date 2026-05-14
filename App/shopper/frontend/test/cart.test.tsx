import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react';

import CartItem from '../src/cart/card'
import Cart from '../src/cart/list'

import { CartContext } from '../src/context/cartContext';

describe('cart item', () => {
	it('renders item', () => {
		render(<CartItem id={'pork-chop'} name={'Pork Chop'} price={10.99} />)
		expect(screen.getByText('Pork Chop')).toBeInTheDocument()
	})
	it('renders price', () => {
		render(<CartItem id={'pork-chop'} name={'Pork Chop'} price={10.99} />)
		expect(screen.getByText('$10.99')).toBeInTheDocument()
	})
})

describe('cart list', () => {
	it('renders', () => {
		render(<Cart />)
		expect(screen.getByText('Shopping Cart')).toBeInTheDocument()
	})
	it('renders a item name', () => {
		render(
			<CartContext.Provider value={{ items: [{ id: 'pork-chop', name: 'Pork Chop', price: 10.99 }] }}>
				<Cart />
			</CartContext.Provider>,
		);

		expect(screen.getByText('Pork Chop')).toBeInTheDocument();
	});
	it('renders a item price', () => {
		render(
			<CartContext.Provider value={{ items: [{ id: 'pork-chop', name: 'Pork Chop', price: 10.99 }] }}>
				<Cart />
			</CartContext.Provider>,
		);

		expect(screen.getByText('$10.99')).toBeInTheDocument();
	});
})
