import { Box, Button, Card, CardContent, Chip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Order, OrderItem } from './model';

interface OrderCardProps {
        order: Order;
        onUpdateStatus: (id: string, status: string) => void;
}

function chipColor(status: string) {
        if (status === 'pending') return 'warning';
        if (status === 'fulfilled') return 'success';
        return 'error';
}

function OrderItemText({ item }: { item: OrderItem }) {
        return (
                <Typography>
                        {item.title} × {item.quantity} — ${(item.price * item.quantity).toFixed(2)}
                </Typography>
        );
}

export default function OrderCard({ order, onUpdateStatus }: OrderCardProps) {
        const { t } = useTranslation();

        return (
                <Card variant="outlined">
                        <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                                {order.created}
                                        </Typography>
                                        <Chip label={order.status} size="small" color={chipColor(order.status)} />
                                </Box>
                                {order.shopperName && (
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                Shopper: {order.shopperName} {order.shopperEmail && `(${order.shopperEmail})`}
                                        </Typography>
                                )}
                                {order.items.map((item) => (
                                        <OrderItemText key={item.listingId} item={item} />
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
                                                        onClick={() => {
                                                                onUpdateStatus(order.id, 'fulfilled');
                                                        }}
                                                >
                                                        {t('Fulfill')}
                                                </Button>
                                                <Button
                                                        variant="outlined"
                                                        color="error"
                                                        size="small"
                                                        onClick={() => {
                                                                onUpdateStatus(order.id, 'cancelled');
                                                        }}
                                                >
                                                        {t('Cancel')}
                                                </Button>
                                        </Box>
                                )}
                        </CardContent>
                </Card>
        );
}
