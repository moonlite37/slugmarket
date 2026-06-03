import { it, expect, describe, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Login from '@/Login';

describe('Login Page', async () => {
  it('Renders Sign In', async () => {
    render(<Login />);
    screen.getByText('Sign In');
  });

  it('Renders Welcome to SlugMarket', async () => {
    render(<Login />);
    screen.getByText(/welcome to slugmarket/i);
  });

  it('Renders Sign In Google Button', async () => {
    render(<Login />);
    expect(screen.getByRole('button', { name: /sign in with google/i }));
  });

  it('Click Sign In With Google', async () => {
    vi.stubGlobal('location', { href: '', search: '' });
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ url: 'mock-url' }),
    });
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    render(<Login />);
    await user.click(
      screen.getByRole('button', { name: /sign in with google/i }),
    );
    await vi.waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/shopper/api/v0/oauthlogin');
      expect(location.href).toBe('mock-url');
    });
  });

  it('passes cart source to oauth login', async () => {
    window.history.pushState({}, '', '/login?source=cart');
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ url: 'mock-url' }),
    });
    vi.stubGlobal('location', { href: '', search: '?source=cart' });
    vi.stubGlobal('fetch', fetchMock);

    const user = userEvent.setup();
    render(<Login />);
    await user.click(
      screen.getByRole('button', { name: /sign in with google/i }),
    );

    await vi.waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/shopper/api/v0/oauthlogin?source=cart');
    });
  });
});
