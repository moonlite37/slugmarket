import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { render, screen } from '@testing-library/react';

import ListingCard from '../src/listing/card';
import ListingList from '../src/listing/list';
import { server } from '../vitest.setup';

const listing = {
	id: '00000000-0000-0000-0000-000000000002',
	author: '00000000-0000-0000-0000-000000000001',
	username: 'John Pork',
	title: 'Pork Chops',
	description: '100% authentic pork chops made from pork',
	created: new Date().toISOString(),
	price: 19.99,
	stock: 42,
	categories: ['food', 'pork'],
	images: ['img1.jpg', 'img2.jpg'],
};

const listing2 = {
	id: '00000000-0000-0000-0000-000000000003',
	author: '00000000-0000-0000-0000-000000000002',
	username: 'Steve Jobs',
	title: 'Iphone 7',
	description: 'New and improved Iphone with touch id. 100% less headphone jacks!',
	created: new Date().toISOString(),
	price: 799.99,
	stock: 224,
	categories: ['phone', 'tech'],
	images: ['img3.jpg', 'img4.jpg'],
};

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
		expect(await screen.findByRole('button', { name: 'Add to cart' })).toBeInTheDocument();
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
		server.use(
			http.get('http://localhost:3012/api/v0/listing', () => {
				return HttpResponse.json([listing, listing2]);
			}),
		);

		render(<ListingList />);

		expect(await screen.findByText('Pork Chops')).toBeInTheDocument();
		expect(await screen.findByText('Iphone 7')).toBeInTheDocument();
	});
});
