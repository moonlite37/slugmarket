import ListingList from '@/listing/list';
import FilterSidebar from '@/filter/sidebar';
import FilterListIcon from '@mui/icons-material/FilterList';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HistoryIcon from '@mui/icons-material/History';
import { AppBar, Badge, Drawer, Grid, IconButton, Toolbar, Typography } from '@mui/material';
import { FilterContextProvider } from '@/context/FilterContextProvider';
import { useContext, useState } from 'react';
import SignupBanner from '@/components/SignupBanner';
import { Link } from 'react-router-dom';
import { CartContext } from '@/context/cartContext';

function ShopPage() {
	const [filtersOpen, setFiltersOpen] = useState(false);
	const { items } = useContext(CartContext);
	const cartCount = items.reduce((total, item) => total + item.quantity, 0);

	return (
		<FilterContextProvider>
			<Grid>
				<SignupBanner />
				<AppBar position="static" sx={{ mb: 2 }}>
					<Toolbar sx={{ position: 'relative' }}>
					<IconButton
						aria-label="open filters"
						onClick={() => setFiltersOpen(true)}
						color="inherit"
					>
						<FilterListIcon />
					</IconButton>
					<Typography
						variant="h4"
						component="h1"
						sx={{
							position: 'absolute',
							left: '50%',
							transform: 'translateX(-50%)',
						}}
					>
						Slug Market
					</Typography>
					<IconButton
						aria-label="order history"
						component={Link}
						to="/orders"
						color="inherit"
						sx={{ ml: 'auto' }}
					>
						<HistoryIcon />
					</IconButton>
					<IconButton
						aria-label="view cart"
						component={Link}
						to="/cart"
						color="inherit"
					>
						<Badge badgeContent={cartCount} color="error">
							<ShoppingCartIcon />
						</Badge>
					</IconButton>
					</Toolbar>
				</AppBar>
				<Drawer
					open={filtersOpen}
					onClose={() => setFiltersOpen(false)}
					slotProps={{ paper: { sx: { width: 300 } } }}
				>
					<FilterSidebar />
				</Drawer>
				<Grid sx={{ px: 3 }}>
					<ListingList />
				</Grid>
			</Grid>
		</FilterContextProvider>
	);
}
export default ShopPage;
