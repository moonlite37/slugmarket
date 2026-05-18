import {Pool} from 'pg';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config({path: path.resolve(__dirname, '../../.env')});

const pool = new Pool({
	host: process.env.POSTGRES_HOST,
	port: Number(process.env.POSTGRES_PORT),
	database: process.env.CORPORATE_POSTGRES_DB,
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
});

const shutdown = async () => {
	await pool.end();
};

export {pool, shutdown};
