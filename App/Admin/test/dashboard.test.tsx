import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ListingTable from '../src/app/listing/ListingTable';

const mockListings = [
	{ id: 'mock-1', author: 'a1', title: 'Widget', description: 'A widget', price: 10, stock: 5, created: '2026-05-10' },
	{ id: 'mock-2', author: 'a2', title: 'Gadget', description: 'A gadget', price: 20, stock: 3, created: '2026-05-10' },
];

vi.mock('../src/app/listing/actions', () => ({
	getListings: vi.fn().mockResolvedValue([
		{ id: 'mock-1', author: 'a1', title: 'Widget', description: 'A widget', price: 10, stock: 5, created: '2026-05-10' },
		{ id: 'mock-2', author: 'a2', title: 'Gadget', description: 'A gadget', price: 20, stock: 3, created: '2026-05-10' },
	]),
	deleteListing: vi.fn().mockResolvedValue(undefined),
}));

describe('Admin Dashboard - Listing Table', () => {
	it('renders listing titles', async () => {
		render(<ListingTable />);
		await waitFor(() => {
			expect(screen.getByText('Widget')).toBeInTheDocument();
		});
		expect(screen.getByText('Gadget')).toBeInTheDocument();
	});

	it('renders delete button for each listing', async () => {
		render(<ListingTable />);
		await waitFor(() => {
			expect(screen.getByText('Widget')).toBeInTheDocument();
		});
		const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
		expect(deleteButtons.length).toBe(2);
	});

	it('calls delete action when delete button clicked', async () => {
		const { deleteListing } = await import('../src/app/listing/actions');
		const user = userEvent.setup();
		render(<ListingTable />);
		await waitFor(() => {
			expect(screen.getByText('Widget')).toBeInTheDocument();
		});
		const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
		await user.click(deleteButtons[0]);
		await waitFor(() => {
			expect(deleteListing).toHaveBeenCalledWith('mock-1');
		});
	});

	it('shows empty state when no listings', async () => {
		const { getListings } = await import('../src/app/listing/actions');
		(getListings as ReturnType<typeof vi.fn>).mockResolvedValueOnce([]);
		render(<ListingTable />);
		await waitFor(() => {
			expect(screen.getByText('No listings')).toBeInTheDocument();
		});
	});
});