import { createContext } from 'react';

import type { CartItem } from '../cart';

export interface CartContextValue {
	items: CartItem[];
	loggedIn: boolean;
	addToCart: (item: CartItem) => Promise<void>;
	removeFromCart: (id: string) => Promise<void>;
	syncCart: () => Promise<void>;
	checkout: () => Promise<void>;
}

export const CartContext = createContext<CartContextValue>({
	items: [],
	loggedIn: false,
	/* v8 ignore next */
	addToCart: async () => {},
	/* v8 ignore next */
	removeFromCart: async () => {},
	/* v8 ignore next */
	syncCart: async () => {},
	/* v8 ignore next */
	checkout: async () => {},
});
