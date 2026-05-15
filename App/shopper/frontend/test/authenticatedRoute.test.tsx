import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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
