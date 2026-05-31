import { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import OrderCard from './card';
import { getOrders, updateOrderStatus, type Order } from './model';

export default function OrderList() {
	const { t } = useTranslation();
	const [orders, setOrders] = useState<Order[]>([]);

	useEffect(() => {
		const loadOrders = async () => {
			setOrders(await getOrders());
		};
		void loadOrders();
	}, []);

	const updateStatus = async (id: string, status: string) => {
		const updated = await updateOrderStatus(id, status);
		if (updated) {
			setOrders((prev) =>
				prev.map((order) => (order.id === id ? { ...order, status: updated.status } : order)),
			);
		}
	};

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h5" sx={{ mb: 3 }}>
				{t('My Orders')}
			</Typography>
			{orders.length === 0 ? (
				<Typography color="text.secondary">{t('No orders yet')}</Typography>
			) : (
				<Stack spacing={2}>
					{orders.map((order) => (
						<OrderCard key={order.id} order={order} onUpdateStatus={updateStatus} />
					))}
				</Stack>
			)}
		</Box>
	);
}
