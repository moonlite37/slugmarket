import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrderTable from '../src/app/order/OrderTable';

vi.mock('../src/app/order/actions', () => ({
	getOrders: vi.fn().mockResolvedValue([
		{ id: 'o1', shopper: 's1', seller: 'se1', items: [{ listingId: 'l1', title: 'Widget', price: 10, quantity: 1 }], total: 10, status: 'pending', created: '2026-05-13' },
	]),
	updateOrderStatus: vi.fn().mockResolvedValue(undefined),
}));

describe('OrderTable', () => {
	it('renders order data', async () => {
		render(<OrderTable />);
		await waitFor(() => {
			expect(screen.getByText('Widget')).toBeInTheDocument();
		});
		expect(screen.getByText('$10')).toBeInTheDocument();
		expect(screen.getByText('pending')).toBeInTheDocument();
	});

	it('has fulfill and cancel buttons', async () => {
		render(<OrderTable />);
		await waitFor(() => {
			expect(screen.getByText('Fulfill')).toBeInTheDocument();
		});
		expect(screen.getByText('Cancel')).toBeInTheDocument();
	});

	it('calls updateOrderStatus when fulfill clicked', async () => {
		const { updateOrderStatus } = await import('../src/app/order/actions');
		const user = userEvent.setup();
		render(<OrderTable />);
		await waitFor(() => {
			expect(screen.getByText('Fulfill')).toBeInTheDocument();
		});
		await user.click(screen.getByText('Fulfill'));
		await waitFor(() => {
			expect(updateOrderStatus).toHaveBeenCalledWith('o1', 'fulfilled');
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
			expect(updateOrderStatus).toHaveBeenCalledWith('o1', 'cancelled');
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
