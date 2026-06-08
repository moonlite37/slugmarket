import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ListingTable from '../src/app/listing/ListingTable';

const mockListings = [
	{ id: 'mock-1', author: 'a1', title: 'Widget', description: 'A widget', price: 10, stock: 5, username: 'alice', created: '2026-05-10' },
	{ id: 'mock-2', author: 'a2', title: 'Gadget', description: 'A gadget', price: 20, stock: 3, username: 'bob', created: '2026-05-10' },
];

vi.mock('../src/app/listing/actions', () => ({
	getListings: vi.fn().mockResolvedValue([
		{ id: 'mock-1', author: 'a1', title: 'Widget', description: 'A widget', price: 10, stock: 5, username: 'alice', created: '2026-05-10' },
		{ id: 'mock-2', author: 'a2', title: 'Gadget', description: 'A gadget', price: 20, stock: 3, username: 'bob', created: '2026-05-10' },
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
	it('shows seller username', async () => {
		render(<ListingTable />);
		await waitFor(() => {
			expect(screen.getByText('alice')).toBeInTheDocument();
		});
		expect(screen.getByText('bob')).toBeInTheDocument();
	});

	it('filters listings by search', async () => {
		const user = userEvent.setup();
		render(<ListingTable />);
		await waitFor(() => {
			expect(screen.getByText('Widget')).toBeInTheDocument();
		});
		await user.type(screen.getByPlaceholderText('Search listings...'), 'Gad');
		await waitFor(() => {
			expect(screen.queryByText('Widget')).toBeNull();
		});
		expect(screen.getByText('Gadget')).toBeInTheDocument();
	});

	it('filters listings by category', async () => {
		const user = userEvent.setup();
		vi.mock('../src/app/category/actions', () => ({
			getCategories: vi.fn().mockResolvedValue([
				{ id: 'cat-1', name: 'Electronics' },
				{ id: 'cat-2', name: 'Food' },
			]),
			createCategory: vi.fn(),
			deleteCategory: vi.fn(),
		}));
		const { getListings } = await import('../src/app/listing/actions');
		(getListings as ReturnType<typeof vi.fn>).mockResolvedValue([
			{ id: 'mock-1', author: 'a1', title: 'Widget', description: 'A widget', price: 10, stock: 5, username: 'alice', categories: ['cat-1'] },
			{ id: 'mock-2', author: 'a2', title: 'Pork', description: 'Food', price: 20, stock: 3, username: 'bob', categories: ['cat-2'] },
		]);
		render(<ListingTable />);
		await waitFor(() => {
			expect(screen.getByText('Widget')).toBeInTheDocument();
		});
		const select = screen.getByRole('combobox');
		await user.click(select);
		await user.click(screen.getByRole('option', { name: 'Electronics' }));
		await waitFor(() => {
			expect(screen.queryByText('Pork')).toBeNull();
		});
		expect(screen.getByText('Widget')).toBeInTheDocument();
	});

	it('shows truncated author when username is missing', async () => {
		const { getListings } = await import('../src/app/listing/actions');
		(getListings as ReturnType<typeof vi.fn>).mockResolvedValueOnce([
			{ id: 'mock-3', author: 'abcdefgh-1234', title: 'NoUser', description: 'test', price: 5, stock: 1, created: '2026-05-10' },
		]);
		render(<ListingTable />);
		await waitFor(() => {
			expect(screen.getByText('abcdefgh')).toBeInTheDocument();
		});
	});
