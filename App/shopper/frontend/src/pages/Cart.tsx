import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import Cart from '@/cart/list';

const CartPage = () => {
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
				<Cart />
			</Box>
		</Box>
	);
};

export default CartPage;
