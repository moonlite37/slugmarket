import { describe, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { server } from '../vitest.setup';
import { http, HttpResponse } from 'msw';
import OrderHistory from '@/pages/OrderHistory';

describe('Shopper OrderHistory', () => {
	it('renders Order History heading', () => {
		render(
			<MemoryRouter>
				<OrderHistory />
			</MemoryRouter>,
		);
		screen.getByText('Order History');
	});

	it('displays orders from backend', async () => {
		render(
			<MemoryRouter>
				<OrderHistory />
			</MemoryRouter>,
		);
		await waitFor(() => {
			screen.getByText(/Pork Chops/);
		});
		screen.getByText(/Iphone 7/);
	});

	it('shows order totals', async () => {
		render(
			<MemoryRouter>
				<OrderHistory />
			</MemoryRouter>,
		);
		await waitFor(() => {
			screen.getByText('$39.98');
		});
		screen.getByText('$799.99');
	});

	it('shows status chips', async () => {
		render(
			<MemoryRouter>
				<OrderHistory />
			</MemoryRouter>,
		);
		await waitFor(() => {
			screen.getByText(/fulfilled/);
		});
		screen.getByText(/pending/);
	});

	it('shows order dates', async () => {
		render(
			<MemoryRouter>
				<OrderHistory />
			</MemoryRouter>,
		);
		await waitFor(() => {
			screen.getByText('2026-05-20');
		});
		screen.getByText('2026-05-25');
	});

	it('shows no orders message when empty', async () => {
		server.use(
			http.get('/shopper/api/v0/order', () => {
				return HttpResponse.json([]);
			}),
		);
		render(
			<MemoryRouter>
				<OrderHistory />
			</MemoryRouter>,
		);
		await waitFor(() => {
			screen.getByText('No orders yet');
		});
	});

	it('handles fetch failure gracefully', async () => {
		server.use(
			http.get('/shopper/api/v0/order', () => {
				return new HttpResponse(null, { status: 500 });
			}),
		);
		render(
			<MemoryRouter>
				<OrderHistory />
			</MemoryRouter>,
		);
		await waitFor(() => {
			screen.getByText('No orders yet');
		});
	});

	it('shows back to shop link', async () => {
		render(
			<MemoryRouter>
				<OrderHistory />
			</MemoryRouter>,
		);
		screen.getByText(/Back to Shop/);
	});
});

describe('OrderHistory cancelled', () => {
	it('shows cancelled status chip', async () => {
		server.use(
			http.get('/shopper/api/v0/order', () => {
				return HttpResponse.json([{
					id: 'order-c',
					shopper: 'shopper-id',
					seller: 'seller-id',
					items: [{ listingId: 'l1', title: 'Item', price: 10, quantity: 1 }],
					total: 10,
					status: 'cancelled',
					created: '2026-05-01',
				}]);
			}),
		);
		render(
			<MemoryRouter>
				<OrderHistory />
			</MemoryRouter>,
		);
		await waitFor(() => {
			screen.getByText(/cancelled/);
		});
	});
});

describe('OrderHistory unknown status', () => {
	it('shows default chip for unknown status', async () => {
		server.use(
			http.get('/shopper/api/v0/order', () => {
				return HttpResponse.json([{
					id: 'order-u', shopper: 'shopper-id', seller: 'seller-id',
					items: [{ listingId: 'l1', title: 'Item', price: 10, quantity: 1 }],
					total: 10, status: 'processing', created: '2026-05-01',
				}]);
			}),
		);
		render(<MemoryRouter><OrderHistory /></MemoryRouter>);
		await waitFor(() => {
			screen.getByText(/processing/);
		});
	});
});
