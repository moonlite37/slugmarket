import ListingList from '@/listing/list';
import FilterSidebar from '@/filter/sidebar';
import FilterListIcon from '@mui/icons-material/FilterList';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { AppBar, Drawer, Grid, IconButton, Toolbar, Typography } from '@mui/material';
import { FilterContextProvider } from '@/context/FilterContextProvider';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function ShopPage() {
	const [filtersOpen, setFiltersOpen] = useState(false);

	return (
		<FilterContextProvider>
			<Grid>
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
						aria-label="view cart"
						component={Link}
						to="/cart"
						color="inherit"
						sx={{ ml: 'auto' }}
					>
						<ShoppingCartIcon />
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
