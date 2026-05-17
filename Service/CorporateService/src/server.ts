import dotenv from 'dotenv';
dotenv.config();

import app from './app';

app.listen(3013, () => {
	console.log('Running RESTFul Corpo Service on port 3013');
	console.log('API Testing UI: http://localhost:3013/api/v0/docs/');
});