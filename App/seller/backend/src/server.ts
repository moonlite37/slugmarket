import dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../../../.env') });

import app from './app';

app.listen(3013, '0.0.0.0', () => {
  console.log(`Server Running on port 3013`);
});
