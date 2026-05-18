import dotenv from 'dotenv';
dotenv.config();

import app from './app';

app.listen(3040, '0.0.0.0', () => {
	console.log('Running RESTFul Corpo Service on port 3040');
	console.log('API Testing UI: http://localhost:3040/api/v0/docs/');
});