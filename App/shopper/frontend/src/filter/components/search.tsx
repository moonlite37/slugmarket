import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import TextField from '@mui/material/TextField';
import { FilterContext } from '@/context/FilterContext';

export default function Search(){
    const { t } = useTranslation();
    const { search, setSearch } =
        useContext(FilterContext);
    return (
        <TextField
				label={t('Search')}
				placeholder={t('Search listings...')}
				size="small"
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				sx={{ mb: 3 }}
				fullWidth
			/>
    )
}