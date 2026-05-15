import ListingList from '@/listing/list';
import FilterSidebar from '@/filter/sidebar';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Drawer, Grid, IconButton } from '@mui/material';
import { FilterContextProvider } from '@/context/FilterContextProvider';
import { useState } from 'react';

function ShopPage() {
	const [filtersOpen, setFiltersOpen] = useState(false);

	return (
		<FilterContextProvider>
			<Grid>
				<IconButton
					aria-label="open filters"
					onClick={() => setFiltersOpen(true)}
				>
					<FilterListIcon />
				</IconButton>
				<Drawer
					open={filtersOpen}
					onClose={() => setFiltersOpen(false)}
					slotProps={{ paper: { sx: { width: 300 } } }}
				>
					<FilterSidebar />
				</Drawer>
				<ListingList />
			</Grid>
		</FilterContextProvider>
	);
}
export default ShopPage;
