import {Pool} from 'pg';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config({path: path.resolve(process.cwd(), '../../.env')});

const pool = new Pool({
	host: process.env.POSTGRES_HOST ?? 'localhost',
	port: Number(process.env.POSTGRES_PORT ?? 5432),
	database: process.env.LISTING_POSTGRES_DB ?? 'listing',
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
});

const shutdown = async () => {
	await pool.end();
};

export {pool, shutdown};
