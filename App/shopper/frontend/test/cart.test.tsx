import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react';

import CartItem from '../src/cart/card'
import Cart from '../src/cart/list'

describe('cart item', () => {
	it('renders item', () => {
		render(<CartItem name={'Pork Chop'} price={10.99} />)
		expect(screen.getByText('Pork Chop')).toBeInTheDocument()
	})
	it('renders price', () => {
		render(<CartItem name={'Pork Chop'} price={10.99} />)
		expect(screen.getByText('$10.99')).toBeInTheDocument()
	})
})

describe('cart list', () => {
	it('renders', () => {
		render(<Cart />)
		expect(screen.getByText('Shopping Cart')).toBeInTheDocument()
	})
})
