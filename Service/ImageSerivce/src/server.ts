import dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({path: path.resolve(process.cwd(), '../../.env')});

import app from './app';

app.listen(3018, '0.0.0.0', () => {
	console.log('Running RESTFul Image Service on port 3018');
	console.log('API Testing UI: http://localhost:3018/api/v0/docs/');
});
