import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { server } from '../vitest.setup';
import { http, HttpResponse } from 'msw';
import OrdersView from '@/OrdersView';

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
		await waitFor(() => {
			screen.getByText(/Fulfill/);
		});
		await user.click(screen.getByText(/Fulfill/));
		await waitFor(() => {
			screen.getByText(/fulfilled/);
		});
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
