import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import ListingTable from './listing/ListingTable';
import OrderTable from './order/OrderTable';
import CategoryTable from './category/CategoryTable';

export const dynamic = 'force-dynamic';

export default async function Page() {
	const cookieStore = await cookies();
	const session = cookieStore.get('session');
	if (!session) {
		redirect('/login');
	}
	return (
		<Box sx={{ p: 3}}>
			<Typography variant="h4" sx={{ mb: 3 }}>Admin Dashboard</Typography>
			<ListingTable />
			<Box sx={{ height: 32 }} /> 
			<OrderTable />
			<Box sx={{ height: 32 }} /> 
			<CategoryTable />
		</Box>
	);
}
