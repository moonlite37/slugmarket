import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CreateKey from './CreateKey';
import ListingList from './listing/list';
import OrderList from './order/list';

export default function Dashboard() {
	const { t } = useTranslation();

	return (
		<>
			<Box sx={{ p: 3 }}>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
					<Typography variant="h5">{t('My Listings')}</Typography>
					<Button component={Link} to="/listing/new" variant="contained">
						{t('Create New Listing')}
					</Button>
				</Box>
				<ListingList />
			</Box>
			<OrderList />
			<Box sx={{ p: 3 }}>
				<CreateKey />
			</Box>
			
			
		</>
	);
}
