import { describe, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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
