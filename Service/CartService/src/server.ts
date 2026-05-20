import dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({path: path.resolve(process.cwd(), '../../.env')});

import app from './app';

app.listen(3017, '0.0.0.0', () => {
	console.log('Running RESTFul Cart Service on port 3017');
	console.log('API Testing UI: http://localhost:3017/api/v0/docs/');
});
