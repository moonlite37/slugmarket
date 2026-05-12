import dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

import app from './app';

app.listen(3011, () => {
	console.log('Running RESTFul Auth Service on port 3011');
	console.log('API Testing UI: http://localhost:3011/api/v0/docs/');
});
