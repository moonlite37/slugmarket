import GlobalStyles from '@mui/material/GlobalStyles';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './Login';

function App() {
  return (
    <>
      <GlobalStyles styles={{ body: { overflow: 'hidden', margin: 0 } }} />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
