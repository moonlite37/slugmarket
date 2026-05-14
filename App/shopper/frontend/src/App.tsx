import GlobalStyles from '@mui/material/GlobalStyles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import ListingList from './listing/list';
import AuthenticatedRoute from './AuthenticatedRoute';

function App() {
	return (
		<>
			<GlobalStyles styles={{ body: { overflow: 'hidden', margin: 0 } }} />
			<BrowserRouter>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/" element={<ListingList />} />
					<Route element={<AuthenticatedRoute />}></Route>
				</Routes>
			</BrowserRouter>
		</>
	);
}
export default App;
