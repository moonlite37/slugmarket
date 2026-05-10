import GlobalStyles from '@mui/material/GlobalStyles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import CreateListing from './CreateListing';
import AuthenticatedRoute from './AuthenticatedRoute';

function App() {
  return (
    <>
      <GlobalStyles styles={{ body: { overflow: 'hidden', margin: 0 } }} />
      <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<AuthenticatedRoute />}>
              <Route path="/listing/new" element={<CreateListing />} />
            </Route>
          </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
