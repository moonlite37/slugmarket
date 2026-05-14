import { it, describe, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n from '@/utils/i18n';
import Login from '@/Login';
import LocaleSwitcher from '@/LocaleSwitcher';

afterEach(async () => {
  await i18n.changeLanguage('en');
});

const renderInSpanish = async () => {
  const user = userEvent.setup();
  render(
    <>
      <LocaleSwitcher />
      <Login />
    </>,
  );
  await user.selectOptions(screen.getByRole('combobox'), 'es');
};

describe('Login Spanish', () => {
  it('Sign In', async () => {
    await renderInSpanish();
    await waitFor(() => screen.getByText(/^Iniciar sesión$/i));
  });

  it('Welcome to SlugMarket', async () => {
    await renderInSpanish();
    await waitFor(() => screen.getByText(/^Bienvenido a SlugMarket$/i));
  });

  it('Sign In with google', async () => {
    await renderInSpanish();
    await waitFor(() => screen.getByText(/^Iniciar sesión con Google$/i));
  });
});
