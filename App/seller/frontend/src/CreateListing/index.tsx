import { useState, useEffect } from 'react';
import { Box, Typography, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ListingFormFields from '../utils/ListingFormFields';
import { ListingFormContext } from './context';

interface Category {
	id: string;
	name: string;
}

export default function CreateListing() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState('');
	const [stock, setStock] = useState('');
	const [submitted, setSubmitted] = useState(false);
	const [categories, setCategories] = useState<Category[]>([]);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

	useEffect(() => {
		fetch('/seller/api/v0/category', { credentials: 'include' })
			.then((res) => res.json())
			.then(setCategories)
			.catch(() => {});
	}, []);

	const toggleCategory = (id: string) => {
		setSelectedCategories((prev) =>
			prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
		);
	};

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
				categories: selectedCategories,
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
			{categories.length > 0 && (
				<FormGroup sx={{ mt: 2 }}>
					<Typography variant="subtitle2" sx={{ mb: 1 }}>{t('Categories')}</Typography>
					{categories.map((cat) => (
						<FormControlLabel
							key={cat.id}
							control={
								<Checkbox
									checked={selectedCategories.includes(cat.id)}
									onChange={() => toggleCategory(cat.id)}
								/>
							}
							label={cat.name}
						/>
					))}
				</FormGroup>
			)}
		</Box>
	);
}
