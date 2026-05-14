import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react';

import CartItem from '../src/cart/card'

describe('cart item', () => {
	it('renders item', () => {
		render(<CartItem name={'Pork Chop'} />)
		expect(screen.getByText('Pork Chop')).toBeInTheDocument()
	})
})