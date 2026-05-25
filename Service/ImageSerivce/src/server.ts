import dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({path: path.resolve(process.cwd(), '../../.env')});

import app from './app';

const port = Number(process.env.IMAGE_SERVICE_PORT ?? 3018);

app.listen(port, '0.0.0.0', () => {
	console.log(`Running RESTFul Image Service on port ${port}`);
	console.log(`API Testing UI: http://localhost:${port}/api/v0/docs/`);
});
