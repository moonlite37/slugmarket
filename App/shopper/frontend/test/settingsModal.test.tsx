import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { http, HttpResponse } from 'msw';

import SettingsModal from '@/components/SettingsModal';
import { CartContext } from '@/context/cartContext';
import { server } from '../vitest.setup';

const cartValue = (loggedIn: boolean) => ({
	items: [],
	loggedIn,
	addToCart: async () => {},
	removeFromCart: async () => {},
	syncCart: async () => {},
	checkout: async () => {},
});

const renderModal = (loggedIn: boolean, onClose = () => {}) =>
	render(
		<MemoryRouter initialEntries={['/']}>
			<CartContext.Provider value={cartValue(loggedIn)}>
				<Routes>
					<Route path="/" element={<SettingsModal open onClose={onClose} />} />
					<Route path="/login" element={<div>Login Page</div>} />
				</Routes>
			</CartContext.Provider>
		</MemoryRouter>,
	);

describe('SettingsModal', () => {
	it('shows the title and language selector', () => {
		renderModal(false);
		const dialog = screen.getByRole('dialog');
		expect(screen.getByText('Settings')).toBeInTheDocument();
		expect(screen.getByRole('combobox')).toBeInTheDocument();
		expect(dialog).toBeInTheDocument();
	});

	it('hides the logout button when not logged in', () => {
		renderModal(false);
		expect(screen.queryByRole('button', { name: /log\s*out/i })).not.toBeInTheDocument();
	});

	it('shows the logout button when logged in', () => {
		renderModal(true);
		expect(screen.getByRole('button', { name: /log\s*out/i })).toBeInTheDocument();
	});

	it('logs out, closes, and redirects to login on click', async () => {
		let logoutCalled = false;
		server.use(
			http.delete('/shopper/api/v0/logout', () => {
				logoutCalled = true;
				return new HttpResponse(null, { status: 204 });
			}),
		);
		const onClose = vi.fn();
		renderModal(true, onClose);
		await userEvent.click(screen.getByRole('button', { name: /log\s*out/i }));
		await waitFor(() => expect(logoutCalled).toBe(true));
		expect(onClose).toHaveBeenCalled();
		expect(await screen.findByText('Login Page')).toBeInTheDocument();
	});
});
