import { Listing } from '.';
import {pool} from '../db';

export class ListingService {
	public async getListing(): Promise<Listing[]> {
		const q = 'SELECT * FROM listing ORDER BY data->>\'created\'';
		const rows = (await pool.query(q)).rows;
		return rows.map(r => ({
			id: r.id,
			user: r.user,
			...r.data,
		}));
	}
}
