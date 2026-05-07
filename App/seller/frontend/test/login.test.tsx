import { it, expect, describe, beforeAll, afterAll, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

import Login from '@/Login';

let oauthCalled = false;

const server = setupServer(
  http.get('http://localhost:3010/api/v0/oauthlogin', () => {
    oauthCalled = true;
    return HttpResponse.json({});
  }),
);

beforeAll(() => server.listen());
afterEach(() => { server.resetHandlers(); oauthCalled = false; });
afterAll(() => server.close());

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
    const user = userEvent.setup();
    render(<Login />);
    await user.click(
      screen.getByRole('button', { name: /sign in with google/i }),
    );
    expect(oauthCalled).toBe(true);
  });
});
