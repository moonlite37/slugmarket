import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import ListingCard from '../src/listing/card';
import ListingList from '../src/listing/list';
import { server } from '../vitest.setup';
import { listing, mockListings } from './mocks';

describe('listing card', () => {
	it('shows listing title', async () => {
		render(<ListingCard listing={listing} />);
		expect(await screen.findByText('Pork Chops')).toBeInTheDocument();
	});

	it('shows listing author', async () => {
		render(<ListingCard listing={listing} />);
		expect(await screen.findByText('John Pork')).toBeInTheDocument();
	});

	it('has a button to add to cart', async () => {
		render(<ListingCard listing={listing} />);
		expect(
			await screen.findByRole('button', { name: 'add Pork Chops to cart' }),
		).toBeInTheDocument();
	});

	it('shows default price', async () => {
		render(<ListingCard listing={listing} />);
		expect(await screen.findByText('$19.99')).toBeInTheDocument();
	});

	it('shows sale price', async () => {
		render(<ListingCard listing={{ ...listing, discountPrice: 14.99 }} />);
		expect(await screen.findByText('$14.99')).toBeInTheDocument();
	});

	it('shows out of stock', async () => {
		render(<ListingCard listing={{ ...listing, stock: 0 }} />);
		expect(await screen.findByText('Out of stock')).toBeInTheDocument();
	});
});

describe('listing list', () => {
	it('displays listing cards returned by the API', async () => {
		server.use(mockListings());
		render(<ListingList />);
		expect(await screen.findByText('Pork Chops')).toBeInTheDocument();
		expect(await screen.findByText('Iphone 7')).toBeInTheDocument();
	});
});
