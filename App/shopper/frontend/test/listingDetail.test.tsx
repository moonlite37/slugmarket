import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { server } from '../vitest.setup';
import { http, HttpResponse } from 'msw';
import ListingDetail from '@/pages/ListingDetail';
import { CartContextProvider } from '@/context/CartContextProvider';

const renderWithRoute = (id: string) => {
	render(
		<MemoryRouter initialEntries={[`/listing/${id}`]}>
			<CartContextProvider>
				<Routes>
					<Route path="/listing/:id" element={<ListingDetail />} />
				</Routes>
			</CartContextProvider>
		</MemoryRouter>,
	);
};

describe('ListingDetail', () => {
	it('renders listing title', async () => {
		renderWithRoute('00000000-0000-0000-0000-000000000002');
		await waitFor(() => {
			screen.getByText('Pork Chops');
		});
	});

	it('shows full description', async () => {
		renderWithRoute('00000000-0000-0000-0000-000000000002');
		await waitFor(() => {
			screen.getByText(/authentic pork chops/);
		});
	});

	it('shows price', async () => {
		renderWithRoute('00000000-0000-0000-0000-000000000002');
		await waitFor(() => {
			screen.getByText(/19.99/);
		});
	});

	it('shows stock status', async () => {
		renderWithRoute('00000000-0000-0000-0000-000000000002');
		await waitFor(() => {
			screen.getByText(/in stock/);
		});
	});

	it('shows seller name', async () => {
		renderWithRoute('00000000-0000-0000-0000-000000000002');
		await waitFor(() => {
			screen.getByText(/John Pork/);
		});
	});

	it('shows add to cart button', async () => {
		renderWithRoute('00000000-0000-0000-0000-000000000002');
		await waitFor(() => {
			screen.getByRole('button', { name: /add.*cart/i });
		});
	});

	it('shows back to shop link', async () => {
		renderWithRoute('00000000-0000-0000-0000-000000000002');
		await waitFor(() => {
			screen.getByText(/Back to Shop/);
		});
	});

	it('shows not found for invalid id', async () => {
		server.use(
			http.get('/shopper/api/v0/listing/:id', () => {
				return new HttpResponse(null, { status: 404 });
			}),
		);
		renderWithRoute('invalid-id');
		await waitFor(() => {
			screen.getByText(/not found/i);
		});
	});
});

describe('ListingDetail discount', () => {
	it('shows discount price', async () => {
		server.use(
			http.get('/shopper/api/v0/listing/:id', () => {
				return HttpResponse.json({
					id: 'disc-1',
					author: 'a1',
					username: 'Seller',
					title: 'Sale Item',
					description: 'On sale',
					created: '2026-01-01',
					price: 100,
					discountPrice: 75,
					stock: 5,
					categories: [],
					images: ['img.jpg'],
				});
			}),
		);
		renderWithRoute('disc-1');
		await waitFor(() => {
			screen.getByText(/75.00/);
		});
		screen.getByText(/100.00/);
	});
});

describe('ListingDetail edge cases', () => {
	it('disables add to cart when out of stock', async () => {
		server.use(
			http.get('/shopper/api/v0/listing/:id', () => {
				return HttpResponse.json({
					id: 'oos-1', author: 'a1', username: 'Seller',
					title: 'Sold Out Item', description: 'Gone',
					created: '2026-01-01', price: 50, stock: 0,
					categories: ['electronics'], images: ['img.jpg'],
				});
			}),
		);
		renderWithRoute('oos-1');
		await waitFor(() => {
			screen.getByText('Sold Out Item');
		});
		screen.getByText(/Out of stock/);
		const btn = screen.getByRole('button', { name: /add.*cart/i });
		expect(btn).toBeDisabled();
	});

	it('shows category chips', async () => {
		renderWithRoute('00000000-0000-0000-0000-000000000002');
		await waitFor(() => {
			screen.getByText('food');
		});
		screen.getByText('pork');
	});
});
