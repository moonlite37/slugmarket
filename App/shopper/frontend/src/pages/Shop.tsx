import ListingList from '@/listing/list';
import FilterSidebar from '@/filter/sidebar';
import FilterListIcon from '@mui/icons-material/FilterList';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import { AppBar, Badge, Drawer, Grid, IconButton, TextField, Toolbar, Typography } from '@mui/material';
import { FilterContextProvider } from '@/context/FilterContextProvider';
import { FilterContext } from '@/context/FilterContext';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SignupBanner from '@/components/SignupBanner';
import SettingsModal from '@/components/SettingsModal';
import { Link } from 'react-router-dom';
import { CartContext } from '@/context/cartContext';

function ShopContent() {
	const [filtersOpen, setFiltersOpen] = useState(false);
	const [settingsOpen, setSettingsOpen] = useState(false);
	const { items } = useContext(CartContext);
	const { search, setSearch } = useContext(FilterContext);
	const { t } = useTranslation();
	const cartCount = items.reduce((total, item) => total + item.quantity, 0);

	return (
		<Grid sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
			<SignupBanner />
			<AppBar position="static" sx={{ mb: 2 }}>
				<Toolbar sx={{ gap: 1 }}>
					<IconButton
						aria-label="open filters"
						onClick={() => setFiltersOpen(true)}
						color="inherit"
					>
						<FilterListIcon />
					</IconButton>
					<Typography variant="h6" component="h1" sx={{ whiteSpace: 'nowrap' }}>
						Slug Market
					</Typography>
					<TextField
						placeholder={t('Search listings...')}
						size="small"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						sx={{ mx: 1, flexGrow: 1, bgcolor: 'rgba(255,255,255,0.15)', borderRadius: 1, input: { color: 'white' } }}
					/>
					<IconButton
						aria-label="order history"
						component={Link}
						to="/orders"
						color="inherit"
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
					<IconButton
						aria-label="open settings"
						onClick={() => setSettingsOpen(true)}
						color="inherit"
					>
						<SettingsIcon />
					</IconButton>
				</Toolbar>
			</AppBar>
			<SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
			<Drawer
				open={filtersOpen}
				onClose={() => setFiltersOpen(false)}
				slotProps={{ paper: { sx: { width: 300 } } }}
			>
				<FilterSidebar />
			</Drawer>
			<Grid sx={{ px: 3, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
				<ListingList />
			</Grid>
		</Grid>
	);
}

function ShopPage() {
	return (
		<FilterContextProvider>
			<ShopContent />
		</FilterContextProvider>
	);
}

export default ShopPage;
