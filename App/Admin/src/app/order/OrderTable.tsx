'use client';

import { useState, useEffect } from 'react';
import {
	Typography,
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

	if (orders.length === 0) {
		return <Typography color="text.secondary">No orders</Typography>;
	}

	return (
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
					{orders.map((order) => (
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
	);
}
