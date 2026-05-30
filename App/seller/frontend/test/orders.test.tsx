import { describe, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { server } from '../vitest.setup';
import { http, HttpResponse } from 'msw';
import OrdersView from '@/OrdersView';

async function fulfillOrder(user: UserEvent){
	await waitFor(() => {
		screen.getByText(/Fulfill/);
	});
	await user.click(screen.getByText(/Fulfill/));
}


describe('Seller OrdersView', () => {
	it('renders My Orders heading', () => {
		render(
			<MemoryRouter>
				<OrdersView />
			</MemoryRouter>,
		);
		screen.getByText('My Orders');
	});

	it('displays orders from backend', async () => {
		render(
			<MemoryRouter>
				<OrdersView />
			</MemoryRouter>,
		);
		await waitFor(() => {
			screen.getByText(/Test Widget/);
		});
		screen.getByText(/pending/);
	});

	it('shows order total', async () => {
		render(
			<MemoryRouter>
				<OrdersView />
			</MemoryRouter>,
		);
		await waitFor(() => {
			screen.getByText('$29.97');
		});
	});

	it('shows fulfill and cancel buttons for pending orders', async () => {
		render(
			<MemoryRouter>
				<OrdersView />
			</MemoryRouter>,
		);
		await waitFor(() => {
			screen.getByText(/Fulfill/);
		});
		screen.getByText(/Cancel/);
	});

	it('clicking fulfill updates order status', async () => {
		const user = userEvent.setup();
		render(
			<MemoryRouter>
				<OrdersView />
			</MemoryRouter>,
		);
		await fulfillOrder(user);
		await waitFor(() => {
			screen.getByText(/fulfilled/);
		});
	});

	it('leaves other orders unchanged when one order status updates', async () => {
		const user = userEvent.setup();
		server.use(
			http.get('http://localhost:3000/seller/api/v0/order', () => {
				return HttpResponse.json([
					{
						id: 'order-1',
						shopper: 'shopper-id',
						seller: 'seller-id',
						items: [{ listingId: 'l1', title: 'Test Widget', price: 9.99, quantity: 3 }],
						total: 29.97,
						status: 'pending',
						created: '2026-05-20',
					},
					{
						id: 'order-2',
						shopper: 'shopper-id',
						seller: 'seller-id',
						items: [{ listingId: 'l2', title: 'Other Widget', price: 5, quantity: 1 }],
						total: 5,
						status: 'pending',
						created: '2026-05-21',
					},
				]);
			}),
		);
		render(
			<MemoryRouter>
				<OrdersView />
			</MemoryRouter>,
		);

		await waitFor(() => {
			screen.getByText(/Other Widget/);
		});
		await user.click(screen.getAllByText(/Fulfill/)[0]);

		await waitFor(() => {
			screen.getByText(/fulfilled/);
		});
		screen.getByText(/pending/);
	});

	it('clicking cancel updates order status', async () => {
		const user = userEvent.setup();
		render(
			<MemoryRouter>
				<OrdersView />
			</MemoryRouter>,
		);
		await waitFor(() => {
			screen.getByText(/Cancel/);
		});
		await user.click(screen.getByText(/Cancel/));
		await waitFor(() => {
			screen.getByText(/cancelled/);
		});
	});

	it('shows no orders message when empty', async () => {
		server.use(
			http.get('http://localhost:3000/seller/api/v0/order', () => {
				return HttpResponse.json([]);
			}),
		);
		render(
			<MemoryRouter>
				<OrdersView />
			</MemoryRouter>,
		);
		await waitFor(() => {
			screen.getByText('No orders yet');
		});
	});

	it('handles fetch failure gracefully', async () => {
		server.use(
			http.get('http://localhost:3000/seller/api/v0/order', () => {
				return new HttpResponse(null, { status: 500 });
			}),
		);
		render(
			<MemoryRouter>
				<OrdersView />
			</MemoryRouter>,
		);
		await waitFor(() => {
			screen.getByText('No orders yet');
		});
	});
});

describe('OrdersView error handling', () => {
	it('handles update failure gracefully', async () => {
		const user = userEvent.setup();
		server.use(
			http.put('http://localhost:3000/seller/api/v0/order/:id', () => {
				return new HttpResponse(null, { status: 500 });
			}),
		);
		render(
			<MemoryRouter>
				<OrdersView />
			</MemoryRouter>,
		);
		await fulfillOrder(user);
		screen.getByText(/pending/);
	});
});
