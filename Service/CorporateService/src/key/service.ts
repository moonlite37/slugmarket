import dotenv from 'dotenv';
import * as path from 'path';
import crypto from 'crypto';
import { pool } from '../db';


dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });


export class ApiService{
	public async createAPIKey(id: string){
		const prefix = 'sm_';
		const randomBytes = crypto.randomBytes(32);
		const token = randomBytes
			.toString('base64')
			.replace(/\+/g, '-')
			.replace(/\//g, '_')
			.replace(/=+$/, '');
		const key = prefix+token;
		// api key show lowkey be encrypted, will add later
		const q = `
        INSERT INTO api_key (account, data)
        VALUES ($1, jsonb_build_object('key', crypt($2::text, gen_salt('bf'))))
        RETURNING id, account, data;
        `;
		await pool.query(q, [id, key]);
		return key;
	}
}