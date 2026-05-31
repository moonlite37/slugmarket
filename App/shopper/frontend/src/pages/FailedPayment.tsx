import PaymentResult from './PaymentResult';

export default function FailedPayment() {
	return (
		<PaymentResult
			color="error.main"
			heading="Payment Failed"
			message="Your payment could not be processed. Please try again."
			primaryLink="/"
			primaryLabel="Back to Shop"
			secondaryLink="/cart"
			secondaryLabel="Try Again"
		/>
	);
}
