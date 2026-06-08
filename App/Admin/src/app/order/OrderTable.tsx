'use client';

import { useState, useEffect } from 'react';
import {
	Typography,
	Box,
	TextField,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Button,
} from '@mui/material';
import { getOrders, updateOrderStatus } from './actions';

interface OrderItem {
  listingId: string;
  title: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  shopper: string;
  seller: string;
  shopperName?: string;
  shopperEmail?: string;
  items: OrderItem[];
  total: number;
  status: string;
  created: string;
}

export default function OrderTable() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(0);
	const PAGE_SIZE = 5;

	useEffect(() => {
		const fetchData = async () => {
			setOrders(await getOrders());
		};
		void fetchData();
	}, []);

	const handleStatusUpdate = async (id: string, status: string) => {
		await updateOrderStatus(id, status);
		setOrders(await getOrders());
	};

	const filtered = orders.filter((o) => (o.shopperName || '').toLowerCase().includes(search.toLowerCase()));
	const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
	if (orders.length === 0) {
		return <Typography color="text.secondary">No orders</Typography>;
	}

	return (
		<>
			<TextField placeholder="Search by shopper..." size="small" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} sx={{ mb: 2 }} fullWidth />
			<TableContainer component={Paper} variant="outlined">
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Order ID</TableCell>
							<TableCell>Shopper</TableCell>
							<TableCell>Items</TableCell>
							<TableCell>Total</TableCell>
							<TableCell>Status</TableCell>
							<TableCell>Date</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{paginated.map((order) => (
							<TableRow key={order.id}>
								<TableCell>{order.id.slice(0, 8)}</TableCell>
								<TableCell>{order.shopperName || order.shopper.slice(0, 8)}</TableCell>
								<TableCell>
									{order.items.map((item) => `${item.title} × ${item.quantity}`).join(', ')}
								</TableCell>
								<TableCell>${order.total}</TableCell>
								<TableCell>{order.status}</TableCell>
								<TableCell>{order.created}</TableCell>
								<TableCell>
									{order.status !== 'cancelled' && (
										<Button
											size="small"
											color="error"
											onClick={() => { void handleStatusUpdate(order.id, 'cancelled'); }}
										>
                                                                                Cancel
										</Button>
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			{filtered.length > PAGE_SIZE && (
				<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 2 }}>
					<Button size="small" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</Button>
					<Typography variant="body2">Page {page + 1} of {Math.ceil(filtered.length / PAGE_SIZE)}</Typography>
					<Button size="small" disabled={(page + 1) * PAGE_SIZE >= filtered.length} onClick={() => setPage(page + 1)}>Next</Button>
				</Box>
			)}
		</>
	);
}
