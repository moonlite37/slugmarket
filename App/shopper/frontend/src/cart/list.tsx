import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Divider, List, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import CartItem from './card';
import { CHECKOUT_ON_LOGIN_KEY } from './checkout';
import { CartContext } from '../context/cartContext';

const Cart = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { items, loggedIn, removeFromCart, checkout } = useContext(CartContext);

	const handleCheckout = async () => {
		if (!loggedIn) {
			// Remember the intent so checkout resumes after the OAuth round-trip.
			sessionStorage.setItem(CHECKOUT_ON_LOGIN_KEY, 'true');
			navigate('/login');
			return;
		}
		await checkout();
	};

	const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

	return (
		<Box
			sx={{
				maxWidth: 720,
				mx: 'auto',
				border: '1px solid',
				borderColor: 'grey.200',
				borderRadius: 2,
				bgcolor: 'background.paper',
				overflow: 'hidden',
			}}
		>
			<Box sx={{ px: 3, py: 2 }}>
				<Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
					{t('Shopping Cart')}
				</Typography>
				<Typography color="text.secondary" sx={{ mt: 0.5 }}>
					{items.length} {items.length === 1 ? t('item') : t('items')}
				</Typography>
			</Box>
			<Divider />
			{items.length === 0 ? (
				<Box sx={{ px: 3, py: 6, textAlign: 'center' }}>
					<Typography color="text.secondary">{t('Your Cart is Empty')}</Typography>
				</Box>
			) : (
				<>
					<List disablePadding>
						{items.map((item) => (
							<CartItem key={item.listing_id} listing_id={item.listing_id} name={item.name} price={item.price} quantity={item.quantity} seller={item.seller} onRemove={removeFromCart} />
						))}
					</List>
					<Divider />
					<Box
						sx={{
							px: 3,
							py: 2,
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						<Typography sx={{ fontWeight: 700 }}>{t('Total')}</Typography>
						<Typography sx={{ fontWeight: 700 }}>
							${total.toFixed(2)}
						</Typography>
					</Box>
					<Box sx={{ px: 3, pb: 2 }}>
						<Button variant="contained" fullWidth onClick={handleCheckout}>
							{t('Proceed to Checkout')}
						</Button>
					</Box>
				</>
			)}
		</Box>
	);
};

export default Cart;
