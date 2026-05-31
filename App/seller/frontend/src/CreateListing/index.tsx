import { useState } from 'react';
import { Box, TextField, Button, Typography, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { createListing } from './model';

export default function CreateListing() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState('');
	const [stock, setStock] = useState('');
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = async () => {
		const res = await createListing({
			title,
			description,
			price: Number(price),
			stock: Number(stock),
			categories: [],
		});
		if (res.status === 201) {
			setSubmitted(true);
			navigate('/');
		}
	};

	return (
		<Box sx={{ p: 3, maxWidth: 500 }}>
			<Typography variant="h5" sx={{ mb: 2 }}>
				{t('Create Listing')}
			</Typography>
			{submitted && (
				<Typography color="success.main" sx={{ mb: 2 }}>
					{t('Listing created')}
				</Typography>
			)}
			<Stack spacing={2}>
				<TextField
					placeholder={t('Title')}
					value={title}
					onChange={(e) => {
						setTitle(e.target.value);
					}}
				/>
				<TextField
					placeholder={t('Description')}
					value={description}
					onChange={(e) => {
						setDescription(e.target.value);
					}}
				/>
				<TextField
					placeholder={t('Price')}
					type="number"
					value={price}
					onChange={(e) => {
						setPrice(e.target.value);
					}}
				/>
				<TextField
					placeholder={t('Stock')}
					type="number"
					value={stock}
					onChange={(e) => {
						setStock(e.target.value);
					}}
				/>
				<Button
					variant="contained"
					onClick={handleSubmit}
					disabled={!title || !description || !price || !stock}
				>
					{t('Create Listing')}
				</Button>
			</Stack>
		</Box>
	);
}
