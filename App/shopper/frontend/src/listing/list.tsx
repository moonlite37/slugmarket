import { Grid } from '@mui/material';
import { getListing } from './model';
import ListingCard from './card';
import { useContext, useEffect, useState } from 'react';
import { Listing } from './model';
import { FilterContext } from '../context/FilterContext';

export default function ListingList() {
  const {minPrice, maxPrice} = useContext(FilterContext);
	const [listings, setListings] = useState<Listing[]>([]);
	useEffect(() => {
		async function load() {
			const data = await getListing(minPrice, maxPrice);
			setListings(data);
		}
		load();
	}, [minPrice, maxPrice]);
	return (
		<>
			<Grid>
				{listings.map((l) => (
					<ListingCard key={l.id} listing={l} />
				))}
			</Grid>
		</>
	);
}
