import ListingList from '@/listing/list';
import FilterSidebar from '@/filter/sidebar';
import { Grid } from '@mui/material';
import { FilterContextProvider } from '@/context/FilterContextProvider';

function ShopPage() {
	return (
            <FilterContextProvider>
                <Grid>
                    <FilterSidebar/>
                    <ListingList/>
                </Grid>
            </FilterContextProvider>
	);
}
export default ShopPage;
