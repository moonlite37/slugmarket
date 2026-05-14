import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { server } from '../vitest.setup';
import { mockListings } from './mocks';
import ShopPage from '@/pages/Shop';
import userEvent from '@testing-library/user-event';


describe('listing list', () => {
	it('Displays app page and has functionality', async () => {
        const user = userEvent.setup();
        server.use(mockListings());
        render(<ShopPage/>);
        const minInput = screen.getByPlaceholderText("Min");
        const maxInput = screen.getByPlaceholderText("Max");
        await screen.findByText("Pork Chops");
        await user.type(minInput, "500");
        await user.type(maxInput, "1000");
        await user.tab();
		expect(await screen.queryByText('Pork Chops')).toBeNull();
	});
});