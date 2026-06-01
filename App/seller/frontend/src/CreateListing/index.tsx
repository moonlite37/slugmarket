import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ListingFormFields from '../utils/ListingFormFields';
import { ListingFormContext } from './context';

export default function CreateListing() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState('');
	const [stock, setStock] = useState('');
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = async () => {
		const res = await fetch('/seller/api/v0/listing', {
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
			navigate('/');
		}
	};

	return (
		<Box sx={{ p: 3, maxWidth: 500 }}>
			<Typography variant="h5" sx={{ mb: 2 }}>{t('Create Listing')}</Typography>
			{submitted && (
				<Typography color="success.main" sx={{ mb: 2 }}>{t('Listing created')}</Typography>
			)}
			<ListingFormContext.Provider value={{
				title, setTitle,
				description, setDescription,
				price, setPrice,
				stock, setStock,
				handleSubmit,
			}}>
				<ListingFormFields />
			</ListingFormContext.Provider>
		</Box>
	);
}
