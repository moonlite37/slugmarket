import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import { getListing } from './model';
import ListingCard from './card';
import { useContext, useEffect, useState } from 'react';
import { Listing } from './model';
import { FilterContext } from '../context/FilterContext';

export default function ListingList() {
	const {minPrice, maxPrice, sort, search, category} = useContext(FilterContext);
	const [listings, setListings] = useState<Listing[]>([]);
	useEffect(() => {
		async function load() {
			const data = await getListing(minPrice, maxPrice, sort, search, category);
			setListings(data);
		}
		load();
	}, [minPrice, maxPrice, sort, search, category]);
	return (
		<Box sx={{ height: '100vh', overflowY: 'auto', p: 2 }}>
			<Grid container spacing={2}>
				{listings.map((l) => (
					<Grid key={l.id}>
						<ListingCard listing={l} />
					</Grid>
				))}
			</Grid>
		</Box>
	);
}
