import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import Login from '../src/app/login/View';


describe('login', () => {
	it('renders', () => {
		render(<Login />);
		expect(screen.getByText('Slug Market Admin Login')).toBeInTheDocument();
	});
});