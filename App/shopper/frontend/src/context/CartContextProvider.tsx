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

	const removeFromCart = (id: string) => {
		setItems((currentItems) => currentItems.filter((item) => item.id !== id));
	};

	return (
		<CartContext.Provider value={{ items, addToCart, removeFromCart }}>
			{children}
		</CartContext.Provider>
	);
}
