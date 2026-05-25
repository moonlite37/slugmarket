import { createContext } from 'react';

import type { CartItem } from '../cart';

export interface CartContextValue {
	items: CartItem[];
	addToCart: (item: CartItem) => Promise<void>;
	removeFromCart: (id: string) => Promise<void>;
}

export const CartContext = createContext<CartContextValue>({
	items: [],
	/* v8 ignore next */
	addToCart: async () => {},
	/* v8 ignore next */
	removeFromCart: async () => {},
});
