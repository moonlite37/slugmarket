import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '../vitest.setup';
import { http, HttpResponse } from 'msw';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import CreateListing from '@/CreateListing';

describe('Create Listing Form', () => {
	it('renders title input', () => {
		render(<CreateListing />);
		screen.getByPlaceholderText('Title');
	});

	it('renders description input', () => {
		render(<CreateListing />);
		screen.getByPlaceholderText('Description');
	});

	it('renders price input', () => {
		render(<CreateListing />);
		screen.getByPlaceholderText('Price');
	});

	it('renders stock input', () => {
		render(<CreateListing />);
		screen.getByPlaceholderText('Stock');
	});

	it('renders submit button', () => {
		render(<CreateListing />);
		expect(screen.getByRole('button', { name: /create listing/i })).toBeDefined();
	});

    it('submit button enabled when fields filled', async () => {
		const user = userEvent.setup();
		render(<CreateListing />);
		await user.type(screen.getByPlaceholderText('Title'), 'Widget');
		await user.type(screen.getByPlaceholderText('Description'), 'A widget');
		await user.type(screen.getByPlaceholderText('Price'), '9.99');
		await user.type(screen.getByPlaceholderText('Stock'), '5');
		const button = screen.getByRole('button', { name: /create listing/i });
		expect(button).toHaveProperty('disabled', false);
	});

	it('shows success message after submit', async () => {
		const user = userEvent.setup();
		render(<CreateListing />);
		await user.type(screen.getByPlaceholderText('Title'), 'Widget');
		await user.type(screen.getByPlaceholderText('Description'), 'A widget');
		await user.type(screen.getByPlaceholderText('Price'), '9.99');
		await user.type(screen.getByPlaceholderText('Stock'), '5');
		await user.click(screen.getByRole('button', { name: /create listing/i }));
		await waitFor(() => {
			screen.getByText('Listing created');
		});
	});

    it('does not show success message on failure', async () => {
		server.use(
			http.post('http://localhost:3011/api/v0/listing', () => {
				return new HttpResponse(null, { status: 500 });
			}),
		);
		const user = userEvent.setup();
		render(<CreateListing />);
		await user.type(screen.getByPlaceholderText('Title'), 'Widget');
		await user.type(screen.getByPlaceholderText('Description'), 'A widget');
		await user.type(screen.getByPlaceholderText('Price'), '9.99');
		await user.type(screen.getByPlaceholderText('Stock'), '5');
		await user.click(screen.getByRole('button', { name: /create listing/i }));
		expect(screen.queryByText('Listing created')).toBeNull();
	});

    it('renders at /listing/new route', () => {
	render(
		<MemoryRouter initialEntries={['/listing/new']}>
			<Routes>
				<Route path="/listing/new" element={<CreateListing />} />
			</Routes>
		</MemoryRouter>,
	);
	screen.getByPlaceholderText('Title');
});
});