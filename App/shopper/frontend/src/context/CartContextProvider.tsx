import type { ReactNode } from 'react';

import { CartContext } from './cartContext';

interface CartContextProviderProps {
	children: ReactNode;
}

export function CartContextProvider({ children }: CartContextProviderProps) {
	return (
		<CartContext.Provider value={{ items: [] }}>
			{children}
		</CartContext.Provider>
	);
}
