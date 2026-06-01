import SaveIcon from '@mui/icons-material/Save';
import { Box, IconButton, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getListing } from './model';

export default function UpdateListing() {
	const navigate = useNavigate();
	const { id } = useParams();
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState('');
	const [stock, setStock] = useState('');
	const [categories, setCategories] = useState('');

	useEffect(() => {
		const loadListing = async () => {
			if (!id) return;
			const listing = await getListing(id);
			if (!listing) return;
			setTitle(listing.title);
			setDescription(listing.description);
			setPrice(String(listing.price));
			setStock(String(listing.stock));
			setCategories(listing.categories.join(', '));
		};
		void loadListing();
	}, [id]);

	return (
		<Box sx={{ p: 3, maxWidth: 500 }}>
			<Stack spacing={2}>
				<TextField
					label="Title"
					value={title}
					onChange={(e) => {
						setTitle(e.target.value);
					}}
				/>
				<TextField
					label="Description"
					value={description}
					onChange={(e) => {
						setDescription(e.target.value);
					}}
				/>
				<TextField
					label="Price"
					type="number"
					value={price}
					onChange={(e) => {
						setPrice(e.target.value);
					}}
				/>
				<TextField
					label="Stock"
					type="number"
					value={stock}
					onChange={(e) => {
						setStock(e.target.value);
					}}
				/>
				<TextField
					label="Categories"
					value={categories}
					onChange={(e) => {
						setCategories(e.target.value);
					}}
				/>
				<IconButton
					aria-label="save edits"
					onClick={() => {
						navigate('/');
					}}
				>
					<SaveIcon />
				</IconButton>
			</Stack>
		</Box>
	);
}
