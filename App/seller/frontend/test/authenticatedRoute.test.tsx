import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { server } from '../vitest.setup';
import AuthenticatedRoute from '@/AuthenticatedRoute';

describe('AuthenticatedRoute', () => {
  it('renders protected content when authenticated', async () => {
    server.use(
      http.get('http://localhost:3013/api/v0/protected', () => {
        return new HttpResponse(null, { status: 200 });
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
    await waitFor(() => expect(screen.getByText('Home Page')).toBeDefined());
  });

  it('redirects to /login when not authenticated', async () => {
    server.use(
      http.get('http://localhost:3013/api/v0/protected', () => {
        return new HttpResponse(null, { status: 401 });
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
    await waitFor(() => expect(screen.getByText('Login Page')).toBeDefined());
  });
});
