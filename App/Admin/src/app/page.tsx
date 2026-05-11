import type { NextPage } from 'next';
import { Box, Typography } from '@mui/material';
import ListingTable from './listing/ListingTable';

const Page: NextPage = () => {
	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h4" sx={{ mb: 3 }}>Admin Dashboard</Typography>
			<ListingTable />
		</Box>
	);
};

export default Page;