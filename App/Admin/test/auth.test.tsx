import { describe, expect, it, vi, type MockInstance } from 'vitest';
import { render, screen } from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import Login from '../src/app/login/View';

import { routerSpy } from './mockRouter';

vi.mock('../src/auth/service', () => ({
	AuthService: vi.fn().mockImplementation(() => ({
		login: vi.fn().mockImplementation(({ email, password }) => {
			if (email === 'johnpork@email.com' && password === 'johnpork') {
				return Promise.resolve({
					name: 'John Pork',
					authToken: 'test-token',
				});
			}
			return Promise.reject('Unauthorized');
		}),
	})),
}));


describe('login', () => {
	it('renders', () => {
		render(<Login />);
		expect(screen.getByText('Sign in to access the Slug Market dashboard.')).toBeInTheDocument();
	});
	it('accepts valid credentials', async () => {
		render(<Login />);
		await userEvent.type(await screen.findByPlaceholderText('Email Address'), 'johnpork@email.com');
		await userEvent.type(await screen.findByPlaceholderText('Password'), 'johnpork');
		await userEvent.click(screen.getByText('Login'));
		await vi.waitFor(() => {
			expect(routerSpy as MockInstance).toHaveBeenCalledWith('/');
		});
	});
	// TODO TEST WRONG CREDS
});