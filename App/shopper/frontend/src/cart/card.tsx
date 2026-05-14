import { ListItem, ListItemText } from '@mui/material';

interface CartItemProps {
	name: string;
	price: number;
}

const CartItem = ({ name, price }: CartItemProps) => {
	return (
		<ListItem>
			<ListItemText primary={name} secondary={`$${price.toFixed(2)}`} />
		</ListItem>
	);
};

export default CartItem;
