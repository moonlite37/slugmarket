import GlobalStyles from '@mui/material/GlobalStyles';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './Login';
import CreateListing from './CreateListing';

function App() {
  return (
    <>
      <GlobalStyles styles={{ body: { overflow: 'hidden', margin: 0 } }} />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/listing/new" element={<CreateListing />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
