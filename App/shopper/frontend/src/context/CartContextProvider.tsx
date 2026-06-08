import { type ReactNode, useState, useEffect, useCallback, useRef } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CartContext } from './cartContext';
import { CHECKOUT_ON_LOGIN_KEY, redirectToStripeCheckout } from '../cart/checkout';
import type { CartItem } from '../cart';

interface CartContextProviderProps {
  children: ReactNode;
}

const isLoggedIn = async (): Promise<boolean> => {
  const res = await fetch('/shopper/api/v0/protected', {
    credentials: 'include',
  });
  return res.ok;
};

export function CartContextProvider({ children }: CartContextProviderProps) {
  const { t } = useTranslation();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [resumingCheckout, setResumingCheckout] = useState(
    () => sessionStorage.getItem(CHECKOUT_ON_LOGIN_KEY) === 'true',
  );
  const hasLoaded = useRef(false);

  const checkout = useCallback(async (): Promise<void> => {
    setResumingCheckout(true);
    const res = await fetch('/shopper/api/v0/cart/sync', {
      method: 'POST',
      credentials: 'include',
    });
    const synced: CartItem[] = await res.json();
    setItems(synced);
    if (synced.length > 0) {
      await redirectToStripeCheckout();
      return;
    }
    setResumingCheckout(false);
  }, []);

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    const load = async () => {
      const authenticated = await isLoggedIn();
      setLoggedIn(authenticated);

      if (authenticated) {
        const res = await fetch('/shopper/api/v0/cart', {
          credentials: 'include',
        });
        const data = await res.json();
        const guestCart: CartItem[] = JSON.parse(
          localStorage.getItem('cart') ?? '[]',
        );
        if (guestCart.length > 0) {
          for (const item of guestCart) {
            await fetch('/shopper/api/v0/cart/item', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                item: {
                  listing_id: item.listing_id,
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity,
                  seller: item.seller,
                },
              }),
            });
          }
          localStorage.removeItem('cart');
          const merged = await fetch('/shopper/api/v0/cart', {
            credentials: 'include',
          });
          setItems(await merged.json());
        } else {
          setItems(data);
        }

        if (sessionStorage.getItem(CHECKOUT_ON_LOGIN_KEY) === 'true') {
          sessionStorage.removeItem(CHECKOUT_ON_LOGIN_KEY);
          await checkout();
        }
      } else {
        sessionStorage.removeItem(CHECKOUT_ON_LOGIN_KEY);
        setResumingCheckout(false);
        const guestCart: CartItem[] = JSON.parse(
          localStorage.getItem('cart') ?? '[]',
        );
        setItems(guestCart);
      }
    };
    load();
  }, [checkout]);

  const addToCart = async (item: CartItem) => {
    if (loggedIn) {
      await fetch('/shopper/api/v0/cart/item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          item: {
            listing_id: item.listing_id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            seller: item.seller,
          },
        }),
      });
      setItems((current) => {
        const existing = current.find((i) => i.listing_id === item.listing_id);
        if (existing) {
          return current.map((i) =>
            i.listing_id === item.listing_id ? { ...i, quantity: i.quantity + 1 } : i,
          );
        }
        return [...current, item];
      });
    } else {
      setItems((current) => {
        const existing = current.find((i) => i.listing_id === item.listing_id);
        const updated = existing
          ? current.map((i) =>
              i.listing_id === item.listing_id ? { ...i, quantity: i.quantity + 1 } : i,
            )
          : [...current, item];
        localStorage.setItem('cart', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const removeFromCart = async (listing_id: string) => {
    if (loggedIn) {
      await fetch(`/shopper/api/v0/cart/item/${listing_id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
    } else {
      setItems((current) => {
        const updated = current.filter((item) => item.listing_id !== listing_id);
        localStorage.setItem('cart', JSON.stringify(updated));
        return updated;
      });
    }
    setItems((current) => current.filter((item) => item.listing_id !== listing_id));
  };

  const syncCart = useCallback(async (): Promise<void> => {
    if (loggedIn) {
      const res = await fetch('/shopper/api/v0/cart/sync', {
        method: 'POST',
        credentials: 'include',
      });
      const synced = await res.json();
      setItems(synced);
    } else {
      const guestCart: CartItem[] = JSON.parse(localStorage.getItem('cart') ?? '[]');
      const synced: CartItem[] = [];
      for (const item of guestCart) {
        const res = await fetch(`/shopper/api/v0/listing/${item.listing_id}`);
        const listing = await res.json();
        if (!listing || listing.stock === 0) continue;
        const newPrice = listing.discountPrice ?? listing.price;
        const newQuantity = Math.min(item.quantity, listing.stock);
        synced.push({ ...item, price: newPrice, quantity: newQuantity });
      }
      localStorage.setItem('cart', JSON.stringify(synced));
      setItems(synced);
    }
  }, [loggedIn]);

  return (
    <CartContext.Provider value={{ items, loggedIn, addToCart, removeFromCart, syncCart, checkout }}>
      {resumingCheckout ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            gap: 2,
          }}
        >
          <CircularProgress />
          <Typography variant="h6">{t('Redirecting to checkout…')}</Typography>
        </Box>
      ) : (
        children
      )}
    </CartContext.Provider>
  );
}
