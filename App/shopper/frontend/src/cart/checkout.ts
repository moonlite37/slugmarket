// Key under which a guest's intent to check out is remembered across the
// full-page OAuth redirect, so checkout can resume once they are logged in.
export const CHECKOUT_ON_LOGIN_KEY = 'checkoutOnLogin';

// Asks the backend to create a Stripe checkout session and sends the browser
// there. Shared by the cart button and the resume-after-login flow.
export async function redirectToStripeCheckout(): Promise<void> {
	const res = await fetch('/shopper/api/v0/cart/checkout', {
		method: 'POST',
		credentials: 'include',
	});
	const { url } = await res.json();
	window.location.href = url;
}
