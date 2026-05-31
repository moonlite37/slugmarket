import { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ListingCard from './card';
import { getListings, type Listing } from './model';

export default function ListingList() {
	const { t } = useTranslation();
	const [listings, setListings] = useState<Listing[]>([]);

	useEffect(() => {
		const loadListings = async () => {
			setListings(await getListings());
		};
		void loadListings();
	}, []);

	if (listings.length === 0) {
		return <Typography color="text.secondary">{t('No listings yet')}</Typography>;
	}

	return (
		<Stack spacing={2}>
			{listings.map((listing) => (
				<ListingCard key={listing.id} listing={listing} />
			))}
		</Stack>
	);
}
