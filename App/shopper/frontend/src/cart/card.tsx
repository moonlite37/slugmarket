import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton, ListItem, ListItemText, Typography } from '@mui/material';
import type { CartItem } from '.'

interface CartItemProps extends CartItem {
	onRemove?: (id: string) => void;
}

const CartItem = ({ listing_id, name, price, quantity, onRemove }: CartItemProps) => {
	return (
		<ListItem
			aria-label={`${name} in cart`}
			divider
			sx={{ px: 3, py: 2 }}
		>
			<ListItemText
				primary={name}
				secondary={
					<Box component="span" sx={{ display: 'block', mt: 0.5 }}>
						<Typography component="span" variant="body2" sx={{ display: 'block' }}>${price.toFixed(2)}</Typography>
						<Typography component="span" variant="body2" color="text.secondary">Qty: {quantity}</Typography>
					</Box>
				}
			/>
			{onRemove && (
				<IconButton
					aria-label={`remove ${name} from cart`}
					color="error"
					onClick={() => onRemove(listing_id)}
				>
					<DeleteIcon />
				</IconButton>
			)}
		</ListItem>
	);
};

export default CartItem;
