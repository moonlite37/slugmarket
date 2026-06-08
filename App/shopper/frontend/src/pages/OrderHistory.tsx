import { useState, useEffect } from 'react';
import { Box, Typography, Stack, Card, CardContent, Chip, Button } from '@mui/material';
import { Link } from 'react-router-dom';
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


function formatDate(raw: string): string {
	const date = new Date(raw);
	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const yesterday = new Date(today.getTime() - 86400000);
	if (date >= today) {
		const h = date.getHours(); const m = String(date.getMinutes()).padStart(2,'0'); return (h % 12 || 12) + ':' + m + ' ' + (h >= 12 ? 'PM' : 'AM');
	}
	if (date >= yesterday) {
		return 'Yesterday';
	}
	const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']; return months[date.getUTCMonth()] + ' ' + date.getUTCDate() + ', ' + date.getUTCFullYear();
}

export default function OrderHistory() {
	const { t } = useTranslation();
	const [orders, setOrders] = useState<Order[]>([]);

	useEffect(() => {
		const fetchOrders = async () => {
			const res = await fetch('/shopper/api/v0/order', {
				credentials: 'include',
			});
			if (res.ok) {
				setOrders(await res.json());
			}
		};
		void fetchOrders();
	}, []);

	const chipColor = (status: string) => {
		if (status === 'pending') return 'warning';
		if (status === 'fulfilled') return 'success';
		if (status === 'cancelled') return 'error';
		return 'default';
	};

	return (
		<Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
				<Typography variant="h5">{t('Order History')}</Typography>
				<Button component={Link} to="/" variant="outlined" size="small">
					{t('Back to Shop')}
				</Button>
			</Box>
			{orders.length === 0 ? (
				<Typography color="text.secondary">{t('No orders yet')}</Typography>
			) : (
				<Stack spacing={2}>
					{orders.map((order) => (
						<Card key={order.id} variant="outlined">
							<CardContent>
								<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
									<Typography variant="subtitle2" color="text.secondary">
										{formatDate(order.created)}
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
							</CardContent>
						</Card>
					))}
				</Stack>
			)}
		</Box>
	);
}
