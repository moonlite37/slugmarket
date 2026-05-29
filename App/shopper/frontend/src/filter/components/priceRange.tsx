import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { FilterContext } from '@/context/FilterContext';



export default function PriceRange(){
    const { t } = useTranslation();
	const { minPrice, setMinPrice, maxPrice, setMaxPrice} =
		useContext(FilterContext);

    const validate = (newMin?: number, newMax?: number) => {
		if (newMin !== undefined && newMax !== undefined && newMin > newMax) {
			setMinPrice(newMax);
			setMaxPrice(newMin);
		}
	};
    return (
        <>
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
        </>
    )
}