import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import PriceRange from './components/priceRange';
import Search from './components/search';
import Sort from './components/sort';
import Categories from './components/categories';

export default function FilterSidebar() {
	const { t } = useTranslation();
	return (
		<Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
			<Typography variant="h6" gutterBottom>
				{t('Filters')}
			</Typography>

			<Search/>

      <Sort/>

      <PriceRange/>

      <Divider sx={{ mb: 3 }} />

      <Typography variant="h6" gutterBottom>
				{t('Categories')}
			</Typography>

      <Categories/>

		</Box>
	);
}
