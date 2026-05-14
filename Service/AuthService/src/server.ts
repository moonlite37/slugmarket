import dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

import app from './app';

app.listen(3010, '0.0.0.0', () => {
	console.log('Running RESTFul Auth Service on port 3010');
	console.log('API Testing UI: http://localhost:3010/api/v0/docs/');
});
