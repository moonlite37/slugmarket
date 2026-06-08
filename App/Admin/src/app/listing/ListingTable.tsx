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
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import TextField from '@mui/material/TextField';
import { getListings, deleteListing } from './actions';
import { getCategories } from '../category/actions';
import { Listing } from '../../listing';

export default function ListingTable() {
	const [listings, setListings] = useState<Listing[]>([]);
	const [search, setSearch] = useState('');
	const [categoryFilter, setCategoryFilter] = useState('');
	const [categories, setCategories] = useState<{id:string;name:string}[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			setListings(await getListings());
		};
		void fetchData();
		void getCategories().then(setCategories);
	}, []);

	const handleDelete = async (id: string) => {
		await deleteListing(id);
		setListings(await getListings());
	};

	const filtered = listings.filter((l) => l.title.toLowerCase().includes(search.toLowerCase())).filter((l) => !categoryFilter || (l.categories || []).includes(categoryFilter));
	if (listings.length === 0) {
		return <Typography color="text.secondary">No listings</Typography>;
	}

	return (
		<>
			<TextField placeholder="Search listings..." size="small" value={search} onChange={(e) => setSearch(e.target.value)} sx={{ mb: 2 }} fullWidth />
			<FormControl size="small" sx={{ mb: 2, minWidth: 200 }}>
				<InputLabel>Category</InputLabel>
				<Select value={categoryFilter} label="Category" onChange={(e) => setCategoryFilter(e.target.value)}>
					<MenuItem value="">All</MenuItem>
					{categories.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
				</Select>
			</FormControl>
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
						{filtered.map((listing) => (
							<TableRow key={listing.id}>
								<TableCell>{listing.title}</TableCell>
								<TableCell>{listing.username || /* v8 ignore next */ listing.author.slice(0, 8)}</TableCell>
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
		</>
	);
}
