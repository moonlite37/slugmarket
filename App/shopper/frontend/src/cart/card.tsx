import { ListItem, ListItemText } from '@mui/material';
import type { CartItem } from '.'

const CartItem = ({ name, price }: CartItem) => {
	return (
		<ListItem>
			<ListItemText primary={name} secondary={`$${price.toFixed(2)}`} />
		</ListItem>
	);
};

export default CartItem;
