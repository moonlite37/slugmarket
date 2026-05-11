import { useState, useEffect } from 'react';
import { Box, Typography, Stack, Card, CardContent, Button } from '@mui/material';
import { Link } from 'react-router-dom';

interface Listing {
	id: string;
	title: string;
	description: string;
	price: number;
	stock: number;
	created: string;
}

export default function Dashboard() {
	const [listings, setListings] = useState<Listing[]>([]);

	useEffect(() => {
		const fetchListings = async () => {
			const res = await fetch('http://localhost:3013/api/v0/listing', {
				credentials: 'include',
			});
			if (res.ok) {
				setListings(await res.json());
			}
		};
		void fetchListings();
	}, []);

	return (
		<Box sx={{ p: 3 }}>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
				<Typography variant="h5">My Listings</Typography>
				<Button component={Link} to="/listing/new" variant="contained">
					Create New Listing
				</Button>
			</Box>
			{listings.length === 0 ? (
				<Typography color="text.secondary">No listings yet</Typography>
			) : (
				<Stack spacing={2}>
					{listings.map((listing) => (
						<Card key={listing.id} variant="outlined">
							<CardContent>
								<Typography variant="h6">{listing.title}</Typography>
								<Typography color="text.secondary">{listing.description}</Typography>
								<Typography>${listing.price} · {listing.stock} in stock</Typography>
							</CardContent>
						</Card>
					))}
				</Stack>
			)}
		</Box>
	);
}