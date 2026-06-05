import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { server } from '../vitest.setup';
import AuthenticatedRoute from '@/AuthenticatedRoute';

function authenticatedRouteSetup(status: number) {
  server.use(
    http.get('/shopper/api/v0/protected', () => {
      return new HttpResponse(null, { status });
    }),
  );
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route element={<AuthenticatedRoute />}>
          <Route path="/" element={<div>Home Page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe('AuthenticatedRoute', () => {
  it('renders protected content when authenticated', async () => {
    authenticatedRouteSetup(200);
    expect(await screen.findByText('Home Page')).toBeDefined();
  });

  it('redirects to /login when not authenticated', async () => {
    authenticatedRouteSetup(401);
    expect(await screen.findByText('Login Page')).toBeDefined();
  });
});

describe('logout', () => {
	it('shows logout button when authenticated', async () => {
		server.use(
			http.get('/shopper/api/v0/protected', () => {
				return HttpResponse.json({ message: 'ok' });
			}),
		);
		render(
			<MemoryRouter initialEntries={['/orders']}>
				<Routes>
					<Route element={<AuthenticatedRoute />}>
						<Route path="/orders" element={<div>Orders</div>} />
					</Route>
				</Routes>
			</MemoryRouter>,
		);
		expect(await screen.findByRole('button', { name: /log\s*out/i })).toBeTruthy();
	});
	it('calls logout endpoint on click', async () => {
		let logoutCalled = false;
		server.use(
			http.get('/shopper/api/v0/protected', () => {
				return HttpResponse.json({ message: 'ok' });
			}),
			http.delete('/shopper/api/v0/logout', () => {
				logoutCalled = true;
				return new HttpResponse(null, { status: 204 });
			}),
		);
		render(
			<MemoryRouter initialEntries={['/orders']}>
				<Routes>
					<Route element={<AuthenticatedRoute />}>
						<Route path="/orders" element={<div>Orders</div>} />
					</Route>
					<Route path="/login" element={<div>Login</div>} />
				</Routes>
			</MemoryRouter>,
		);
		const btn = await screen.findByRole('button', { name: /log\s*out/i });
		await userEvent.click(btn);
		await waitFor(() => { expect(logoutCalled).toBe(true); });
	});
});
