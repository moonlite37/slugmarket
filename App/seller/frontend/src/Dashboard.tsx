import { useState, useEffect } from 'react';
import { Box, Typography, Stack, Card, CardContent, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CreateKey from './CreateKey';

interface Listing {
	id: string;
	title: string;
	description: string;
	price: number;
	stock: number;
	created: string;
}

export default function Dashboard() {
	const { t } = useTranslation();
	const [listings, setListings] = useState<Listing[]>([]);

	useEffect(() => {
		const fetchListings = async () => {
			const res = await fetch('/seller/api/v0/listing', {
				credentials: 'include',
			});
			if (res.ok) {
				setListings(await res.json());
			}
		};
		void fetchListings();
	}, []);

	return (
		<>
		<Box sx={{ p: 3 }}>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
				<Typography variant="h5">{t('My Listings')}</Typography>
				<Button component={Link} to="/listing/new" variant="contained">
					{t('Create New Listing')}
				</Button>
			</Box>
			{listings.length === 0 ? (
				<Typography color="text.secondary">{t('No listings yet')}</Typography>
			) : (
				<Stack spacing={2}>
					{listings.map((listing) => (
						<Card key={listing.id} variant="outlined">
							<CardContent>
								<Typography variant="h6">{t('Listing Title', { listingTitle: listing.title })}</Typography>
								<Typography color="text.secondary">{listing.description}</Typography>
								<Typography>${listing.price} · {t('{{stock}} in stock', { stock: listing.stock })}</Typography>
							</CardContent>
						</Card>
					))}
				</Stack>
			)}
		</Box>
		<CreateKey/>
		</>
	);
}