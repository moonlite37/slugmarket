import { it, describe, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../vitest.setup';
import i18n from '@/utils/i18n';
import Login from '@/Login';
import LocaleSwitcher from '@/LocaleSwitcher';
import Dashboard from '@/Dashboard';

afterEach(async () => {
  await i18n.changeLanguage('en');
});

const renderDashboardInSpanish = async () => {
  const user = userEvent.setup();
  render(
    <>
      <MemoryRouter>
        <LocaleSwitcher />
        <Dashboard />
      </MemoryRouter>
    </>,
  );
  await user.selectOptions(screen.getByRole('combobox'), 'es');
};

const renderLoginInSpanish = async () => {
  const user = userEvent.setup();
  render(
    <>
      <LocaleSwitcher />
      <Login />
    </>,
  );
  await user.selectOptions(screen.getByRole('combobox'), 'es');
};

describe('Login Spanish', async () => {
  it('Sign In', async () => {
    await renderLoginInSpanish();
    await waitFor(() => screen.getByText(/^Iniciar sesión$/i));
  });

  it('Welcome to SlugMarket', async () => {
    await renderLoginInSpanish();
    await waitFor(() => screen.getByText(/^Bienvenido a SlugMarket$/i));
  });

  it('Sign In with google', async () => {
    await renderLoginInSpanish();
    await waitFor(() => screen.getByText(/^Iniciar sesión con Google$/i));
  });
});

describe('Dashboard Spanish', async () => {
  it('My Listings', async () => {
    await renderDashboardInSpanish();
    await waitFor(() => screen.getByText(/^Mis listados$/i));
  });

  it('Create New Listing', async () => {
    await renderDashboardInSpanish();
    await waitFor(() => screen.getByText(/^Crear nuevo anuncio$/i));
  });

  it('No listings yet', async () => {
    server.use(
      http.get('http://localhost:3000/seller/api/v0/listing', () =>
        HttpResponse.json([]),
      ),
    );
    await renderDashboardInSpanish();
    await waitFor(() => screen.getByText(/^Aún no hay listados\.$/i));
  });
});
