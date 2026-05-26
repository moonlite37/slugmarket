import dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({path: path.resolve(process.cwd(), '../../.env')});

import app from './app';

app.listen(3019, '0.0.0.0', () => {
	console.log('Running RESTFul Notification Service on port 3019');
	console.log('API Testing UI: http://localhost:3019/api/v0/docs/');
});
