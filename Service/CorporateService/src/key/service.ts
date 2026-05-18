import dotenv from 'dotenv';
import * as path from 'path';
import crypto from 'crypto';
import { pool } from '../db';
import { NewListing } from '.';


dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

const LISTING_MICROSERVICE = 'http://127.0.0.1:3011/api/v0';


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
		const q = `
        INSERT INTO api_key (account, data)
        VALUES ($1, jsonb_build_object('key', crypt($2::text, gen_salt('bf'))))
        RETURNING id, account, data;
        `;
		await pool.query(q, [id, key]);
		return key;
	}

	public async check(key: string | undefined){
		const pq = 'SELECT account FROM api_key WHERE data->>\'key\' = crypt($1::text, data->>\'key\')';
		const account = (await pool.query(pq, [key])).rows[0];
		if (!account){
			return undefined;
		}
		return account;
	}
    
	public async getListing(key: string | undefined){
		const account = await this.check(key);
		if(!account){
			return;
		}
		const res = await fetch(`${LISTING_MICROSERVICE}/listing?author=${account}`, {
			method: 'GET',
		});
		return res.json();
	}

	public async deleteListing(key: string | undefined, id: string){
		const account = await this.check(key);
		if(!account){
			throw new Error('Unauthorized');
		}
		const res = await fetch(`${LISTING_MICROSERVICE}/listing/${id}`, {
			method: 'DELETE',
		});
		if(res.status !== 204){
			return false;
		}
		return true;
	}

	public async createListing(key: string | undefined, body: NewListing){
		const account = await this.check(key);
		if(!account){
			return;
		}
		const res = await fetch(`${LISTING_MICROSERVICE}/listing`, {
			method: 'POST',
			body: JSON.stringify({
				authId: account,
				...body,
			}),
		});
		return res.json();
	}
}