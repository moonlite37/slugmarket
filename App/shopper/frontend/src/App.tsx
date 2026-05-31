import GlobalStyles from '@mui/material/GlobalStyles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import AuthenticatedRoute from './AuthenticatedRoute';
import ShopPage from './pages/Shop';
import CartPage from './pages/Cart'
import OrderHistory from './pages/OrderHistory'
import ListingDetail from './pages/ListingDetail'
import SuccessfulPayment from './pages/SuccessfulPayment'
import FailedPayment from './pages/FailedPayment'
import { CartContextProvider } from './context/CartContextProvider';
import LocaleSwitcher from './LocaleSwitcher';

function App() {
	return (
		<>
			<GlobalStyles styles={{ body: { overflow: 'hidden', margin: 0 } }} />
			<LocaleSwitcher />
			<BrowserRouter basename="/shopper">
				<CartContextProvider>
					<Routes>
						<Route path="/login" element={<Login />} />
						<Route path="/cart" element={<CartPage />} />
						<Route path="/orders" element={<OrderHistory />} />
						<Route path="/listing/:id" element={<ListingDetail />} />
						<Route path="/payment/success" element={<SuccessfulPayment />} />
						<Route path="/payment/failed" element={<FailedPayment />} />
						<Route path="/" element={<ShopPage />} />
						<Route element={<AuthenticatedRoute />}></Route>
					</Routes>
				</CartContextProvider>
			</BrowserRouter>
		</>
	);
}
export default App;
