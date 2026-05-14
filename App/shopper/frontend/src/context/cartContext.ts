import { createContext } from 'react';

import type { CartItem } from '../cart';

export interface CartContextValue {
	items: CartItem[];
}

export const CartContext = createContext<CartContextValue>({ items: [] });
