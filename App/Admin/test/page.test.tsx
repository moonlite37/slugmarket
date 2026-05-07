import { it } from 'vitest';
import { render } from '@testing-library/react';

import Page from '../src/app/page';
import LoginPage from '../src/app/login/page';

it('Renders', async () => {
	render(<Page />);
});

it('Renders Login', async () => {
	render(<LoginPage />);
});