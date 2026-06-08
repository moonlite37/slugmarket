export const CHECKOUT_ON_LOGIN_KEY = 'checkoutOnLogin';

export async function redirectToStripeCheckout(): Promise<void> {
	const res = await fetch('/shopper/api/v0/cart/checkout', {
		method: 'POST',
		credentials: 'include',
	});
	const { url } = await res.json();
	window.location.href = url;
}
