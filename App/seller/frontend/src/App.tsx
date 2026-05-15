import GlobalStyles from '@mui/material/GlobalStyles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import CreateListing from './CreateListing';
import Dashboard from './Dashboard';
import AuthenticatedRoute from './AuthenticatedRoute';
import LocaleSwitcher from './LocaleSwitcher';
function App() {
  return (
    <>
      <GlobalStyles styles={{ body: { overflow: 'hidden', margin: 0 } }} />
      <LocaleSwitcher />
      <BrowserRouter basename="/seller">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<AuthenticatedRoute />}>
            <Route path="/listing/new" element={<CreateListing />} />
            <Route path="/" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
