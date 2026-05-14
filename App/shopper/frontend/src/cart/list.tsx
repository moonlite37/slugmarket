import { useContext } from 'react';
import { List, Typography } from '@mui/material';

import CartItem from './card';
import { CartContext } from '../context/cartContext';

const Cart = () => {
	const { items } = useContext(CartContext);

	return (
		<>
			<Typography>Shopping Cart</Typography>
			{items.length === 0 ? (
				<Typography>Your Car is Empty</Typography>
			) : (
				<List>
					{items.map((item) => (
						<CartItem key={item.id} id={item.id} name={item.name} price={item.price} />
					))}
				</List>
			)}
		</>
	);
};

export default Cart;
