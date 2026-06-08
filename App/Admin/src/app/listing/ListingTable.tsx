'use client';

import { useState, useEffect } from 'react';
import {
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { getListings, deleteListing } from './actions';
import { Listing } from '../../listing';

export default function ListingTable() {
	const [listings, setListings] = useState<Listing[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			setListings(await getListings());
		};
		void fetchData();
	}, []);

	const handleDelete = async (id: string) => {
		await deleteListing(id);
		setListings(await getListings());
	};

	if (listings.length === 0) {
		return <Typography color="text.secondary">No listings</Typography>;
	}

	return (
		<TableContainer component={Paper} variant="outlined">
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Title</TableCell>
						<TableCell>Seller</TableCell>
						<TableCell>Price</TableCell>
						<TableCell>Stock</TableCell>
						<TableCell>Actions</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{listings.map((listing) => (
						<TableRow key={listing.id}>
							<TableCell>{listing.title}</TableCell>
							<TableCell>{listing.username || listing.author.slice(0, 8)}</TableCell>
							<TableCell>${listing.price}</TableCell>
							<TableCell>{listing.stock}</TableCell>
							<TableCell>
								<IconButton
									aria-label="delete"
									onClick={() => { void handleDelete(listing.id); }}
								>
									<DeleteIcon />
								</IconButton>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}