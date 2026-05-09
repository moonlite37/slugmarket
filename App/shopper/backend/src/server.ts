import dotenv from 'dotenv';
dotenv.config();

import app from './app';

app.listen(3012, () => {
  console.log(`Server Running on port 3012`);
});