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
import CreateListing from '@/CreateListing';
import CreateKey from '@/CreateKey';

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

const renderCreateListingInSpanish = async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <LocaleSwitcher />
      <CreateListing />
    </MemoryRouter>,
  );
  await user.selectOptions(screen.getByRole('combobox'), 'es');
};

describe('CreateListing Spanish', async () => {
  it('Create Listing', async () => {
    await renderCreateListingInSpanish();
    await waitFor(() => screen.getByRole('heading', { name: /^Crear anuncio$/i }));
  });

  it('Title placeholder', async () => {
    await renderCreateListingInSpanish();
    await waitFor(() => screen.getByPlaceholderText(/^Título$/i));
  });

  it('Description placeholder', async () => {
    await renderCreateListingInSpanish();
    await waitFor(() => screen.getByPlaceholderText(/^Descripción$/i));
  });

  it('Price placeholder', async () => {
    await renderCreateListingInSpanish();
    await waitFor(() => screen.getByPlaceholderText(/^Precio$/i));
  });

  it('Stock placeholder', async () => {
    await renderCreateListingInSpanish();
    await waitFor(() => screen.getByPlaceholderText(/^Existencias$/i));
  });

  it('Create Listing button', async () => {
    await renderCreateListingInSpanish();
    await waitFor(() => screen.getByRole('button', { name: /^Guardar$/i }));
  });
});

const renderCreateKeyInSpanish = async () => {
  const user = userEvent.setup();
  render(
    <>
      <LocaleSwitcher />
      <CreateKey />
    </>,
  );
  await user.selectOptions(screen.getByRole('combobox'), 'es');
};

describe('CreateKey Spanish', async () => {
  it('API Keys heading', async () => {
    await renderCreateKeyInSpanish();
    await waitFor(() => screen.getByText(/^Claves API$/i));
  });

  it('Generate API Key button', async () => {
    await renderCreateKeyInSpanish();
    await waitFor(() => screen.getByRole('button', { name: /^Generar clave API$/i }));
  });

  it('shows API key after generation', async () => {
    await renderCreateKeyInSpanish();
    await userEvent.click(screen.getByRole('button', { name: /^Generar clave API$/i }));
    await waitFor(() => screen.getByText(/^Clave API: mock-api-key$/i));
  });

  it('shows unauthorized error', async () => {
    server.use(
      http.post('/seller/api/v0/corp/generate', () => new HttpResponse(null, { status: 403 })),
    );
    await renderCreateKeyInSpanish();
    await userEvent.click(screen.getByRole('button', { name: /^Generar clave API$/i }));
    await waitFor(() => screen.getByText(/^No está autorizado para generar una clave API$/i));
  });
});
