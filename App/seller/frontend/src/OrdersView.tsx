import { useState, useEffect } from 'react';
import { Box, Typography, Stack, Card, CardContent, Chip, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface OrderItem {
	listingId: string;
	title: string;
	price: number;
	quantity: number;
}

interface Order {
	id: string;
	items: OrderItem[];
	total: number;
	status: string;
	created: string;
}

export default function OrdersView() {
	const { t } = useTranslation();
	const [orders, setOrders] = useState<Order[]>([]);

	useEffect(() => {
		const fetchOrders = async () => {
			const res = await fetch('/seller/api/v0/order', {
				credentials: 'include',
			});
			if (res.ok) {
				setOrders(await res.json());
			}
		};
		void fetchOrders();
	}, []);

	const updateStatus = async (id: string, status: string) => {
		const res = await fetch(`/seller/api/v0/order/${id}`, {
			method: 'PUT',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ status }),
		});
		if (res.ok) {
			const updated = await res.json();
			setOrders((prev) =>
				prev.map((o) => (o.id === id ? { ...o, status: updated.status } : o)),
			);
		}
	};

	const chipColor = (status: string) => {
		if (status === 'pending') return 'warning';
		if (status === 'fulfilled') return 'success';
		if (status === 'cancelled') return 'error';
		return 'default';
	};

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h5" sx={{ mb: 3 }}>{t('My Orders')}</Typography>
			{orders.length === 0 ? (
				<Typography color="text.secondary">{t('No orders yet')}</Typography>
			) : (
				<Stack spacing={2}>
					{orders.map((order) => (
						<Card key={order.id} variant="outlined">
							<CardContent>
								<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
									<Typography variant="subtitle2" color="text.secondary">
										{order.created}
									</Typography>
									<Chip label={order.status} size="small" color={chipColor(order.status)} />
								</Box>
								{order.items.map((item) => (
									<Typography key={item.listingId}>
										{item.title} × {item.quantity} — ${(item.price * item.quantity).toFixed(2)}
									</Typography>
								))}
								<Typography variant="h6" sx={{ mt: 1 }}>
									${order.total.toFixed(2)}
								</Typography>
								{order.status === 'pending' && (
									<Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
										<Button
											variant="contained"
											color="success"
											size="small"
											onClick={() => updateStatus(order.id, 'fulfilled')}
										>
											{t('Fulfill')}
										</Button>
										<Button
											variant="outlined"
											color="error"
											size="small"
											onClick={() => updateStatus(order.id, 'cancelled')}
										>
											{t('Cancel')}
										</Button>
									</Box>
								)}
							</CardContent>
						</Card>
					))}
				</Stack>
			)}
		</Box>
	);
}
