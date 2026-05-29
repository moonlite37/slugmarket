import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { FilterContext } from '@/context/FilterContext';


export default function Sort() {
    const { t } = useTranslation();
	const { sort, setSort } =
		useContext(FilterContext);

    return (
        <FormControl size="small" fullWidth sx={{ mb: 3 }}>
				<InputLabel id="sort-label">{t('Sort by')}</InputLabel>
				<Select
                    labelId="sort-label"
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
    )
}