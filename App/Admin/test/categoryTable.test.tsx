import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CategoryTable from '../src/app/category/CategoryTable';

vi.mock('../src/app/category/actions', () => ({
	getCategories: vi.fn().mockResolvedValue([
		{ id: 'c1', name: 'Electronics' },
		{ id: 'c2', name: 'Books' },
	]),
	createCategory: vi.fn().mockResolvedValue({ id: 'c3', name: 'Clothing' }),
	deleteCategory: vi.fn().mockResolvedValue(undefined),
}));

describe('CategoryTable', () => {
	it('renders category names', async () => {
		render(<CategoryTable />);
		await waitFor(() => {
			expect(screen.getByText('Electronics')).toBeDefined();
		});
		expect(screen.getByText('Books')).toBeDefined();
	});

	it('creates a new category', async () => {
		const user = userEvent.setup();
		render(<CategoryTable />);
		await waitFor(() => {
			expect(screen.getByText('Electronics')).toBeDefined();
		});
		await user.type(screen.getByPlaceholderText('New category name'), 'Clothing');
		await user.click(screen.getByRole('button', { name: 'Add' }));
		await waitFor(() => {
			expect(screen.getByText('Clothing')).toBeDefined();
		});
	});

	it('deletes a category', async () => {
		const user = userEvent.setup();
		render(<CategoryTable />);
		await waitFor(() => {
			expect(screen.getByText('Electronics')).toBeDefined();
		});
		const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
		await user.click(deleteButtons[0]);
		await waitFor(() => {
			expect(screen.queryByText('Electronics')).toBeNull();
		});
	});

	it('shows empty state', async () => {
		const { getCategories } = await import('../src/app/category/actions');
		(getCategories as ReturnType<typeof vi.fn>).mockResolvedValueOnce([]);
		render(<CategoryTable />);
		await waitFor(() => {
			expect(screen.getByText('No categories')).toBeDefined();
		});
	});
});

describe('CategoryActions', () => {
	it('createCategory calls service', async () => {
		const { createCategory } = await import('../src/app/category/actions');
		const result = await createCategory('Test');
		expect(result).toEqual({ id: 'c3', name: 'Clothing' });
	});

	it('deleteCategory calls service', async () => {
		const { deleteCategory } = await import('../src/app/category/actions');
		await deleteCategory('c1');
	});
});
