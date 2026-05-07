import GlobalStyles from '@mui/material/GlobalStyles';
import Login from './Login';

function App() {
  return (
    <>
      <GlobalStyles styles={{ body: { overflow: 'hidden', margin: 0 } }} />
      <Login />
    </>
  );
}

export default App;
