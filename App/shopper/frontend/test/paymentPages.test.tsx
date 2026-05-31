import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SuccessfulPayment from '@/pages/SuccessfulPayment';
import FailedPayment from '@/pages/FailedPayment';

describe('SuccessfulPayment', () => {
	it('renders success heading', () => {
		render(<MemoryRouter><SuccessfulPayment /></MemoryRouter>);
		screen.getByText(/Payment Successful/i);
	});

	it('shows confirmation message', () => {
		render(<MemoryRouter><SuccessfulPayment /></MemoryRouter>);
		screen.getByText(/thank you/i);
	});

	it('shows back to shop link', () => {
		render(<MemoryRouter><SuccessfulPayment /></MemoryRouter>);
		screen.getByText(/Back to Shop/i);
	});

	it('shows order history link', () => {
		render(<MemoryRouter><SuccessfulPayment /></MemoryRouter>);
		screen.getByText(/View Orders/i);
	});
});

describe('FailedPayment', () => {
	it('renders failure heading', () => {
		render(<MemoryRouter><FailedPayment /></MemoryRouter>);
		screen.getByText(/Payment Failed/i);
	});

	it('shows error message', () => {
		render(<MemoryRouter><FailedPayment /></MemoryRouter>);
		screen.getByText(/cancelled|could not be processed/i);
	});

	it('shows back to shop link', () => {
		render(<MemoryRouter><FailedPayment /></MemoryRouter>);
		screen.getByText(/Back to Shop/i);
	});

	it('shows try again link', () => {
		render(<MemoryRouter><FailedPayment /></MemoryRouter>);
		screen.getByRole('link', { name: /Try Again/i });
	});
});
