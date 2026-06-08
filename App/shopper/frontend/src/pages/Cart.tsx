import { useEffect, useContext } from 'react';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';

import Cart from '@/cart/list';
import { CartContext } from '@/context/cartContext';

const CartPage = () => {
	const { syncCart } = useContext(CartContext);

	useEffect(() => {
		syncCart();
	}, [syncCart]);

	return (
		<Box>
			<AppBar position="static" sx={{ mb: 2 }}>
				<Toolbar sx={{ position: 'relative' }}>
					<Typography
						variant="h4"
						component="h1"
						sx={{
							position: 'absolute',
							left: '50%',
							transform: 'translateX(-50%)',
						}}
					>
						<Box
							aria-label="slug market home"
							component={Link}
							to="/"
							sx={{
								color: 'inherit',
								textDecoration: 'none',
							}}
						>
							Slug Market
						</Box>
					</Typography>
				</Toolbar>
			</AppBar>
			<Box sx={{ px: 3, py: 2 }}>
                                <Button component={Link} to="/" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>Continue Shopping</Button>
				<Cart />
			</Box>
		</Box>
	);
};

export default CartPage;
