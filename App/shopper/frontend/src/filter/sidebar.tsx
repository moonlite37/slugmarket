import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { FilterContext } from '@/context/FilterContext';

export default function FilterSidebar() {
	const { t } = useTranslation();
	const { minPrice, setMinPrice, maxPrice, setMaxPrice, search, setSearch, sort, setSort } =
		useContext(FilterContext);

	const validate = (newMin?: number, newMax?: number) => {
		if (newMin !== undefined && newMax !== undefined && newMin > newMax) {
			setMinPrice(newMax);
			setMaxPrice(newMin);
		}
	};

	return (
		<Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
			<Typography variant="h6" gutterBottom>
				{t('Filters')}
			</Typography>

			<Divider sx={{ mb: 3 }} />

			<TextField
				label={t('Search')}
				placeholder={t('Search listings...')}
				size="small"
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				sx={{ mb: 3 }}
				fullWidth
			/>

			<FormControl size="small" fullWidth sx={{ mb: 3 }}>
				<InputLabel>{t('Sort by')}</InputLabel>
				<Select
					value={sort}
					label={t('Sort by')}
					onChange={(e) => setSort(e.target.value)}
				>
					<MenuItem value="">{t('Newest first')}</MenuItem>
					<MenuItem value="price_asc">{t('Price: Low to High')}</MenuItem>
					<MenuItem value="price_desc">{t('Price: High to Low')}</MenuItem>
					<MenuItem value="date_asc">{t('Oldest first')}</MenuItem>
				</Select>
			</FormControl>

			<Divider sx={{ mb: 3 }} />

			<Typography variant="subtitle2" color="text.secondary" gutterBottom>
				{t('Price')}
			</Typography>

			<Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', mt: 1 }}>
				<TextField
					placeholder={t('Min')}
					type="number"
					size="small"
					value={minPrice ?? ''}
					onChange={(e) => {
						const value = e.target.value === '' ? undefined : Number(e.target.value);
						setMinPrice(value);
					}}
					onBlur={() => validate(minPrice, maxPrice)}
				/>
				<Typography sx={{ mt: 1.2, color: 'text.disabled' }}>—</Typography>
				<TextField
					placeholder={t('Max')}
					type="number"
					size="small"
					value={maxPrice ?? ''}
					onChange={(e) => {
						const value = e.target.value === '' ? undefined : Number(e.target.value);
						setMaxPrice(value);
					}}
					onBlur={() => validate(minPrice, maxPrice)}
				/>
			</Box>
		</Box>
	);
}
