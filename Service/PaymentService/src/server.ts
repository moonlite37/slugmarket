import dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({path: path.resolve(process.cwd(), '../../.env')});

import app from './app';

app.listen(3016, '0.0.0.0', () => {
	console.log('Running RESTFul Payment Service on port 3016');
	console.log('API Testing UI: http://localhost:3016/api/v0/docs/');
});
