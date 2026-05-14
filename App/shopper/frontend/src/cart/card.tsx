import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, ListItem, ListItemText } from '@mui/material';
import type { CartItem } from '.'

interface CartItemProps extends CartItem {
	onRemove?: (id: string) => void;
}

const CartItem = ({ id, name, price, onRemove }: CartItemProps) => {
	return (
		<ListItem aria-label={`${name} in cart`}>
			<ListItemText primary={name} secondary={`$${price.toFixed(2)}`} />
			{onRemove && (
				<IconButton aria-label={`remove ${name} from cart`} onClick={() => onRemove(id)}>
					<DeleteIcon />
				</IconButton>
			)}
		</ListItem>
	);
};

export default CartItem;
