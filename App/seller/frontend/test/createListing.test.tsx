import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '../vitest.setup';
import { http, HttpResponse } from 'msw';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import CreateListing from '@/CreateListing';

const renderCreateListing = () => {
	render(
		<MemoryRouter>
			<CreateListing />
		</MemoryRouter>,
	);
};

const fillInOrder = async (user: ReturnType<typeof userEvent.setup>) => {
	await user.type(screen.getByPlaceholderText('Title'), 'Widget');
	await user.type(screen.getByPlaceholderText('Description'), 'A widget');
	await user.type(screen.getByPlaceholderText('Price'), '9.99');
	await user.type(screen.getByPlaceholderText('Stock'), '5');
};

describe('Create Listing Form', () => {
	it('renders title input', () => {
		renderCreateListing();
		screen.getByPlaceholderText('Title');
	});

	it('renders description input', () => {
		renderCreateListing();
		screen.getByPlaceholderText('Description');
	});

	it('renders price input', () => {
		renderCreateListing();
		screen.getByPlaceholderText('Price');
	});

	it('renders stock input', () => {
		renderCreateListing();
		screen.getByPlaceholderText('Stock');
	});

	it('renders submit button', () => {
		renderCreateListing();
		expect(screen.getByRole('button', { name: /save/i })).toBeDefined();
	});

	it('submit button enabled when fields filled', async () => {
		const user = userEvent.setup();
		renderCreateListing();
		await fillInOrder(user);
		const button = screen.getByRole('button', { name: /save/i });
		expect(button).toHaveProperty('disabled', false);
	});

	it('shows success message after submit', async () => {
		const user = userEvent.setup();
		renderCreateListing();
		await fillInOrder(user);
		await user.click(screen.getByRole('button', { name: /save/i }));
		await waitFor(() => {
			screen.getByText('Listing created');
		});
	});

	it('does not show success message on failure', async () => {
		server.use(
			http.post('http://localhost:3000/seller/api/v0/listing', () => {
				return new HttpResponse(null, { status: 500 });
			}),
		);
		const user = userEvent.setup();
		renderCreateListing();
		await fillInOrder(user);
		await user.click(screen.getByRole('button', { name: /save/i }));
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

	it('redirects to /seller/ after creating listing', async () => {
		const user = userEvent.setup();
		render(
			<MemoryRouter basename="/seller" initialEntries={['/seller/listing/new']}>
				<Routes>
					<Route path="/listing/new" element={<CreateListing />} />
					<Route path="/" element={<div>Seller dashboard</div>} />
				</Routes>
			</MemoryRouter>,
		);

		await fillInOrder(user);
		await user.click(screen.getByRole('button', { name: /save/i }));

		await waitFor(() => {
			screen.getByText('Seller dashboard');
		});
	});
});

describe('Category picker', () => {
	it('renders category checkboxes', async () => {
		renderCreateListing();
		expect(await screen.findByLabelText('Food')).toBeDefined();
		expect(await screen.findByLabelText('Tech')).toBeDefined();
	});

	it('can select a category', async () => {
		const user = userEvent.setup();
		renderCreateListing();
		const foodCheckbox = await screen.findByLabelText('Food');
		await user.click(foodCheckbox);
		expect((foodCheckbox as HTMLInputElement).checked).toBe(true);
	});
});

describe('image upload', () => {
        const mockImageUpload = () => {
                server.use(
                        http.post('http://localhost:3000/seller/api/v0/image', () => {
                                return HttpResponse.json({ url: 'https://s3.test/image.png' }, { status: 201 });
                        }),
                );
        };
        const uploadAndPreview = async () => {
                const file = new File(['fake-image'], 'test.png', { type: 'image/png' });
                await userEvent.upload(screen.getByLabelText('Upload Image'), file);
                await waitFor(() => { expect(screen.getByAltText('Preview')).toBeTruthy(); });
        };
        it('has an image upload button', () => {
                renderCreateListing();
                expect(screen.getByLabelText('Upload Image')).toBeTruthy();
        });
        it('shows preview after uploading', async () => {
                mockImageUpload();
                renderCreateListing();
                await uploadAndPreview();
        });
        it('includes image URL in listing creation', async () => {
                let listingBody: Record<string, unknown> = {};
                mockImageUpload();
                server.use(
                        http.post('http://localhost:3000/seller/api/v0/listing', async ({ request: req }) => {
                                listingBody = await req.json() as Record<string, unknown>;
                                return new HttpResponse(null, { status: 201 });
                        }),
                );
                renderCreateListing();
                await uploadAndPreview();
                await userEvent.type(screen.getByPlaceholderText('Title'), 'Widget');
                await userEvent.type(screen.getByPlaceholderText('Description'), 'A widget');
                await userEvent.type(screen.getByPlaceholderText('Price'), '9.99');
                await userEvent.type(screen.getByPlaceholderText('Stock'), '5');
                await userEvent.click(screen.getByRole('button', { name: /save/i }));
                await waitFor(() => {
                        expect((listingBody.images as string[])?.[0]).toBe('https://s3.test/image.png');
                });
        });
});
