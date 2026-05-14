import { Typography } from '@mui/material';

interface CartItemProps {
	name: string;
}

const CartItem = ({ name }: CartItemProps) => {
	return <Typography>{name}</Typography>;
};

export default CartItem;
