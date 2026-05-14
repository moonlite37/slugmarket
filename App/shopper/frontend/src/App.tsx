import GlobalStyles from '@mui/material/GlobalStyles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import AuthenticatedRoute from './AuthenticatedRoute';
import ShopPage from './pages/Shop';

function App() {
	return (
		<>
			<GlobalStyles styles={{ body: { overflow: 'hidden', margin: 0 } }} />
			<BrowserRouter basename="/shopper">
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/" element={<ShopPage />} />
					<Route element={<AuthenticatedRoute />}></Route>
				</Routes>
			</BrowserRouter>
		</>
	);
}
export default App;
