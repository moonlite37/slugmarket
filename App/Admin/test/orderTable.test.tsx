import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrderTable from '../src/app/order/OrderTable';

vi.mock('../src/app/order/actions', () => ({
	getOrders: vi.fn().mockResolvedValue([
		{ id: 'o1-abcdef-1234', shopper: 's1-shopper-uuid', seller: 'se1', shopperName: 'Jane Doe', shopperEmail: 'jane@test.com', items: [{ listingId: 'l1', title: 'Widget', price: 10, quantity: 1 }], total: 10, status: 'pending', created: '2026-05-13' },
	]),
	updateOrderStatus: vi.fn().mockResolvedValue(undefined),
}));

describe('OrderTable', () => {
	it('renders order data', async () => {
		render(<OrderTable />);
		await waitFor(() => {
			expect(screen.getByText('Widget × 1')).toBeInTheDocument();
		});
		expect(screen.getByText('$10')).toBeInTheDocument();
		expect(screen.getByText('pending')).toBeInTheDocument();
	});

	it('shows order ID', async () => {
		render(<OrderTable />);
		await waitFor(() => {
			expect(screen.getByText('o1-abcde')).toBeInTheDocument();
		});
	});

	it('shows shopper name', async () => {
		render(<OrderTable />);
		await waitFor(() => {
			expect(screen.getByText('Jane Doe')).toBeInTheDocument();
		});
	});

	it('shows order date', async () => {
		render(<OrderTable />);
		await waitFor(() => {
			expect(screen.getByText('2026-05-13')).toBeInTheDocument();
		});
	});

	it('has cancel button', async () => {
		render(<OrderTable />);
		await waitFor(() => {
			expect(screen.getByText('Cancel')).toBeInTheDocument();
		});
	});

	it('calls updateOrderStatus when cancel clicked', async () => {
		const { updateOrderStatus } = await import('../src/app/order/actions');
		const user = userEvent.setup();
		render(<OrderTable />);
		await waitFor(() => {
			expect(screen.getByText('Cancel')).toBeInTheDocument();
		});
		await user.click(screen.getByText('Cancel'));
		await waitFor(() => {
			expect(updateOrderStatus).toHaveBeenCalledWith('o1-abcdef-1234', 'cancelled');
		});
	});

	it('shows empty state when no orders', async () => {
		const { getOrders } = await import('../src/app/order/actions');
		(getOrders as ReturnType<typeof vi.fn>).mockResolvedValueOnce([]);
		render(<OrderTable />);
		await waitFor(() => {
			expect(screen.getByText('No orders')).toBeInTheDocument();
		});
	});
});

describe('OrderTable fallback', () => {
	it('shows truncated shopper UUID when name is missing', async () => {
		const { getOrders } = await import('../src/app/order/actions');
		(getOrders as ReturnType<typeof vi.fn>).mockResolvedValueOnce([
			{ id: 'o2-fallback-test', shopper: 'abcdefgh-1234-5678', seller: 'se1', items: [{ listingId: 'l1', title: 'NoName', price: 5, quantity: 1 }], total: 5, status: 'pending', created: '2026-06-01' },
		]);
		render(<OrderTable />);
		await waitFor(() => {
			expect(screen.getByText('abcdefgh')).toBeInTheDocument();
		});
	});
});

describe('Order search and pagination', () => {
	it('filters orders by shopper name', async () => {
		const user = userEvent.setup();
		render(<OrderTable />);
		await waitFor(() => {
			expect(screen.getByText('Jane Doe')).toBeDefined();
		});
		await user.type(screen.getByPlaceholderText('Search by shopper...'), 'xyz');
		await waitFor(() => {
			expect(screen.queryByText('Jane Doe')).toBeNull();
		});
	});

	it('paginates orders at 5 per page', async () => {
		const { getOrders } = await import('../src/app/order/actions');
		(getOrders as ReturnType<typeof vi.fn>).mockResolvedValue(
			Array.from({ length: 8 }, (_, i) => ({
				id: `o-${i}`, shopper: 's1', seller: 'se1', shopperName: `Buyer ${i}`,
				items: [{ listingId: 'l1', title: 'Item', price: 10, quantity: 1 }],
				total: 10, status: 'pending', created: '2026-06-01',
			})),
		);
		render(<OrderTable />);
		await waitFor(() => {
			expect(screen.getByText('Buyer 0')).toBeDefined();
		});
		expect(screen.getByText('Buyer 4')).toBeDefined();
		expect(screen.queryByText('Buyer 5')).toBeNull();
	});

	it('navigates to next page of orders', async () => {
		const { getOrders } = await import('../src/app/order/actions');
		(getOrders as ReturnType<typeof vi.fn>).mockResolvedValue(
			Array.from({ length: 8 }, (_, i) => ({
				id: `o-${i}`, shopper: 's1', seller: 'se1', shopperName: `Buyer ${i}`,
				items: [{ listingId: 'l1', title: 'Item', price: 10, quantity: 1 }],
				total: 10, status: 'pending', created: '2026-06-01',
			})),
		);
		const user = userEvent.setup();
		render(<OrderTable />);
		await waitFor(() => {
			expect(screen.getByText('Buyer 0')).toBeDefined();
		});
		await user.click(screen.getByRole('button', { name: /next/i }));
		expect(screen.getByText('Buyer 5')).toBeDefined();
		expect(screen.queryByText('Buyer 0')).toBeNull();
	});
});
