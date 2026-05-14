import { type ReactNode, useState } from 'react';

import { CartContext } from './cartContext';
import type { CartItem } from '../cart';

interface CartContextProviderProps {
	children: ReactNode;
}

export function CartContextProvider({ children }: CartContextProviderProps) {
	const [items, setItems] = useState<CartItem[]>([]);

	const addToCart = (item: CartItem) => {
		setItems((currentItems) => [...currentItems, item]);
	};

	return (
		<CartContext.Provider value={{ items, addToCart }}>
			{children}
		</CartContext.Provider>
	);
}
