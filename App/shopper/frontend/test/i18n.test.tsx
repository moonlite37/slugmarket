import { it, describe, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n from '@/utils/i18n';
import Login from '@/Login';
import LocaleSwitcher from '@/LocaleSwitcher';
import Cart from '@/cart/list';
import { CartContextProvider } from '@/context/CartContextProvider';
import { CartContext } from '@/context/cartContext';
import FilterSidebar from '@/filter/sidebar';
import { FilterContextProvider } from '@/context/FilterContextProvider';
import ListingCard from '@/listing/card';
import { listing } from './mocks';

afterEach(async () => {
  await i18n.changeLanguage('en');
});

const renderLoginInSpanish = async () => {
  const user = userEvent.setup();
  render(
    <>
      <LocaleSwitcher />
      <Login />
    </>,
  );
  await user.selectOptions(screen.getAllByRole('combobox')[0], 'es');
};

const renderCartInSpanish = async () => {
  const user = userEvent.setup();
  render(
    <CartContextProvider>
      <LocaleSwitcher />
      <Cart />
    </CartContextProvider>,
  );
  await user.selectOptions(screen.getAllByRole('combobox')[0], 'es');
};

const renderCartInSpanishWithItems = async () => {
  const user = userEvent.setup();
  render(
    <CartContext.Provider
      value={{
        items: [{ listing_id: 'pork-chop', name: 'Pork Chop', price: 10.99, quantity: 1 }],
        addToCart: async () => {},
        removeFromCart: async () => {},
      }}
    >
      <LocaleSwitcher />
      <Cart />
    </CartContext.Provider>,
  );
  await user.selectOptions(screen.getAllByRole('combobox')[0], 'es');
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

  it('Sign In with Google', async () => {
    await renderLoginInSpanish();
    await waitFor(() => screen.getByText(/^Iniciar sesión con Google$/i));
  });
});

describe('Cart Spanish', async () => {
  it('Shopping Cart heading', async () => {
    await renderCartInSpanish();
    await waitFor(() => screen.getByText(/^Carrito de compras$/i));
  });

  it('Your Cart is Empty', async () => {
    await renderCartInSpanish();
    await waitFor(() => screen.getByText(/^Tu carrito está vacío$/i));
  });

  it('items count', async () => {
    await renderCartInSpanishWithItems();
    await waitFor(() => screen.getByText(/artículo/i));
  });

  it('Total', async () => {
    await renderCartInSpanishWithItems();
    await waitFor(() => screen.getByText(/^Total$/i));
  });
});

const renderFilterInSpanish = async () => {
  const user = userEvent.setup();
  render(
    <FilterContextProvider>
      <LocaleSwitcher />
      <FilterSidebar />
    </FilterContextProvider>,
  );
  await user.selectOptions(screen.getAllByRole('combobox')[0], 'es');
};

describe('FilterSidebar Spanish', async () => {
  it('Filters heading', async () => {
    await renderFilterInSpanish();
    await waitFor(() => screen.getByText(/^Filtros$/i));
  });

  it('Price label', async () => {
    await renderFilterInSpanish();
    await waitFor(() => screen.getByText(/^Precio$/i));
  });

  it('Min placeholder', async () => {
    await renderFilterInSpanish();
    await waitFor(() => screen.getByPlaceholderText(/^Mín$/i));
  });

  it('Max placeholder', async () => {
    await renderFilterInSpanish();
    await waitFor(() => screen.getByPlaceholderText(/^Máx$/i));
  });
});

const renderListingCardInSpanish = async () => {
  const user = userEvent.setup();
  render(
    <CartContextProvider>
      <LocaleSwitcher />
      <ListingCard listing={listing} />
    </CartContextProvider>,
  );
  await user.selectOptions(screen.getAllByRole('combobox')[0], 'es');
};

describe('ListingCard Spanish', async () => {
  it('Add to cart button', async () => {
    await renderListingCardInSpanish();
    await waitFor(() => screen.getByText(/^Agregar al carrito$/i));
  });

  it('in stock', async () => {
    await renderListingCardInSpanish();
    await waitFor(() => screen.getByText(/en stock/i));
  });

  it('Out of stock', async () => {
    const user = userEvent.setup();
    render(
      <CartContextProvider>
        <LocaleSwitcher />
        <ListingCard listing={{ ...listing, stock: 0 }} />
      </CartContextProvider>,
    );
    await user.selectOptions(screen.getAllByRole('combobox')[0], 'es');
    await waitFor(() => screen.getByText(/^Agotado$/i));
  });

  it('Sold by', async () => {
    await renderListingCardInSpanish();
    await waitFor(() => screen.getByText(/^Vendido por$/i));
  });

  it('discount % off', async () => {
    const user = userEvent.setup();
    render(
      <CartContextProvider>
        <LocaleSwitcher />
        <ListingCard listing={{ ...listing, discountPrice: 14.99 }} />
      </CartContextProvider>,
    );
    await user.selectOptions(screen.getAllByRole('combobox')[0], 'es');
    await waitFor(() => screen.getByText(/de descuento/i));
  });
});
