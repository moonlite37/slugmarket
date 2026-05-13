import { pool } from '../src/db';
import * as fs from 'fs';
import * as path from 'path';

export const reset = async () => {
	const sql = fs.readFileSync(
		path.resolve(__dirname, '../sql/databases.sql'),
		'utf-8',
	);
	const lines = sql.split('\n');
	let statement = '';
	for (const line of lines) {
		if (line.startsWith('--') || line.startsWith('\\') || line.startsWith('CREATE DATABASE') || line.trim() === '') {
			continue;
		}
		statement += ' ' + line + '\n';
		if (line.endsWith(';')) {
			await pool.query(statement);
			statement = '';
		}
	}
};
