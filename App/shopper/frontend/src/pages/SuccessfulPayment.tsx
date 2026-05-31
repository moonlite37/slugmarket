import PaymentResult from './PaymentResult';

export default function SuccessfulPayment() {
	return (
		<PaymentResult
			color="success.main"
			heading="Payment Successful"
			message="Thank you for your purchase! Your order has been placed."
			primaryLink="/"
			primaryLabel="Back to Shop"
			secondaryLink="/orders"
			secondaryLabel="View Orders"
		/>
	);
}
