import { useState } from 'react';
import { Box, TextField, Button, Typography, Stack } from '@mui/material';

export default function CreateListing() {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState('');
	const [stock, setStock] = useState('');
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = async () => {
		const res = await fetch('http://localhost:3013/api/v0/listing', {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				title,
				description,
				price: Number(price),
				stock: Number(stock),
				categories: [],
			}),
		});
		if (res.status === 201) {
			setSubmitted(true);
		}
	};

	return (
		<Box sx={{ p: 3, maxWidth: 500 }}>
			<Typography variant="h5" sx={{ mb: 2 }}>Create Listing</Typography>
			{submitted && (
				<Typography color="success.main" sx={{ mb: 2 }}>Listing created</Typography>
			)}
			<Stack spacing={2}>
				<TextField
					placeholder="Title"
					value={title}
					onChange={(e) => { setTitle(e.target.value); }}
				/>
				<TextField
					placeholder="Description"
					value={description}
					onChange={(e) => { setDescription(e.target.value); }}
				/>
				<TextField
					placeholder="Price"
					type="number"
					value={price}
					onChange={(e) => { setPrice(e.target.value); }}
				/>
				<TextField
					placeholder="Stock"
					type="number"
					value={stock}
					onChange={(e) => { setStock(e.target.value); }}
				/>
				<Button
					variant="contained"
					onClick={handleSubmit}
					disabled={!title || !description || !price || !stock}
				>
					Create Listing
				</Button>
			</Stack>
		</Box>
	);
}