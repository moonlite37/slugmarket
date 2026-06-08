import SaveIcon from '@mui/icons-material/Save';
import { Box, Button, IconButton, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getListing, updateListing } from './model';

export default function UpdateListing() {
	const navigate = useNavigate();
	const { id } = useParams();
	const [title, setTitle] = useState('');
	const [price, setPrice] = useState('');
	const [description, setDescription] = useState('');
	const [stock, setStock] = useState('');
	const [categories, setCategories] = useState('');
	const [images, setImages] = useState<string[]>([]);

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
					setImages(listing.images || []);
		};
		void loadListing();
	}, [id]);

	const saveEdits = async () => {
		if (!id) return;
		const res = await updateListing(id, {
			title,
			description,
			price: Number(price),
			stock: Number(stock),
			images,
					categories: categories
				.split(',')
				.map((category) => category.trim())
				.filter(Boolean),
		});
		if (res.ok) {
			navigate('/');
		}
	};

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
                                {images[0] && (
                                    <Box>
                                        <Box component="img" src={images[0]} alt="Listing image" sx={{ width: "100%", maxHeight: 200, objectFit: "contain", borderRadius: 1 }} />
                                        <Button size="small" color="error" onClick={() => setImages([])} aria-label="remove image">Remove Image</Button>
                                    </Box>
                                )}
				<TextField
					label="Categories"
					value={categories}
					onChange={(e) => {
						setCategories(e.target.value);
					}}
				/>
				<IconButton
					aria-label="save edits"
					onClick={saveEdits}
				>
					<SaveIcon />
				</IconButton>
			</Stack>
		</Box>
	);
}
