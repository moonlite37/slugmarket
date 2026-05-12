import {Pool} from 'pg';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config({path: path.resolve(__dirname, '../../.env')});

const pool = new Pool({
	host: process.env.POSTGRES_HOST || 'localhost',
	port: 5432,
	database: 'listing',
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
});

const shutdown = async () => {
	await pool.end();
};

export {pool, shutdown};
