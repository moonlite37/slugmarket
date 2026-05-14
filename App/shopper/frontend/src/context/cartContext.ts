import { createContext } from 'react';

import type { CartItem } from '../cart';

export interface CartContextValue {
	items: CartItem[];
	addToCart: (item: CartItem) => void;
	removeFromCart: (id: string) => void;
}

export const CartContext = createContext<CartContextValue>({
	items: [],
	/* v8 ignore next */
	addToCart: () => {},
	/* v8 ignore next */
	removeFromCart: () => {},
});
